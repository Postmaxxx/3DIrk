import { Router } from 'express'
import { ICatalogItem } from '../../../src/interfaces'
const cache: IAllCache = require('../data/cache')
import { IProduct } from '../models/Product'
import { IAllCache } from '../data/cache'
const Product = require("../models/Product")
const Catalog = require("../models/Catalog")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

/*
let allCatalog: ICatalogItem[] = [] //wo __v
let allProducts: ({__v: string} & IProduct)[]  = [] //with __V


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

*/

router.get('/list', async (req, res) => { 
    try {
        await cache.catalog.control.load(res)      
        res.status(200).json({allCatalog: cache.catalog.data , message: {en: 'Catalog has been loaded', ru: 'Каталог был загружены'}})
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

        const fromIndex = Number(from)
        const toIndex = Number(to)
        const catalogItem = allCatalog.find(item => item._id.toString() === _id)
        
        if (!catalogItem) {
            return res.status(400).json({message: {en: `Category with this ${_id} does not exist`, ru: `Категория с данным ${_id} не найдена`}})
        }

        const products = allProducts.filter(item => item.category.toString() === _id)
        
        if (fromIndex > products.length || fromIndex < 0 || toIndex < fromIndex) {
            return res.status(400).json({message: {en: 'Wrong input range', ru: 'Неправильный входной диапазон'}})
        }
        
        return res.status(200).json({
            products: products.slice(fromIndex, Math.min(toIndex + 1, products.length)).map(item => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                text_short: item.text_short,
                image: item.images[0]
            }))
        })

    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
})

//-------------------------------------------------------------------------------------
/*
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

*/
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
            cacheStatus.catalog = true

            return res.status(201).json({message: {en: 'Product created', ru: 'Продукт создан'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




router.put('/product', //create
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
            const { _id, images, price, name, text, text_short, fibers, mods, category } = req.body.product
            
            const editedProducts = images ? { images, price, name, text, text_short, fibers, mods, category } : {price, name, text, text_short, fibers, mods, category}

            await Product.findOneAndUpdate({_id}, editedProducts) 

            cacheStatus.products = true
            cacheStatus.catalog = true

            return res.status(200).json({message: {en: 'Product changed', ru: 'Продукт отредактирован'}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



router.get('/product', async(req, res) => { 
    try {
        const { _id } = req.query
        
        await loadProducts(res)

        const product = allProducts.find(item => item._id.toString() === _id)
        
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

            const name = allProducts.find(item => item._id.toString() === _id).name
            
            await Product.findOneAndDelete({_id})

            cacheStatus.products = true
            cacheStatus.catalog = true

            return res.status(200).json({message: {en: `Product ${name.en} deleted`, ru: `Продукт ${name.ru} удален`}})    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



export {};
module.exports = router