const { Router } = require('express')
const router = Router()
const authMW = require('../middleware/auth') 


router.post('/create', 
    [authMW],
    
    /*check('header.en')
        .isLength({min: 3})
        .withMessage({en: 'EN header is too short (<4)', ru: 'EN заголовок слишком короткий (<4)'})

],*/
    async (req, res) => {

        /*const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => error.msg),
                message: {en: 'Errors in news data', ru: 'Ошибки в данных новости'}
            })
        }*/

        try {
            /*const { header, date, short, text, images} = req.body 

            const news = new News({ header, date, short, text, images}) 
            
            await news.save()

            cache.news.obsolete = true*/

            return res.status(201).json({message: {en: 'News posted', ru: 'Новость сохранена'}})
        } catch (error) {
            return res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
        }
    }
)




module.exports = router