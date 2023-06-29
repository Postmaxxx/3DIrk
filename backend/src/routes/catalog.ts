import { Router } from 'express'
import { ICatalogItem, IProduct } from '../../../src/interfaces'
import { cacheStatus } from '../app'
const Product = require("../models/Product")
const Catalog = require("../models/Catalog")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

let allCatalog: ICatalogItem[] = []
let allProducts: ({__v: string} & IProduct)[]  = []


const loadCatalog = async (res): Promise<{loaded: boolean, msg: string}> => {
    if (allCatalog.length === 0 || cacheStatus.catalog) {
        try {  
            await loadProducts(res)
            const rawCatalog: ({__v: string} & ICatalogItem)[] = await Catalog.find()
            
            const amounts: {[key:string]: number} = {}    
            allProducts.forEach(product => {
                amounts[product.category.toString()] ? amounts[product.category.toString()]++ : amounts[product.category.toString()] = 1     
            })
            
            allCatalog = rawCatalog.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    total: amounts[item._id.toString()] || 0
                }
            })

            cacheStatus.catalog = false

        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading catalog from db: ${e}`, ru: `Ошибка при получении каталога из базы данных: ${e}`}})
        }
    }
}



router.get('/list', async (req, res) => { 
    try {
        await loadCatalog(res)      
        res.status(200).json({allCatalog, message: {en: 'Catalog has been loaded', ru: 'Каталог был загружены'}})
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

            cacheStatus.catalog = true 

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
        await loadProducts(res)


        console.log(_id, from,to);
        












        const product = allProducts.find(item => item.valueOf() === _id)
        
        
        if (!product) {
            return res.status(404).json({message: {en: `Product with id ${_id} has not been found`, ru: `Продукт с id ${_id} не был найден`}})
        }
        return res.status(200).json({product})

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})

//-------------------------------------------------------------------------------------

const loadProducts = async (res): Promise<{loaded: boolean, msg: string}> => {
    if (allProducts.length === 0 || cacheStatus.products) {
        try {     
            allProducts = await Product.find()
            cacheStatus.products = false
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading products from db: ${e}`, ru: `Ошибка при получении товаров из базы данных: ${e}`}})
        }
    }
}


router.post('/product', //create
    [authMW, isAdmin,
        check('name.en')
        .isLength({min: 2})
        .withMessage({en: 'EN name is too short (<2)', ru: 'EN имя слишком короткое (<2)'})
        .isLength({max: 40})
        .withMessage({en: 'EN name is too long (>40)', ru: 'EN имя слишком длинное (>40)'})
    ], //!!!add Validation
    async(req, res) => { 

        /*const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in product data', ru: 'Ошибки в данных продукта'}
            })
        }*/
        try {
            const { images, price, name, text, text_short, fibers, mods, category } = req.body.product
            
            const newProduct = new Product({images, price, name, text, text_short, fibers, mods, category})
    
            await newProduct.save()
            cacheStatus.products = true

            return res.status(201).json({message: {en: 'Product created', ru: 'Продукт создан'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)





router.get('/product', async(req, res) => { 
    try {
        const { _id } = req.query

        await loadProducts(res)

        const product = allProducts.find(item => item.valueOf() === _id)
        if (!product) {
            return res.status(404).json({message: {en: `Product with id ${_id} has not been found`, ru: `Продукт с id ${_id} не был найден`}})
        }
        return res.status(200).json({product})

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})




module.exports = router
export {};