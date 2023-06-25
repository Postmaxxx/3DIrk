const { Router } = require("express")
const User = require("../models/User")
const router = Router()
const authMW = require('../middleware/auth')


router.put('/set',
    authMW,
    async (req, res) => {             
        try {
            const { id } = req.user
            const user = await User.findOne( {_id: id} )
            
            if (!user) {
                return res.status(400).json({ message: { en: 'User was not found', ru: "Пользователь не найден"}})
            }
            if (!req.body?.items) {
                return res.status(400).json({ message: { en: 'Cart is empty', ru: "Корзина пуста"}})
            }
            user.cart = req.body?.items
            await user.save()
            
            res.status(200).json({message: {en: 'Cart sent', ru: 'Корзина отправлена'}})

        } catch (error) {
            res.status(500).json({ message:{en: `Something wrong with server (${error}), try again later`, ru: `Ошибка на сервере (${error}), попробуйте позже`}})
        }
    }
)


module.exports = router

export {}