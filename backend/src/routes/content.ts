import { IContent } from "../models/Content";
const { Router } = require("express")
const Content = require("../models/Content")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
import { makeDelay } from "../processors/makeDelay";
import { allPaths, delayForFS } from "../data/consts";
import { foldersCleaner} from "../processors/fsTools";
import { imagesResizer } from "../processors/sharp";
import { IMulterFile } from "./user";
const cache: IAllCache = require('../data/cache')
var fs = require('fs');
const fileSaver = require('../routes/files')
const sharp = require('sharp')
sharp.cache(false);



router.put('/splider', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {
        try {           
            const files: IMulterFile[] = req.files
            const dirFull = `${allPaths.pathToImages}/${allPaths.pathToSplider}` //images/splider
            const dirSmall = `${dirFull}/small` //images/splider/small
            console.log(dirFull, dirSmall);
            await foldersCleaner([`${allPaths.pathToBase}/${dirFull}`, `${allPaths.pathToBase}/${dirSmall}`])
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
                        type: 'spliderMain',
                        path: dirSmall
                    }
                ]
            })

            await foldersCleaner([allPaths.pathToTemp])
            
            const splider = {
                paths,
                files: files.map(item => item.filename)
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
            cache.content.control.load(res)
            const splider = cache.content.data.splider
            return res.status(200).json(splider)
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




export {};

module.exports = router

/*
            for (const file of files) {
                const { path, filename } = file;
                const outputPathThumb = `${dirThumb}/${filename}`;
                const outputPathFull = `${dir}/${filename}`;
                try {
                    await sharp(path)
                        .resize({
                            width: sizes.thumb.w,
                            height: sizes.thumb.h,
                            fit: 'outside' 
                        }) 
                        .toFormat("webp")
                        .toFile(outputPathThumb)

                    await sharp(path)
                        .toFormat("webp")
                        .toFile(outputPathFull)

                } catch (error) {
                    console.log(error);
                }
            }
            */