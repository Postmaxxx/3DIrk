import { INews } from "../models/News";
import { saveChanges, checkChanges } from '../processors/changes'
const { Router } = require("express")
const News = require("../models/News")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

let allNews = [] as INews[] //for caching news

router.post('/create', 
    [authMW, isAdmin],
    [
        check('header.en')
            .isLength({min: 3})
            .withMessage({en: 'EN header is too short (<4)', ru: 'EN заголовок слишком короткий (<4)'})
            .isLength({max: 51})
            .withMessage({en: 'EN header is too long (>50)', ru: 'EN заголовок слишком длинный (>50)'}),
        check('header.ru')
            .isLength({min: 3})
            .withMessage({en: 'RU header is too short (<4)', ru: 'RU заголовок слишком короткий (<4)'})
            .isLength({max: 51})
            .withMessage({en: 'RU header is too long (>50)', ru: 'RU заголовок слишком длинный (>50)'}),
        check('text.en')
            .isLength({min: 15})
            .withMessage({en: 'EN text is too short (<15)', ru: 'EN текст слишком короткий (<15)'}),
        check('text.en')
            .isLength({min: 15})
            .withMessage({en: 'RU text is too short (<15)', ru: 'RU текст слишком короткий (<15)'})
    ],
    async (req, res) => {

        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in news data', ru: 'Ошибки в данных новости'}
            })
        }

        try {
            const { header, date, short, text, images} = req.body 
            const imagesToSave = images.map(image => {
                return {
                    url: image.url,
                    name: {
                        en: image.name.en,
                        ru: image.name.ru
                    }
                }
            }).filter(image => image.url)

            const news = new News({ header, date, short, text, images: imagesToSave})
            
            await news.save()

            await saveChanges('news', true);

            res.status(201).json({message: {en: 'News posted', ru: 'Новость сохранена'}})
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




const loadNews = async (res): Promise<{loaded: boolean, msg: string}> => {
    const changed = await checkChanges('news')

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




router.get('/get-amount', async (req, res) => {
    await loadNews(res)
    res.status(200).json({amount: allNews.length, message: {en: '', ru: ''}})
})




router.get('/get-some', 
    [
        check('from')
            .exists()
            .withMessage({en: 'Param "from" is missed', ru: 'Отсутствует параметр from'}),
        check('amount')
            .exists()
            .withMessage({en: 'Param "amount" is missed', ru: 'Отсутствует параметр amount'})
    ],
    async (req, res) => {
        
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({message: {en: `Wrong params`, ru: `Неправильные параметры`}, errors: validationResult})
    }

    await loadNews(res)

    try {
        const {from, amount } = req.query;
        const since = Number(from)
        const to = Number(from) + Number(amount)
        if (since >= allNews.length) {
            return res.status(400).json({message: {en: `"From" is more than total amount of news`, ru: `"From" больше чем общее количество новостей`}})
            
        }
        
        const newsToRes = allNews.slice(since, to)
        
        return res.status(200).json({news: newsToRes, total: allNews.length, message: {en: `${newsToRes.length} news loaded`, ru: `Новостей загружено: ${newsToRes.length}`}})

    } catch (error) {
        return res.status(400).json({message: {en: `Error with server while getting news`, ru: `Ошибка при получении новостей с сервера`}})
    }

})



router.get('/get-one', 
    [
        check('_id')
            .exists()
            .withMessage({en: 'Param "_id" is missed', ru: 'Отсутствует параметр "_id"'}),
    ],
    async (req, res) => {
        
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({message: {en: `Wrong params`, ru: `Неправильные параметры`}, errors: validationResult})
    }
    const {_id } = req.query;

    await loadNews(res)

    try {

        const newsToRes = allNews.find(item => {
            return item._id.valueOf() === _id
        })
        
        if (!newsToRes) {
            return res.status(401).json({message: {en: `No news with the id: ${_id} has been found`, ru: `Новость с _id: ${_id} не найдена`}})
        }
    
        return res.status(200).json({news: newsToRes, message: {en: `news loaded: ${_id}`, ru: `Новостей загружена: ${_id}`}})

    } catch (e) {
        return res.status(400).json({message: {en: `Error with server while getting news id: ${_id} : ${e}`, ru: `Ошибка при получении новости id: ${_id} с сервера: ${e}`}})
    }

})


export {};

module.exports = router