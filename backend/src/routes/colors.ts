import { IColor } from "../models/Color"
import { checkChanges, saveChanges } from "../processors/changes"

const { Router } = require("express")
const Colors = require("../models/Color")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

let allColors: IColor[] = []

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
      check('url.full')
          .exists()
          .withMessage({en: 'No URL full ', ru: 'Отсутствует URL full'})
          .isURL()
          .withMessage({en: 'URL full is wrong', ru: 'URL full неправильный'}),
      check('url.small')
          .exists()
          .withMessage({en: 'No URL small ', ru: 'Отсутствует URL small'})
          .isURL()
          .withMessage({en: 'URL small is wrong', ru: 'URL small неправильный'}),

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
                    full: url.full.trim(),
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



const loadColors = async (res): Promise<{loaded: boolean, msg: string}> => {
    const changed = await checkChanges('colors')

    if (allColors.length === 0 || changed) {
        try {  
            allColors = await Colors.find()
            await saveChanges('colors', false);
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading colors from db: ${e}`, ru: `Ошибка при получении цветов из базы данных: ${e}`}})
        }
    }
}

router.get('/load-all', 
    async (req, res) => {
        try {
            await loadColors(res)
            return res.status(200).json({colors: allColors, message: {en: 'Colors have been loaded', ru: 'Цвета загружены'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)


module.exports = router

export {}