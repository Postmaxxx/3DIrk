export {};
const { Router } = require("express")
const News = require("../models/News")
const router = Router()
const authMW = require('../middleware/auth')




router.post('/create', async (req, res) => {
    
    try {
        console.log(req.body);
        const { header, date, short} = req.body

        
       // const news = new News({ header, date, short, text})
        
        //await news.save()
        res.status(201).json({message: {en: 'News saved', ru: 'Новость сохранена'}})
 
    } catch (error) {
        res.status(500).json({ message:{en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}})
    }
    

})













router.get('/list', async (req, res) => {
    try {
        const newsList = await News.findAll()
        console.log(newsList);



    } catch (error) {
        
    }


})











module.exports = router