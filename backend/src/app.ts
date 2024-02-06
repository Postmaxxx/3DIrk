import { allPaths } from "./data/consts"
import { foldersCleaner } from "./processors/fsTools"
const compression = require('compression')
const express = require('express')
const mongoose = require("mongoose")
const https = require('https')
const path = require('path')
const fse = require('fs-extra')
const mode = process.env.NODE_ENV?.trim() || 'development';
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")


const pathToEnv = `.env.${mode}`.trim()
require('dotenv').config({
    path: pathToEnv,
})
console.log('ENV mode: ', pathToEnv);
console.log('Port: ', process.env.PORT);


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Strezhen API",
            verson: '1.0.0',
            description: "Strezhen Company backend API"
        },
        servers: pathToEnv === 'production' ? 
        [
            {
                url: "https://devback.net"
            }
        ] 
        : 
        [
            {
                url: `http://localhost:${process.env.PORT}`
            },
            {
                url: "https://devback.net"
            }
        ],
    },
    apis: ["./src/routes/*.ts", './src/schemas/*.ts']
}


const specs = swaggerJsDoc(options)


const userRoutes = require('./routes/user')
const fibersRoutes = require('./routes/fibers')
const newsRoutes = require('./routes/news')
const colorsRoutes = require('./routes/colors')
const catalogRoutes = require('./routes/catalog')
const productRoutes = require('./routes/product')
const contentRoutes = require('./routes/content')
const cors = require('cors')
const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

foldersCleaner([allPaths.pathToTemp])

app.use(express.json({ extended: true, }));
app.use(compression())


// cors
app.use(cors({ 
    origin: "*", 
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));




app.use('/test', async (req, res) => {res.status(200).json({response: 'OK'})})

app.use('/api/user', userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/colors', colorsRoutes)
app.use('/api/fibers', fibersRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/product', productRoutes)
app.use('/api/content', contentRoutes)


const PORT: number = Number(process.env.PORT) || 5000

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.mongoUri || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.dbName
        })
        
    } catch (error: unknown) {
        console.log('APP ERROR:', error);
        process.exit(1)
    }
}

connectToDb()

const backendFolder = (path.resolve(__dirname, '..'))



if (mode === 'development') {
	app.listen(PORT, () => console.log(`Server has been successfully started on port ${PORT}...`))
} else {
	https
	  .createServer(
		  {
			  key: fse.readFileSync(`${backendFolder}/privkey.pem`),
			  cert: fse.readFileSync(`${backendFolder}/cert.pem`),
		  },
		  app
	  )
	  .listen(PORT, function () {
			console.log(`Server has been successfully started on port ${PORT}...`)
	  });
}	


module.exports = app;
export {}