import { Document, Schema, Model, model, Types } from 'mongoose';
import { TLangText } from '../../../src/interfaces';
import { ICartItem } from './Cart';
const CartItem = require("../models/Cart")





interface IUser extends Document {
    date: Date
    email: string,
    password: string,
    phone: string,
    name: string,
    cart: ICartItem[]
}


const userSchema = new Schema({
    date: {type: Date, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    name: {type: String, required: true},
    cart: [{type: CartItem, required: false}]
    //orders: [{type: Types.ObjectId, ref: 'Order'}]
})


const User: Model<IUser> = model<IUser>('User', userSchema);

module.exports = User
export { IUser }