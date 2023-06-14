const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    
    if (req.method === 'OPTIONS') {
        return next()
    }
    //console.log(req);
    
    try {
        const receivedToken = req.headers.authorization?.split(' ')?.[1]
        if (!receivedToken) {
            return res.status(401).json({message: {en: 'No token', ru: 'Нет токена'}, errors: []})
        }
        const decoded = jwt.verify(receivedToken, process.env.jwtSecret)
        if (!decoded) {
            return res.status(400).json({ message: { en: 'Token is invalid', ru: "Токен недействителен"}, errors: []})
        }
        if (decoded.iat > decoded.exp) {
            return res.status(400).json({ message: { en: 'Token is expired', ru: "Токен истек"}, errors: []})
        }
        req.user ? req.user.id = decoded.userId : req.user = {id: decoded.userId}
        
        next()

    } catch (error) {
        return res.status(401).json({message: {en: `Problem with token: ${error}`, ru: `Проблемы с токеном: ${error}`}, errors: []})
    }

}