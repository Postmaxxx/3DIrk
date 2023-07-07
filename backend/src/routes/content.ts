import { IContent } from "../models/Content";
const { Router } = require("express")
const Content = require("../models/Content")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
import { makeDelay } from "../processors/makeDelay";
import { sizes } from "../data/consts";
const cache: IAllCache = require('../data/cache')
var fs = require('fs');
const fileSaver = require('../routes/files')
const sharp = require('sharp')
const path = require('path');
const fse = require('fs-extra')




router.put('/splider', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {
        try {
            //const { images } = req.body 
            const { files } = req
            
            const dir = `${process.env.pathToBase}/${process.env.pathToImages}/${process.env.pathToSplider}` //images/splider
            const dirThumb = `${dir}/thumb` //images/splider
            if (!fs.existsSync(dir)){// create all folders/subfolders for files
                await fs.mkdirSync(dir, { recursive: true });
                await fs.mkdirSync(dirThumb, { recursive: true });
            }

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

            console.log('processed'); 
            
            await makeDelay(5000)
            fs.removeSync(`${process.env.pathToTemp}`)

            /*try {
                fse.emptyDirSync('C:/Projects/3D/3dprint/backend/uploads/temp');
                console.log('All files in the directory deleted successfully');
            } catch (err) {
                console.log(err);
            }
            
            console.log('ok');*/
            /*for (const file of files) {
                const { path: imagePath } = file;
                console.log(imagePath);
                await makeDelay(1000)
                fs.unlink(imagePath)
            }*/
 

           /* const exist = await Content.findOne()
            if (!exist) {
                const content = new Content({splider: images})
                await content.save()
                return res.status(200).json({message: {en: 'Content changed', ru: 'Контент отредактирован'}})
            } 
            await Content.findOneAndUpdate({}, {splider: images})
            //console.log(1);
            
            cache.content.obsolete = true*/

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