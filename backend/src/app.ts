require('dotenv').config()
const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cart')
//import fibersRoutes from './routes/fibers'
const newsRoutes = require('./routes/news')
const colorsRoutes = require('./routes/colors')
const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()
//var bodyParser = require('body-parser')


app.use(express.json({ extended: true, }));
//app.use(bodyParser.json({strict: false}))

// cors
app.use(cors({ 
    origin: "*", 
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

//auth
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
/*
//fibers
app.use('/api/fibers', fibersRoutes)
*/
//admin
app.use('/api/news', newsRoutes)
app.use('/api/colors', colorsRoutes)

const PORT: number = Number(process.env.PORT) || 5000


const start = async () => {
    try {
        await mongoose.connect(process.env.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "allData"
        })
        
    } catch (error: unknown) {
        console.log(error);
        process.exit(1)
    }
}

start()

app.listen(PORT, () => console.log(`Server has been successfully started on port ${PORT}...`))