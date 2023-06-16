import { IFiber } from "../models/Fiber";
import { saveChanges, checkChanges } from '../processors/changes'
const { Router } = require("express")
const router = Router()
const isAdmin = require('../middleware/isAdmin')
const authMW = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Fiber = require("../models/Fiber")



let allFibers: IFiber[] = []


const loadFibers = async (res): Promise<{loaded: boolean, msg: string}> => {
    const changed = await checkChanges('fibers')
    if (allFibers.length === 0 || changed) {
        try {  
            allFibers = await Fiber.find()
            await saveChanges('fibers', false);
        } catch (e) {
            return res.status(400).json({message: {en: `Error while loading fibers from db: ${e}`, ru: `Ошибка при получении материалов из базы данных: ${e}`}})
        }
    }
}



router.get('/fibers-all', async (req, res) => {
    loadFibers(res)
    return res.status(200).json({message: {en: `Fibers loaded`, ru: `Материалы загружены`}})
})







export {};

module.exports = router
