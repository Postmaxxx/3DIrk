import { ICatalogItem, IImgWithThumb } from "../../../src/interfaces"
import { IColor } from "../models/Color"
import { IContent } from "../models/Content"
import { IFiber } from "../models/Fiber"
import { INews } from "../models/News"
import { IProduct } from "../models/Product"
const Product = require("../models/Product")
const Catalog = require("../models/Catalog")
const News = require("../models/News")
const Fiber = require("../models/Fiber")
const Colors = require("../models/Color")
const Content = require("../models/Content")
import {Request, Response} from 'express';

const loadCatalog = async (res?: Response)=> {
    if (allCatalog.obsolete) {
        try {  
            await loadProducts(res)
            const rawCatalog: ({__v: string} & ICatalogItem)[] = await Catalog.find()
            
            const amounts: {[key:string]: number} = {}    
            allProducts.data.forEach(product => {
                amounts[product.category.toString()] ? amounts[product.category.toString()]++ : amounts[product.category.toString()] = 1     
            })
            
            allCatalog.data = rawCatalog.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    total: amounts[item._id.toString()] || 0
                }
            })

            allCatalog.obsolete = false

        } catch (e) {
            if (res)  {
                return res.status(400).json({message: {en: `Error while loading catalog from db: ${e}`, ru: `Ошибка при получении каталога из базы данных: ${e}`}})
            }
        }
    }
}


const loadProducts = async (res?: Response)=> {
    if (allProducts.obsolete) {
        try {     
            allProducts.data = await Product.find()
            allProducts.obsolete = false
        } catch (e) {
            if (res) {
                return res.status(400).json({message: {en: `Error while loading products from db: ${e}`, ru: `Ошибка при получении товаров из базы данных: ${e}`}})
            }
        }
    }
}


const loadColors = async (res?: Response) => {
    if (allColors.obsolete) {
        try {  
            allColors.data = await Colors.find()
            allColors.obsolete = false
        } catch (e) {
            if (res) {
                return res.status(400).json({message: {en: `Error while loading colors from db: ${e}`, ru: `Ошибка при получении цветов из базы данных: ${e}`}})
            } 
        }
    }
}


const loadNews = async (res?: Response) => {
    if (allNews.obsolete) {
        try {  
            const newsList: INews[] = await News.find()
            allNews.data = newsList.sort((a,b) => (a.date > b.date) ? -1 : 1)
            allNews.obsolete = false
        } catch (e) {
            if (res) return res.status(400).json({message: {en: `Error while loading news from db: ${e}`, ru: `Ошибка при получении новостей из базы данных: ${e}`}})
        }
    }
}


const loadContent = async (res?: Response) => {
    if (allContent.obsolete) {
        try {  
            const content: IContent = await Content.findOne({})
            //console.log(content.splider);
            allContent.data.splider = content.splider
            allContent.obsolete = false
        } catch (e) {
            if (res) { 
                return res.status(400).json({message: {en: `Error while loading cщntent from db: ${e}`, ru: `Ошибка при получении контента из базы данных: ${e}`}})
            }
        }
    }
}


const loadFibers = async (res?: Response) => {
    if (allFibers.obsolete) {
        try {  
            allFibers.data = await Fiber.find()           
            allFibers.obsolete = false
        } catch (e) {
            if (res) { 
                return res.status(400).json({message: {en: `Error while loading fibers from db: ${e}`, ru: `Ошибка при получении материалов из базы данных: ${e}`}})
            }
        }
    }
}


interface IAllProducts {
    data: ({__v: string} & IProduct)[] //with __V
    obsolete: boolean
    control: {
        load: typeof loadProducts
    }
}
const allProducts:IAllProducts = {
    data: [],
    obsolete: true,
    control: {
        load: loadProducts
    }
}


interface IAllCatalog {
    data: ICatalogItem[]
    obsolete: boolean
    control: {
        load: typeof loadCatalog
    }
}
const allCatalog:IAllCatalog = {
    data: [],
    obsolete: true,
    control: {
        load: loadCatalog
    }
}


interface IAllColors {
    data: IColor[]
    obsolete: boolean
    control: {
        load: typeof loadColors
    }
}
const allColors:IAllColors = {
    data: [],
    obsolete: true,
    control: {
        load: loadColors
    }
}


interface IAllNews {
    data: INews[]
    obsolete: boolean
    control: {
        load: typeof loadNews
    }
}
const allNews:IAllNews = {
    data: [],
    obsolete: true,
    control: {
        load: loadNews
    }
}


interface IAllContent {
    data: {
        splider: IImgWithThumb[]
    }
    obsolete: boolean
    control: {
        load: typeof loadContent
    }
}
const allContent:IAllContent = {
    data: {
        splider: []
    },
    obsolete: true,
    control: {
        load: loadContent
    }
}

interface IAllFibers {
    data: IFiber[]
    obsolete: boolean
    control: {
        load: typeof loadFibers
    }
}
const allFibers:IAllFibers = {
    data: [],
    obsolete: true,
    control: {
        load: loadFibers
    }
}


interface IAllCache {
    products: typeof allProducts
    colors: typeof allColors
    catalog: typeof allCatalog
    news: typeof allNews
    fibers: typeof allFibers
    content: typeof allContent
}

const allCache = {
    products: allProducts,
    colors: allColors,
    catalog: allCatalog,
    news: allNews,
    fibers: allFibers,
    content: allContent
}


module.exports = allCache

export {IAllCache}