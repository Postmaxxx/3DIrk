const { Router } = require("express")
const News = require("../models/News")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
import { allPaths, imageSizes, newsImageSizes } from '../data/consts'
import { folderCleanerS3 } from '../processors/aws'
import { foldersCleaner } from '../processors/fsTools'
import { resizeAndSaveS3 } from '../processors/sharp'
import { IMulterFile } from './user'
const cache: IAllCache = require('../data/cache')
const fileSaver = require('../routes/files')


 /**
  * @swagger
  * tags:
  *   name: News
  *   description: The news managing API
  */




/**
 * @swagger
 * /api/news:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new news
 *     tags: [News]
 *     parameters:
 *       - in: header
 *         name: enctype
 *         description: Content type of the request
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsItemNew'
 *     responses:
 *       201:
 *         description: The news created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageSuccess'
 *       500:
 *         description: Error on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */


router.post('', 
    [authMW, isAdmin],
    fileSaver,
    async (req, res) => {       
        try {
            const { header, date, short, text } = JSON.parse(req.body.data)
            const files = req.files as IMulterFile[] || []           
            const news = new News({ header, date, short, text }) 

            const basePath = `${allPaths.pathToImages}/${allPaths.pathToNews}/${news._id}`
            const { filesList } = await resizeAndSaveS3({
                files,
                clearDir: false,
                saveFormat: 'webp',
                basePath,
                sizes: newsImageSizes
            })

            news.images = {
                files: filesList,
                basePath: `${process.env.pathToStorage}/${basePath}`,
                sizes: newsImageSizes.map(size => ({
                    subFolder: size,
                    w: imageSizes[size].w,
                    h: imageSizes[size].h,
                }))
            }

            await foldersCleaner([allPaths.pathToTemp])
            
            await news.save()
            cache.news.obsolete = true
            return res.status(201).json({message: {en: 'News created', ru: 'Новость создана'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)





/**
 * @swagger
 * /api/news:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update news
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsItemUpdate'
 *     responses:
 *       200:
 *         description: The news updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageSuccess'
 *       500:
 *         description: Error on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */

router.put('', 
    [authMW, isAdmin],
    fileSaver, 
    async (req, res) => {
        
        try {
            const files = req.files
            const { header, date, short, text, _id } = JSON.parse(req.body.data)

            const basePath = `${allPaths.pathToImages}/${allPaths.pathToNews}/${_id}`
            
            const { filesList } = await resizeAndSaveS3({
                files,
                clearDir: true,
                saveFormat: 'webp',
                basePath,
                sizes: newsImageSizes
            })
            

            const images = {
                files: filesList,
                basePath: `${process.env.pathToStorage}/${basePath}`,
                sizes: newsImageSizes.map(size => ({
                    subFolder: size,
                    w: imageSizes[size].w,
                    h: imageSizes[size].h,
                }))
            }



            await News.findOneAndUpdate({_id}, { header, date, short, text, images})
            
            cache.news.obsolete = true
            return res.status(200).json({message: {en: 'News changed', ru: 'Новость отредактирована'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)


/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Returns the news with provided id
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The news id
 *     responses:
 *       200:
 *         description: The news with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsItemLoad'
 *       401:
 *         description: The news with provided id has not been found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 *       500:
 *         description: Error on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 */


router.get('/:id', 
    async (req, res) => {
    const {id} = req.params;
    
    if (id) {
        try {
            const err = await cache.news.control.load()
            if (err) {
                return res.status(500).json(err)
            }
    
            const newsItemToRes =  cache.news.data.find(item => {
                return item._id.valueOf() === id
            })
             
            if (!newsItemToRes) {
                return res.status(401).json({message: {en: `No news with the id: ${id} has been found`, ru: `Новость с id: ${id} не найдена`}})
            }
            return res.status(200).json({news: newsItemToRes, message: {en: `News id: ${id} has been loaded`, ru: `Новость id: ${id} загружена`}})
    
        } catch (e) {
            return res.status(500).json({message: {en: `Error on server: ${e} while getting news id: ${id}`, ru: `Ошибка при получении новости с id: ${id} с сервера: ${e}`}})
        }
    }
})



/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Returns the news list from 'from', amount = 'amount
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         required: true
 *         description: The start order for the news, from now to past, returns news from this number
 *         minimum: 0
 *         maximum: 9999
 *       - in: query
 *         name: amount
 *         schema:
 *           type: integer
 *         required: true
 *         description: The end order for the news, from now to past, returns news to this number
 *         minimum: 1
 *         maximum: 10000
 *     responses:
 *       200:
 *         description: The news list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/NewsItemLoad'
 *       500:
 *         description: Error on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 */



router.get('', 
    async (req, res) => {
        
    const {from, amount} = req.query;
    if (from && amount) {
        try {
            const err = await cache.news.control.load()
            if (err) {
                return res.status(500).json(err)
            }
            if (cache.news.data.length === 0) {
                return res.status(200).json({news: [], message: {en: `No news in db`, ru: `Новостей в базе нет`}})
            }
    
    
            const since = Number(from)
            const to = Number(from) + Number(amount)
            
            if (since >=  cache.news.data.length) {
                return res.status(400).json({message: {en: `"From" is more than total amount of news`, ru: `"From" больше чем общее количество новостей`}})
            }
            
            const newsToRes = cache.news.data.slice(since, to)
            //change images.files length to 1, we need only one image for preview
            return res.status(200).json({
                news: newsToRes.map(news => ({
                    _id: news._id,
                    header: news.header,
                    date: news.date,
                    short: news.short,
                    images: {
                        ...news.images,
                        files: [news.images.files[0]],
                    }
                })), 
                total: cache.news.data.length, 
                message: {en: `${newsToRes.length} news loaded`, ru: `Новостей загружено: ${newsToRes.length}`}})
    
        } catch (error) {
            return res.status(500).json({message: {en: `Error with server while getting news`, ru: `Ошибка при получении новостей с сервера`}})
        }
    }

})


 
/**
 * @swagger
 * /api/news:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes news with provided id
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: id of deleting news
 *             properties:
 *               _id:
 *                 type: string
 *     responses:
 *       200:
 *         description: News deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageSuccess'
 *       500:
 *         description: Error on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 *       404:
 *         description: News with provided id has not been found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError' 
 *
 */

router.delete('', 
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
            const err = await cache.news.control.load()
            if (err) {
                return res.status(500).json(err)
            }

            await folderCleanerS3(process.env.s3BucketName, `${allPaths.pathToImages}/${allPaths.pathToNews}/${_id}/`)
            return res.status(200).json({message: {en: `News  deleted`, ru: `Новость удалена`}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }

    }
)



export {};

module.exports = router