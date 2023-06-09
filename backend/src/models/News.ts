const { Schema, model, Types } = require('mongoose')

const newsSchema = new Schema({
    date: {type: Date},
    header: {type: String},
    short: {type: String},
    text: [String],
    images: [String],
})


module.exports = model('News', newsSchema)
export {}