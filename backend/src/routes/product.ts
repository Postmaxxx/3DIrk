import { Router } from 'express'
import { IAllCache } from '../data/cache'
import { IMulterFile } from './user'
import { IProduct } from '../models/Product'
import { resizeAndSaveS3 } from '../processors/sharp'
import { allPaths, imageSizes, productImageSizes } from '../data/consts'
import { folderCleanerS3 } from '../processors/aws'
const cache: IAllCache = require('../data/cache')
const Product = require("../models/Product")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const fileSaver = require('../routes/files')
const isAdmin = require('../middleware/isAdmin')


router.post('', //create
    [authMW, isAdmin],
    fileSaver,
    async(req, res) => { 
        try {
            const { price, name, text, text_short, fibers, mods, category, active } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || []  
            const product: IProduct = new Product({ price: Number(price), name, text, text_short, fibers, mods, category, active })
            

            const basePath = `${allPaths.pathToImages}/${allPaths.pathToProducts}/${product._id}`
            const {filesList} = await resizeAndSaveS3({
                files,
                clearDir: false,
                saveFormat: 'webp',
                basePath,
                sizes: productImageSizes
            })
           
            product.images = {
                files: filesList,
                basePath: `${process.env.pathToStorage}/${basePath}`,
                sizes: productImageSizes.map(size => ({
                    subFolder: size,
                    w: imageSizes[size].w,
                    h: imageSizes[size].h,
                }))
            }

            await product.save()

            cache.products.obsolete = true
            cache.catalog.obsolete = true

            return res.status(201).json({message: {en: 'Product created', ru: 'Товар создан'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




router.put('', //create
    [authMW, isAdmin],
    fileSaver,
    async(req, res) => { 
        try {
            const { price, name, text, text_short, fibers, mods, category, _id, active } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || undefined
            

            const basePath = `${allPaths.pathToImages}/${allPaths.pathToProducts}/${_id}`
            const {filesList} = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                basePath,
                sizes: productImageSizes
            })
           
            const images = {
                files: filesList,
                basePath: `${process.env.pathToStorage}/${basePath}`,
                sizes: productImageSizes.map(size => ({
                    subFolder: size,
                    w: imageSizes[size].w,
                    h: imageSizes[size].h,
                }))
            }

            await Product.findOneAndUpdate({_id}, { price, name, text, text_short, fibers, mods, category, _id, images, active })

            cache.products.obsolete = true
            cache.catalog.obsolete = true

            return res.status(200).json({message: {en: 'Product changed', ru: 'Товар отредактирован'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



router.get('', async(req, res) => { 
    try {
        const { _id } = req.query
        
        const err = await cache.products.control.load()
        if (err) {
            return res.status(500).json(err)
        }  

        const product = cache.products.data.find(item => item._id.toString() === _id)
        
        if (!product) {
            return res.status(404).json({message: {en: `Product with id ${_id} has not been found`, ru: `Товар с id ${_id} не был найден`}})
        }

        return res.status(200).json({product: {
            _id: product._id,    
            //price: product.price,    
            name: product.name,    
            text: product.text,    
            text_short: product.text_short,    
            images: product.images,    
            fibers: product.fibers,    
            mods: product.mods,
            category: product.category,
            active: product.active
        }
        })

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})




router.delete('', //delete
    [authMW, isAdmin,
        check('_id')
        .exists()
        .withMessage({en: 'No product ID provided', ru: 'Нет ID товара'})
    ], 
    async(req, res) => { 

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in request data', ru: 'Ошибки в данных запроса'}
            })
        }
        try {
            const { _id } = req.body

            const name = cache.products.data.find(item => item._id.toString() === _id).name
            
            await Product.findOneAndDelete({_id})

            cache.products.obsolete = true
            cache.catalog.obsolete = true
            await folderCleanerS3(process.env.s3BucketName, `${allPaths.pathToImages}/${allPaths.pathToProducts}/${_id}/`)
            return res.status(200).json({message: {en: `Product ${name.en} deleted`, ru: `Товар ${name.ru} удален`}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)





export {};
module.exports = router