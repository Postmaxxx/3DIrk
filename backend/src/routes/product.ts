import { cacheStatus } from "../app"
import { IProduct } from "../models/Product"

const { Router } = require("express")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
const Product = require("../models/Product")


let allProducts:IProduct[] = []


const loadProducts = async (res): Promise<{loaded: boolean, msg: string}> => {
    if (allProducts.length === 0 || cacheStatus.products) {
        try {  
            const productList: IProduct[] = await Product.find()
            allProducts = productList
            cacheStatus.products = false
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading products from db: ${e}`, ru: `Ошибка при получении товаров из базы данных: ${e}`}})
        }
    }
}


router.post('/item', //create
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





router.get('/item', async(req, res) => { 
    try {
        const { _id } = req.body.product

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



export {}
module.exports = router
