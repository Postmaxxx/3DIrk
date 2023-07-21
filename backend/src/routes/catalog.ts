import { Router } from 'express'
import { ICatalogItem } from '../interfaces'
import { IAllCache } from '../data/cache'
import { IMulterFile } from './user'
import { IProduct } from '../models/Product'
import { resizeAndSaveS3 } from '../processors/sharp'
import { allPaths } from '../data/consts'
import { folderCleanerS3 } from '../processors/aws'
const cache: IAllCache = require('../data/cache')
const Product = require("../models/Product")
const Catalog = require("../models/Catalog")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const fileSaver = require('../routes/files')
const isAdmin = require('../middleware/isAdmin')


router.get('/list', async (req, res) => { 
    try {
        const err = await cache.catalog.control.load()
        if (err) {
            return res.status(500).json(err)
        }  
        const catalogToSend = cache.catalog.data.filter(item => item.total > 0)
        res.status(200).json({allCatalog: catalogToSend, message: {en: 'Catalog has been loaded', ru: 'Каталог был загружены'}})
    } catch (error) {
        res.status(500).json({message: {en: 'Error reading catalog from db', ru: 'Ошибка при чтении каталога из БД'}})
    }
})




router.put('/list', 
    [authMW, isAdmin,
        check('newCatalog')
            .exists()
            .withMessage({en: 'New catalog is missied', ru: 'Отсутствует новый каталог'})
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in catalog data', ru: 'Ошибки в данных каталога'}
            })
        }

        
        try {
            const newCatalog: ICatalogItem[] = req.body.newCatalog
            const oldCatalog: ICatalogItem[] = await Catalog.find({}) || []

            oldCatalog.forEach(async (oldItem) => {
                const exists = newCatalog.find(newItem => newItem._id === oldItem._id.toString())
                if (!exists) {
                    await Catalog.findOneAndDelete({_id: oldItem._id})
                } else {
                    await Catalog.findOneAndUpdate({_id: oldItem._id}, exists)
                }
            });

            newCatalog.forEach(async (newItem) => {               
                if (newItem._id) return //exists, already updated
                const newCategory = new Catalog({name: newItem.name})
                await newCategory.save()
            })

            cache.catalog.obsolete = true 

            return res.status(200).json({message: {en: 'Catalog updated', ru: 'Каталог обновлен'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)
//-------------------------------------------------------------------------------------

router.get('/category', async(req, res) => {
    try {
        const { _id, from, to } = req.query
        const err = await cache.products.control.load()
        if (err) {
            return res.status(500).json(err)
        }  
        const fromIndex = Number(from)
        const toIndex = Number(to)
        const catalogItem = cache.catalog.data.find(item => item._id.toString() === _id)
        
        if (!catalogItem) {
            return res.status(400).json({message: {en: `Category with this ${_id} does not exist`, ru: `Категория с данным ${_id} не найдена`}})
        }

        const products =  cache.products.data.filter(item => item.category.toString() === _id)
        
        if (fromIndex > products.length || fromIndex < 0 || toIndex < fromIndex) {
            return res.status(400).json({message: {en: 'Wrong input range', ru: 'Неправильный входной диапазон'}})
        }
        
        return res.status(200).json({
            products: products.slice(fromIndex, Math.min(toIndex + 1, products.length)).map(item => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                text_short: item.text_short,
                images: {
                    files: item.images.files,
                    paths: {
                        small: item.images.paths.small
                    }
                }
            }))
        })

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})

//-------------------------------------------------------------------------------------


router.post('/product', //create
    [authMW, isAdmin],
    fileSaver,
    async(req, res) => { 
        try {
            const { price, name, text, text_short, fibers, mods, category } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || []  
            const product: IProduct = new Product({ price, name, text, text_short, fibers, mods, category })
            const paths = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToProducts}/${product._id}`,
                formats: ['full', 'small', 'medium', 'preview']
            })

            product.images = {
                paths,
                files: files.map(item => item.filename)
            }

            await product.save()

            cache.products.obsolete = true
            cache.catalog.obsolete = true

            return res.status(201).json({message: {en: 'Product created', ru: 'Продукт создан'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




router.put('/product', //create
    [authMW, isAdmin],
    fileSaver,
    async(req, res) => { 
        try {
            const { price, name, text, text_short, fibers, mods, category, _id } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || undefined
            
            if (!files) {//if images was not sent save old images
                await Product.findOneAndUpdate({_id}, { price, name, text, text_short, fibers, mods, category, _id })
                cache.products.obsolete = true
                cache.catalog.obsolete = true
                return res.status(201).json({message: {en: 'Product updated', ru: 'Продукт отредактирован'}})
            }

            const paths = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToProducts}/${_id}`,
                formats: ['full', 'small', 'medium', 'preview']
            })

            const images = {
                paths,
                files: files.map(item => item.filename)
            }

            await Product.findOneAndUpdate({_id}, { price, name, text, text_short, fibers, mods, category, _id, images })

            cache.products.obsolete = true
            cache.catalog.obsolete = true

            return res.status(200).json({message: {en: 'Product changed', ru: 'Продукт отредактирован'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



router.get('/product', async(req, res) => { 
    try {
        const { _id } = req.query
        
        const err = await cache.products.control.load()
        if (err) {
            return res.status(500).json(err)
        }  

        const product = cache.products.data.find(item => item._id.toString() === _id)
        
        if (!product) {
            return res.status(404).json({message: {en: `Product with id ${_id} has not been found`, ru: `Продукт с id ${_id} не был найден`}})
        }

        return res.status(200).json({product: {
            _id: product._id,    
            price: product.price,    
            name: product.name,    
            text: product.text,    
            text_short: product.text_short,    
            images: product.images,    
            fibers: product.fibers,    
            mods: product.mods,
            category: product.category
        }
        })

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})




router.delete('/product', //cdelete
    [authMW, isAdmin,
        check('_id')
        .exists()
        .withMessage({en: 'No product ID provided', ru: 'Нет ID продукта'})
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
            return res.status(200).json({message: {en: `Product ${name.en} deleted`, ru: `Продукт ${name.ru} удален`}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



export {};
module.exports = router