const { Router } = require('express')
const router = Router()
const authMW = require('../middleware/auth') 


router.get('/get', 
    [authMW,
    
    ],
    async (req, res) => {
        try {
            const {from, to, userId} = req.query
            console.log('f', from, to, userId);
            
            /*const { header, date, short, text, images} = req.body 

            const news = new News({ header, date, short, text, images}) 
            
            await news.save()

            cache.news.obsolete = true*/

            return res.status(200).json()
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




module.exports = router