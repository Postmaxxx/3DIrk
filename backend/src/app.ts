require('dotenv').config()
const userRoutes = require('./routes/user')
const cartRoutes = require('./routes/cart')
const fibersRoutes = require('./routes/fibers')
const newsRoutes = require('./routes/news')
const colorsRoutes = require('./routes/colors')
const catalogRoutes = require('./routes/catalog')
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


app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
/*
//fibers
*/
//admin
app.use('/api/news', newsRoutes)
app.use('/api/colors', colorsRoutes)

app.use('/api/fibers', fibersRoutes)
app.use('/api/catalog', catalogRoutes)

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