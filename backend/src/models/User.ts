const { Schema, model, Types } = require('mongoose')

interface IUserSchema {

}

const userSchema = new Schema({
    date: {type: Date, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true},
    name: {type: String, required: true},
    orders: [{type: Types.ObjectId, ref: 'Order'}]
})


export default model('User', userSchema)