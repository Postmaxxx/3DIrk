import { ICatalogItem, IImageSubFolder, IImages, TLangText } from "../interfaces"
import { IColor } from "../models/Color"
import { IContent } from "../models/Content"
import { IFiber } from "../models/Fiber"
import { INews } from "../models/News"
import { IProduct } from "../models/Product"
//import { imageSizes } from "./consts"
const Product = require("../models/Product")
const Catalog = require("../models/Catalog")
const News = require("../models/News")
const Fiber = require("../models/Fiber")
const Colors = require("../models/Color")
const Content = require("../models/Content")

const loadCatalog = async ()=> {
    if (allCatalog.obsolete) {
        try {  
            const err = await loadProducts()
            if (err) {
                return {message: {en: `Error while loading products from db: ${err}`, ru: `Ошибка при получении товаров из базы данных: ${err}`}}
            }  
            const rawCatalog: ({__v: string} & ICatalogItem)[] = await Catalog.find()
            
            const amounts: {[key:string]: number} = {}    
            const amountsActive: {[key:string]: number} = {}    
            allProducts.data.forEach(product => {
                amounts[product.category.toString()] ? amounts[product.category.toString()]++ : amounts[product.category.toString()] = 1     
                amountsActive[product.category.toString()] && product.active ? amountsActive[product.category.toString()]++ : amountsActive[product.category.toString()] = 1     
            })
            
            allCatalog.data = rawCatalog.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    total: amounts[item._id.toString()] || 0,
                    active: amountsActive[item._id.toString()] || 0,
                }
            })
            allCatalog.obsolete = false

        } catch (e) {
            return {message: {en: `Error while loading catalog from db: ${e}`, ru: `Ошибка при получении каталога из базы данных: ${e}`}}
        }
    }
}


const loadProducts = async ()=> {
    if (allProducts.obsolete) {
        try {     
            allProducts.data = await Product.find()
            allProducts.obsolete = false
        } catch (e) {
            return {message: {en: `Error while loading products from db: ${e}`, ru: `Ошибка при получении товаров из базы данных: ${e}`}}
        }
    }
}


const loadColors = async () => {
    if (allColors.obsolete) {
        try {  
            allColors.data = await Colors.find()
            allColors.obsolete = false
        } catch (e) {
            return {message: {en: `Error while loading colors from db: ${e}`, ru: `Ошибка при получении цветов из базы данных: ${e}`}}
            /*if (res) {
                return res.status(400).json({message: {en: `Error while loading colors from db: ${e}`, ru: `Ошибка при получении цветов из базы данных: ${e}`}})
            } */
        }
    }
}


const loadNews = async () => {
    if (allNews.obsolete) {
        try {
            const newsList: INews[] = await News.find()
            allNews.data = newsList
                .sort((a,b) => {
                    return new Date(a.date) > new Date(b.date) ? -1 : 1
                })
                .map(news => ({
                    _id: news._id,
                    header: news.header,
                    date: news.date,
                    short: news.short,
                    text: news.text, 
                    images: news.images
                }))
            allNews.obsolete = false
        } catch (e) {
            return {message: {en: `Error while loading news from db: ${e}`, ru: `Ошибка при получении новостей из базы данных: ${e}`}}
            //if (res) return res.status(400).json({message: {en: `Error while loading news from db: ${e}`, ru: `Ошибка при получении новостей из базы данных: ${e}`}})
        }
    }
}


const loadContent = async () => {
    if (allContent.obsolete) {
        try {  
            const content: IContent = await Content.findOne({})
            allContent.data.carousel = {
                images: content.carousel.images
            }
            allContent.obsolete = false
        } catch (e) {
            return {message: {en: `Error while loading content from db: ${e}`, ru: `Ошибка при получении контента из базы данных: ${e}`}}
            /*if (res) { 
                return res.status(400).json({message: {en: `Error while loading content from db: ${e}`, ru: `Ошибка при получении контента из базы данных: ${e}`}})
            }*/
        }
    }
}


const loadFibers = async () => {
    if (allFibers.obsolete) {
        try {  
            allFibers.data = await Fiber.find()           
            allFibers.obsolete = false
        } catch (e) {
            return {message: {en: `Error while loading fibers from db: ${e}`, ru: `Ошибка при получении материалов из базы данных: ${e}`}}
            /*if (res) { 
                return res.status(400).json({message: {en: `Error while loading fibers from db: ${e}`, ru: `Ошибка при получении материалов из базы данных: ${e}`}})
            }*/
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





interface INewsToFE {
    _id: string
    date: Date
    header: TLangText
    short: TLangText
    text: TLangText
    images: IImages
}

interface IAllNews {
    data: INewsToFE[]
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
    data: IContent
    obsolete: boolean
    control: {
        load: typeof loadContent
    }
}
const allContent = {
    data: {
        carousel: {}
    },
    obsolete: true,
    control: {
        load: loadContent
    }
} as IAllContent

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