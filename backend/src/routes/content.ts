const { Router } = require("express")
const Content = require("../models/Content")
const router = Router()
const authMW = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
import { allPaths } from "../data/consts";
import { foldersCleaner} from "../processors/fsTools";
import { resizeAndSaveS3 } from "../processors/sharp";
import { IMulterFile } from "./user";
const cache: IAllCache = require('../data/cache')
const fileSaver = require('../routes/files')
const sharp = require('sharp')
sharp.cache(false);



router.put('/splider', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {

        try {           
            const files: IMulterFile[] = req.files

            const { paths, filesList } = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                baseFolder: `${allPaths.pathToImages}/${allPaths.pathToSplider}`,
                sizes: ['full', 'carouselMaxFull', 'carouselMaxMedium', 'carouselMaxSmall']
            })

            await foldersCleaner([allPaths.pathToTemp])
            
            const splider = {
                paths,
                files: filesList
            }
            
            const exist = await Content.findOne()
            if (!exist) {
                const content = new Content({splider})
                await content.save()
                return res.status(200).json({message: {en: 'Content changed', ru: 'Контент отредактирован'}})
            } 
            await Content.findOneAndUpdate({}, {splider})
            
            cache.content.obsolete = true

            return res.status(200).json({message: {en: 'Content changed', ru: 'Контент отредактирован'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




router.get('/splider', 
    async (req, res) => {
        try {
            const err = await cache.content.control.load()
            if (err) {
                return res.status(500).json(err)
            }
            const splider = cache.content.data.splider
            
            return res.status(200).json(splider)
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




export {};

module.exports = router
