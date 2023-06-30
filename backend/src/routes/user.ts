import { IUser } from "../models/User"
const { Router } = require("express")
const User = require("../models/User")
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const router = Router()
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth')
import { IAllCache } from '../data/cache'
const cache: IAllCache = require('../data/cache')

const cartToFront = async (res, cart: IUser["cart"]) => {
    if (cart.length === 0 || !cart) {
        return []
    }
    await cache.products.control.load(res)
    //console.log(cache.products.data);
    
    return cart.map((item) => {
        const fullProduct = cache.products.data.find(product => product._id.toString() === item.productId)
        
        return fullProduct ? 
        {
            amount: item.amount,
            fiber: item.fiberId,
            color: item.colorId,
            type: item.type,
            product: fullProduct
        }
        :
        null
    }).filter(item => item) || [] //not null, all products with invalid id will be ignored

}
 

//api/outh/register
router.post('/register', 
    [
        check('email', {en: 'Wrong email', ru: 'Неправильная почта'}).isEmail(),
        check('password', { en: 'Password should be at least 8 symbols', ru: 'Пароль должен быть не менее 8 символов'}).isLength({ min: 8 }),
        check('name', { en: 'Name should be at least 2 symbols', ru: 'Имя должно быть не менее 2 символов'}).isLength({ min: 2 }),
        check('phone', { en: 'Phone should be at least 6 symbols', ru: 'Телефон должен быть не короче 6 цифр'}).isLength({ min: 6 }),
    ],
    async (req, res) => {
        
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in data during registration:', ru: 'Ошибки в данных при регистрации:'}
            })
        }
        try {
            const {email, password, name, phone} = req.body
            
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({message: {en: 'User already exists', ru: 'Такой пользователь уже существует'}})
            }
        
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword, name, phone, date: new Date(), cart: [] })
        
            await user.save()

            res.status(201).json({message: {en: 'User created', ru: 'Пользователь создан'}})
            
        } catch (error) {
            res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)



router.post('/login',
    [
        check('email', {en: 'Wrong email', ru: 'Неправильная почта'}).isEmail(),
        check('password', {en: 'Password must be at least 8 symbols', ru: 'Пароль должен быть не менее 8 символов'}).isLength({min: 8}),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(item => (item.msg)),
                message: {en: "Wrong data to login", ru: "Неправильные данные для входа"}
            })
        }

        try {
            const {email, password } = req.body
            
            const user: IUser = await User.findOne({ email })
            
            if (!user) {
                return res.status(400).json({ message: { en: 'User not found', ru: "Пользователь не найден"},  errors: { en: 'User not found', ru: "Пользователь не найден"}})
            }
            
            const passwordsSame = await bcrypt.compare(password, user.password)
            
            if (!passwordsSame) {
                return res.status(400).json({ message: {en: 'Password is incorrect', ru: "Пароль неверный"}, errors: [{en: 'Password is incorrect', ru: "Пароль неверный"}]})
            }
            
            const token = jwt.sign(
                {userId: user.id},
                process.env.jwtSecret,
                { expiresIn: "1h"}
            )
                
            const userToFront = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                cart: [],//cart: cartToFront(user.cart),
                token,
                isAdmin: false
            }
            

            if (user.email === process.env.admEmail) {
                userToFront.isAdmin = true
            }
            
            
            res.status(200).json({user: userToFront, message: {en: 'Login success', ru: 'Успешный вход'}})

        } catch (error) {
            res.status(500).json({ message:{en: `Something wrong with server (${error}), try again later`, ru: `Ошибка на сервере (${error}), попробуйте позже`}})
        }
    }
)



router.post('/login-token',
    authMW,
    async (req, res) => {              
        try {
            const { id } = req.user
            
            const user = await User.findOne( {_id: id} )
            
            if (!user) {
                return res.status(400).json({ message: { en: 'User was not found', ru: "Пользователь не найден"}})
            }
            const newToken = jwt.sign(
                {userId: user.id},
                process.env.jwtSecret,
                { expiresIn: "1h"}
            )
           

            const userToFront = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                cart: await cartToFront(res, user.cart),
                //orders: user.orders,
                token: newToken, //auto token prolong
                isAdmin: false
            }
            
            if (user.email === process.env.admEmail) {
                userToFront.isAdmin = true
            }
            
            res.status(200).json({user: userToFront, message: {en: 'Login success', ru: 'Успешный вход'}})      
        } catch (error) {
            res.status(500).json({ message:{en: `Something wrong with server (${error}), try again later`, ru: `Ошибка на сервере (${error}), попробуйте позже`}})
        }
    }
)






router.put('/cart',
    authMW,
    async (req, res) => {       
        try {            
            const { newCart } = req.body
            const { id } = req.user
            await User.findOneAndUpdate( {_id: id}, {cart: newCart})
            
            res.status(200).json({message: {en: 'Cart has been updated', ru: 'Корзина была обновлена'}})

        } catch (error) {
            res.status(500).json({ message:{en: `Something wrong with server (${error}), try again later`, ru: `Ошибка на сервере (${error}), попробуйте позже`}})
        }
    }
)

/*
router.get('/cart',
    authMW,
    async (req, res) => {       
        try {
            const { id } = req.user
            const user = await User.findOne({_id: id})
            if (!user) {
                return res.status(400).json({ message: {en: 'User not found', ru: "Пользователь не найден"}})
            }
           
            res.status(200).json({cart: user.cart})

        } catch (error) {
            res.status(500).json({ message:{en: `Something wrong with server (${error}), try again later`, ru: `Ошибка на сервере (${error}), попробуйте позже`}})
        }
    }
)
*/

module.exports = router

export {}