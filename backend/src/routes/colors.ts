import { IAllCache } from '../data/cache'
const cache: IAllCache = require('../data/cache')
import { IColor } from "../models/Color"

const { Router } = require("express")
const Colors = require("../models/Color")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

//let allColors: IColor[] = []

router.post('/create', 
    [authMW, 
    isAdmin,
    check('name.en')
          .isLength({min: 3})
          .withMessage({en: 'EN name is too short (<3)', ru: 'EN имя слишком короткое (<3)'})
          .isLength({max: 51})
          .withMessage({en: 'EN name is too long (>50)', ru: 'EN имя слишком длинное (>50)'}),
      check('name.ru')
          .isLength({min: 3})
          .withMessage({en: 'RU name is too short (<3)', ru: 'RU имя слишком короткое (<3)'})
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
            //console.log(errors.array().map(error => error.msg));
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in color data', ru: 'Ошибки в данных цвета'}
            })
        }
        
        try {
            const { name, url } = req.body 

            const color = new Colors({ 
                name,
                url
            })
            await color.save()
            cache.colors.obsolete = true
            cache.fibers.obsolete = true
            return res.status(201).json({message: {en: 'Color saved', ru: 'Цвет сохранен'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)




router.put('/edit', 
    [authMW, 
    isAdmin,
    check('name.en')
          .isLength({min: 3})
          .withMessage({en: 'EN name is too short (<3)', ru: 'EN имя слишком короткое (<3)'})
          .isLength({max: 51})
          .withMessage({en: 'EN name is too long (>50)', ru: 'EN имя слишком длинное (>50)'}),
      check('name.ru')
          .isLength({min: 3})
          .withMessage({en: 'RU name is too short (<3)', ru: 'RU имя слишком короткое (<3)'})
          .isLength({max: 51})
          .withMessage({en: 'RU name is too long (>50)', ru: 'RU имя слишком длинное (>50)'}),
    ],
    async (req, res) => {
        
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            //console.log(errors.array().map(error => error.msg));
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in color data', ru: 'Ошибки в данных цвета'}
            })
        }
        
        try {
            const { _id, name, url } = req.body 

            const editedColor = url ? {name, url} : {name}

            await Colors.findOneAndUpdate({_id}, editedColor) 

            cache.colors.obsolete = true
            cache.fibers.obsolete = true
            
            return res.status(200).json({message: {en: 'Color saved', ru: 'Цвет сохранен'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)


/*
const loadColors = async (res): Promise<{loaded: boolean, msg: string}> => {
    if (allColors.length === 0 || cacheStatus.colors) {
        try {  
            allColors = await Colors.find()
            cache.colors.obsolete = false
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading colors from db: ${e}`, ru: `Ошибка при получении цветов из базы данных: ${e}`}})
        }
    }
}
*/

router.get('/load-all', async (req, res) => {
    try {
        await cache.colors.control.load(res)
        return res.status(200).json({colors: cache.colors.data, message: {en: 'Colors have been loaded', ru: 'Цвета загружены'}})
    } catch (e) {
        return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
    }
})



router.delete('/delete', 
    [authMW, 
    isAdmin,
    check('_id')
          .exists()
          .withMessage({en: 'id missed', ru: 'не указан id'})
    ],
    async (req, res) => {
        
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            //console.log(errors.array().map(error => error.msg));
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in color data', ru: 'Ошибки в данных цвета'}
            })
        }
        
        try {
            const { _id } = req.body 
            await Colors.findOneAndDelete({_id})
            cache.colors.obsolete = true
            cache.fibers.obsolete = true
            return res.status(200).json({message: {en: 'Color deleted', ru: 'Цвет удален'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)


module.exports = router

export {}