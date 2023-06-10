export {};
const { Router } = require("express")
const News = require("../models/News")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')




router.post('/create', 
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
                message: {en: 'Errors in news data:', ru: 'Ошибки в данных новости:'}
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
            res.status(201).json({message: {en: 'News saved', ru: 'Новость сохранена'}})
    
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)













router.get('/get', async (req, res) => {
    try {
        const newsList = await News.findAll()
        console.log(newsList);



    } catch (error) {
        
    }


})











module.exports = router