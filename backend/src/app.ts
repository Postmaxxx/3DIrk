require('dotenv').config()
const authRoutes = require('./routes/auth')
//import fibersRoutes from './routes/fibers'
const newsRoutes = require('./routes/news')
const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()


app.use(express.json({ extended: true }));


// cors
app.use(cors({ 
    origin: "*", 
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

//auth
app.use('/api/auth', authRoutes)
/*
//fibers
app.use('/api/fibers', fibersRoutes)
*/
//admin
app.use('/api/news', newsRoutes)

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