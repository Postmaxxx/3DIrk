const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    passowrd: {type: String, required: true},
    phone: {type: Number, required: true},
    name: {type: String, required: true},
    orders: [{type: Types.ObjectId, ref: 'Order'}]
})


module.exports = model('User', userSchema)