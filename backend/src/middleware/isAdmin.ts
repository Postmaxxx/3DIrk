const User = require('../models/User')


module.exports = async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const { id } = req.user
        if (!id) {
            return res.status(400).json({ message: { en: 'UserId was not found', ru: "ID пользователя не найден"}, errors: []})
        }
        const user = await User.findOne({_id: id})
        if (!user) {
            return res.status(400).json({ message: { en: 'User was not found', ru: "Пользователь не найден"}, errors: []})
        }
        
        if (user.email !== process.env.admEmail) {
            req.user.isAdmin = false
            return res.status(400).json({ message: { en: 'Insufficient permissions', ru: "Недостаточно прав"}, errors: []})
        }
        req.user.isAdmin = true
        next()  
    } catch (e) {
        return res.status(400).json({ message: { en: `Error while checking permissions: ${e}`, ru: `Ошибка при проверке прав: ${e}`}, errors: []})
    } 
}