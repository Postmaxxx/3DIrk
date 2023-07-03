import { IContent } from "../models/Content";
const { Router } = require("express")
const Content = require("../models/Content")
const router = Router()
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')
import { IAllCache } from '../data/cache'
const cache: IAllCache = require('../data/cache')


router.put('/splider', 
    [authMW, isAdmin],
    async (req, res) => {

        try {
            const { images } = req.body 
            
            const exist = await Content.findOne()
            if (!exist) {
                const content = new Content({splider: images})
                await content.save()
                return res.status(200).json({message: {en: 'Content changed', ru: 'Контент отредактирован'}})
            }
            await Content.findOneAndUpdate({}, {splider: images})
            //console.log(1);
            
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