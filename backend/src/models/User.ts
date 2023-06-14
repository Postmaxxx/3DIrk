const { Schema, model, Types } = require('mongoose')


const userSchema = new Schema({
    date: {type: Date, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true},
    name: {type: String, required: true},
    cart: [{type: Object, required: false}]
    //orders: [{type: Types.ObjectId, ref: 'Order'}]
})


module.exports = model('User', userSchema)