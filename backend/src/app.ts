const express = require('express')
require('dotenv').config()
const mongoose = require("mongoose")
const routesAuth = require("./routes/auth")

const app = express()


app.use('api/auth', require("./routes/auth"))


const PORT: number = Number(process.env.PORT) || 5000


const start = async () => {
    try {
        await mongoose.connect(process.env.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        
    } catch (error: unknown) {
        console.log(error);
        process.exit(1)
    }
}

start()

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))