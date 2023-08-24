import { allPaths, newsImageSizes } from "./data/consts"
import { foldersCleaner } from "./processors/fsTools"
const https = require('https')
const path = require('path')
const fse = require('fs-extra')
const mode = process.env.NODE_ENV || 'undefined';


const pathToEnv = `.env.${mode}`.trim()
require('dotenv').config({
    path: pathToEnv,
})

console.log('ENV mode: ', pathToEnv);


const userRoutes = require('./routes/user')
const fibersRoutes = require('./routes/fibers')
const newsRoutes = require('./routes/news')
const colorsRoutes = require('./routes/colors')
const catalogRoutes = require('./routes/catalog')
const contentRoutes = require('./routes/content')
//const filesRoutes = require('./routes/files')
//const ordersRoutes = require('./routes/orders')
const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()
//var bodyParser = require('body-parser')



foldersCleaner([allPaths.pathToTemp])

app.use(express.json({ extended: true, }));
//app.use(bodyParser.json({strict: false}))

// cors
app.use(cors({ 
    origin: "*", 
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));




app.use('/test', async (req, res) => {res.status(200).json({response: 'OK'})})

app.use('/api/user', userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/colors', colorsRoutes)
app.use('/api/fibers', fibersRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/content', contentRoutes)


const PORT: number = Number(process.env.PORT) || 5000

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.mongoUri || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "allData"
        })
        
    } catch (error: unknown) {
        console.log('APP ERROR:', error);
        process.exit(1)
    }
}

connectToDb()

//app.listen(PORT, () => console.log(`Server has been successfully started on port ${PORT}...`))

const backendFolder = (path.resolve(__dirname, '..'))


https
  .createServer(
    {
      key: fse.readFileSync(`${backendFolder}/key.pem`),
      cert: fse.readFileSync(`${backendFolder}/cert.pem`),
    },
    app
  )
  .listen(PORT, function () {
    console.log(`Server has been successfully started on port ${PORT}...`)
  });


export {}