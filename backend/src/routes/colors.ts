const { Router } = require("express")
const Colors = require("../models/Colors")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')



router.post('/create', 
    [authMW, 
    isAdmin,
    check('name.en')
          .isLength({min: 3})
          .withMessage({en: 'EN name is too short (<4)', ru: 'EN имя слишком короткое (<4)'})
          .isLength({max: 51})
          .withMessage({en: 'EN name is too long (>50)', ru: 'EN имя слишком длинное (>50)'}),
      check('name.ru')
          .isLength({min: 3})
          .withMessage({en: 'RU name is too short (<4)', ru: 'RU имя слишком короткое (<4)'})
          .isLength({max: 51})
          .withMessage({en: 'RU name is too long (>50)', ru: 'RU имя слишком длинное (>50)'}),
      check('url.big')
          .exists()
          .withMessage({en: 'No URL full ', ru: 'Отсутствует URL большой'})
          .isURL()
          .withMessage({en: 'URL full is wrong', ru: 'URL большой неправильный'}),
      check('url.small')
          .exists()
          .withMessage({en: 'No URL small ', ru: 'Отсутствует URL маленький'})
          .isURL()
          .withMessage({en: 'URL small is wrong', ru: 'URL маленький неправильный'}),

    ],
    async (req, res) => {
        
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            console.log(errors.array().map(error => error.msg));
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in color data', ru: 'Ошибки в данных цвета'}
            })
        }
        
        try {
            const { name, url } = req.body 

            const color = new Colors({ 
                name: {
                    en: name.en.trim(),
                    ru: name.ru.trim()
                },
                url: {
                    big: url.big.trim(),
                    small: url.small.trim(),
                }
            })
            await color.save()
            return res.status(201).json({message: {en: 'Color saved', ru: 'Цвет сохранен'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)



router.get('/load-all', 
    async (req, res) => {
        try {
            const colors = await Colors.find()
            return res.status(200).json({colors, message: {en: 'Colors have been loaded', ru: 'Цвета загружены'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)



module.exports = router

export {}