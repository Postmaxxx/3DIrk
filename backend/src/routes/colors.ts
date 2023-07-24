import { IAllCache } from '../data/cache'
import { allPaths } from '../data/consts'
const cache: IAllCache = require('../data/cache')
import { IColor } from "../models/Color"
import { folderCleanerS3 } from '../processors/aws'
import { resizeAndSaveS3 } from '../processors/sharp'
import { IMulterFile } from './user'
const { Router } = require("express")
const Colors = require("../models/Color")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
const fileSaver = require('../routes/files')


router.post('/create', 
    [authMW, 
    isAdmin],
    fileSaver,
    async (req, res) => {
        try {
            const dataRaw: string = req.body.data           
            const { name } = JSON.parse(dataRaw)
            const files = req.files as IMulterFile[] || []

            const color: IColor = new Colors({ name })
            const colorId = color._id

            const paths = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToColors}/${colorId}`,
                formats: ['full', 'thumb']
            })

            color.images = {
                paths: {
                    full: paths.full,
                    thumb: paths.thumb
                },
                files: {
                   full: files[0].filename,
                   thumb: files[1].filename 
                }
            }
            
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
    isAdmin],
    fileSaver,
    async (req, res) => {
        try {       
            const { name, _id, changeImages } = JSON.parse(req.body.data )
            const files = req.files as IMulterFile[] || undefined
            
            if (!changeImages) { //if images was not sent save old images
                await Colors.findOneAndUpdate({_id}, {name})
                cache.colors.obsolete = true
                return res.status(200).json({message: {en: 'Color saved', ru: 'Цвет сохранен'}})
            }

            const paths = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToColors}/${_id}`,
                formats: ['full', 'thumb']
            })

            const images = {
                paths: {
                    full: paths.full,
                    thumb: paths.thumb
                },
                files: {
                   full: files[0].filename,
                   thumb: files[1].filename 
                }
            }

            await Colors.findOneAndUpdate({_id}, {name, images}) 

            cache.colors.obsolete = true
            cache.fibers.obsolete = true
            
            return res.status(200).json({message: {en: 'Color saved', ru: 'Цвет сохранен'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)



router.get('/load-all', async (req, res) => {
    try {
        const err = await cache.colors.control.load()
        if (err) {
            return res.status(500).json(err)
        }  
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
            await folderCleanerS3(process.env.s3BucketName, `${allPaths.pathToImages}/${allPaths.pathToColors}/${_id}/`)
            return res.status(200).json({message: {en: 'Color deleted', ru: 'Цвет удален'}})
        } catch (e) {
            return res.status(500).json({ message:{en: `Something wrong with server ${e}, try again later`, ru: `Ошибка на сервере ${e}, попробуйте позже`}})
        }
    }
)


module.exports = router

export {}