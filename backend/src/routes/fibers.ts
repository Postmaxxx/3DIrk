import { IFiber } from "../models/Fiber";
const { Router } = require("express")
const router = Router()
const isAdmin = require('../middleware/isAdmin')
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Fiber = require("../models/Fiber")
import { IAllCache } from '../data/cache'
import { IMulterFile } from "./user";
import { allPaths } from "../data/consts";
import { resizeAndSave } from "../processors/sharp";
const cache: IAllCache = require('../data/cache')
const fileSaver = require('../routes/files')




router.post('/create', 
    [authMW, isAdmin],
    fileSaver, 
    async (req, res) => {       
        try {
            const { name, text, short, params, images, proscons, colors } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || []  
            const fiber: IFiber = new Fiber({ name, text, proscons, short, params, images,  colors })
            const paths = await resizeAndSave({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToFibers}/${fiber._id}`,
                formats: ['full', 'small']
            })

            fiber.images = {
                paths,
                files: files.map(item => item.filename)
            }

            await fiber.save()
            cache.fibers.obsolete = true
            return res.status(201).json({message: {en: 'Fiber has been created', ru: 'Материал создан'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)


/*
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
check('text.en')
.isLength({min: 15})
.withMessage({en: 'EN text is too short (<15)', ru: 'EN текст слишком короткий (<15)'}),
check('text.en')
.isLength({min: 15})
.withMessage({en: 'RU text is too short (<15)', ru: 'RU текст слишком короткий (<15)'}),
check('short.name.en')
.isLength({min: 1})
.withMessage({en: 'EN short-name is too short (<2)', ru: 'EN краткое имя слишком короткое (<2)'}),
check('short.name.en')
.isLength({min: 1})
.withMessage({en: 'RU short-name is too short (<2)', ru: 'RU краткое имя слишком короткое (<2)'}),
check('short.text.en')
.isLength({min: 5})
.withMessage({en: 'EN short text is too short (<5)', ru: 'EN краткий текст слишком короткий (<5)'}),
check('short.text.en')
.isLength({min: 5})
.withMessage({en: 'RU short text is too short (<5)', ru: 'RU краткий текст слишком короткий (<5)'})
],


        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in fiber data', ru: 'Ошибки в данных материала'}
            })
        }
*/


router.put('/edit', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {
        try {
            const { name, text, short, params, proscons, colors, _id } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || [] 
            
            if (files.length === 0) {
                await Fiber.findOneAndUpdate({_id}, {name, text, short, params, proscons, colors})
                cache.fibers.obsolete = true
                return res.status(201).json({message: {en: 'Fiber updated', ru: 'Материал отредактирован'}})
            }


            const paths = await resizeAndSave({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToFibers}/${_id}`,
                formats: ['full', 'small']
            })


            const images = {
                paths,
                files: files.map(item => item.filename)
            }
            
            await Fiber.findOneAndUpdate({_id}, {name, text, short, params, proscons, colors, images}) 
            cache.fibers.obsolete = true
            return res.status(201).json({message: {en: 'Fiber updated', ru: 'Материал отредактирован'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



router.get('/all', async (req, res) => {
    try {
        await cache.fibers.control.load(res)    
        return res.status(200).json({fibers: cache.fibers.data, message: {en: `Fibers loaded`, ru: `Материалы загружены`}})
    } catch (e) {
        return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
    }
})



router.delete('/delete', 
    [authMW, isAdmin,
    check('_id')
        .exists()
        .withMessage({en: 'Fiber ID missed', ru: 'Отсутствует Fiber ID'})
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
            const fiberToDelete = await Fiber.findOneAndDelete({_id}) 
            if (!fiberToDelete) {
                return res.status(404).json({message: {en: `Fiber was not found`, ru: `Материал не найден`}})
            }
            cache.fibers.obsolete = true

            await cache.fibers.control.load(res)
            return res.status(200).json({message: {en: `Fiber has been deleted`, ru: `Материал был удален`}})
        } catch (error) {
            return res.status(404).json({message: {en: `Fiber was not found`, ru: `Материал не найден`}})
        }
    
})





export {};

module.exports = router
