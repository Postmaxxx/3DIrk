const jwt = require('jsonwebtoken')

const tokenInjector = (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization?.split(' ')?.[1]
        
        if (!token) {
            return res.status(401).json({message: {en: 'Not autorized', ru: 'Нет авторизации'}})
        }

        const decoded = jwt.verify(token, process.env.jwtSecret)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({message: {en: 'Not autorized', ru: 'Нет авторизации'}})
    }

}

export default tokenInjector