const { Schema, model, Types } = require('mongoose')

const newsSchema = new Schema({
    date: {type: Date},
    header: {type: Object},
    short: {type: Object},
    text: {type: Object},
    images: [{type: Object}],
})

module.exports = model('News', newsSchema)
export {}