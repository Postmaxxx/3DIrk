import { IFiber } from "../models/Fiber";
import { saveChanges, checkChanges } from '../processors/changes'
const { Router } = require("express")
const router = Router()
const isAdmin = require('../middleware/isAdmin')
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Fiber = require("../models/Fiber")




const fibers: IFiber[] = []





router.get('/get-fibers-list', async (req, res) => {
    res

})



const loadFibers = async (res): Promise<{loaded: boolean, msg: string}> => {
    const changed = await checkChanges('fibers')

    if (allNews.length === 0 || changed) {
        try {  
            const newsList: INews[] = await News.find()
            allNews = newsList.sort((a,b) => (a.date > b.date) ? -1 : 1)
            await saveChanges('news', false);
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading news from db: ${e}`, ru: `Ошибка при получении новостей из базы данных: ${e}`}})
        }
    }
}



export default router
