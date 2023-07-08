const { Router } = require("express")
const News = require("../models/News")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
import { allPaths, delayForFS } from '../data/consts'
import { INews } from '../models/News'
import { foldersCleaner, foldersCreator } from '../processors/fsTools'
import { makeDelay } from '../processors/makeDelay'
import { imagesResizer } from '../processors/sharp'
import { IMulterFile } from './user'
const cache: IAllCache = require('../data/cache')
const fileSaver = require('../routes/files')



router.post('/create', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {       
        try {
            const newsRaw: string = req.body.news
            const { header, date, short, text } = JSON.parse(newsRaw)
            const files = req.files as IMulterFile[] || []           
            
            const news = new News({ header, date, short, text }) 
            
            const newsId = news._id

            const dirFull = `${allPaths.pathToImages}/${allPaths.pathToNews}/${newsId}` //images/news/{news_id}
            const dirMedium = `${dirFull}/medium` //images/news/{news_id}/medium
            const dirSmall = `${dirFull}/small` //images/news/{news_id}/small
            await foldersCreator([`${allPaths.pathToBase}/${dirFull}`, `${allPaths.pathToBase}/${dirMedium}`, `${allPaths.pathToBase}/${dirSmall}`])
            await makeDelay(delayForFS)

            const paths = await imagesResizer({
                files,
                format: 'webp',
                sizesConvertTo: [
                    {
                        type: 'full',
                        path: dirFull
                    },
                    {
                        type: 'medium',
                        path: dirMedium
                    },
                    {
                        type: 'small',
                        path: dirSmall
                    }
                ]
            })

            news.images = {
                paths,
                files: files.map(item => item.filename)
            }

            await foldersCleaner([allPaths.pathToTemp])
            await news.save()
            cache.news.obsolete = true
            return res.status(201).json({message: {en: 'News posted', ru: 'Новость сохранена'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)





router.put('/edit', 
    [authMW, isAdmin],
    fileSaver, 
    async (req, res) => {
        try {
            const newsRaw: string = req.body.news
            const { header, date, short, text, _id } = JSON.parse(newsRaw)
            const files = req.files as IMulterFile[] || []           
            
            if (files.length === 0) { //if images was not sent save old images
                await News.findOneAndUpdate({_id}, { header, date, short, text})
                cache.news.obsolete = true
                return res.status(200).json({message: {en: 'News changed', ru: 'Новость отредактирована'}})
            }

 
            const dirFull = `${allPaths.pathToImages}/${allPaths.pathToNews}/${_id}` //images/news/{news_id}
            const dirMedium = `${dirFull}/medium` //images/news/{news_id}/medium
            const dirSmall = `${dirFull}/small` //images/news/{news_id}/small
            await foldersCleaner([`${allPaths.pathToBase}/${dirFull}`, `${allPaths.pathToBase}/${dirMedium}`, `${allPaths.pathToBase}/${dirSmall}`])
            await makeDelay(delayForFS)
            const paths = await imagesResizer({
                files,
                format: 'webp',
                sizesConvertTo: [
                    {
                        type: 'full',
                        path: dirFull
                    },
                    {
                        type: 'medium',
                        path: dirMedium
                    },
                    {
                        type: 'small',
                        path: dirSmall
                    }
                ]
            })

            const images = {
                paths,
                files: files.map(item => item.filename)
            }

            await News.findOneAndUpdate({_id}, { header, date, short, text, images})
            
            cache.news.obsolete = true

            return res.status(200).json({message: {en: 'News changed', ru: 'Новость отредактирована'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)






router.get('/get-amount', async (req, res) => {
    try {
        await cache.news.control.load(res)
        return res.status(200).json({amount: cache.news.data.length, message: {en: '', ru: ''}})
    } catch (e) {
        return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
    }
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

    
    try {
        await cache.news.control.load(res)
        const {from, amount } = req.query;
        const since = Number(from)
        const to = Number(from) + Number(amount)
        if (since >=  cache.news.data.length) {
            return res.status(400).json({message: {en: `"From" is more than total amount of news`, ru: `"From" больше чем общее количество новостей`}})
        }
        
        const newsToRes =  cache.news.data.slice(since, to)
        
        return res.status(200).json({news: newsToRes, message: {en: `${newsToRes.length} news loaded`, ru: `Новостей загружено: ${newsToRes.length}`}})

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

    
    try {
        await cache.news.control.load(res)

        const newsToRes =  cache.news.data.find(item => {
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




router.delete('/delete', 
    [authMW, isAdmin,
    check('_id')
        .exists()
        .withMessage({en: 'News _id is messied', ru: 'Отсутствует _id новости'})
    ],
    async (req, res) => {

        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in received data', ru: 'Ошибки в полученных данных'}
            })
        }

        
        try {
            const { _id } = req.body 
            
            const newsToDelete = await News.findOneAndDelete({_id}) 
            if (!newsToDelete) {
                return res.status(404).json({message: {en: `News has not found`, ru: `Новость не найдена`}})
            }
            cache.news.obsolete = true
            await cache.news.control.load(res)
            return res.status(200).json({message: {en: `News  deleted`, ru: `Новость удалена`}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }

    }
)



export {};

module.exports = router