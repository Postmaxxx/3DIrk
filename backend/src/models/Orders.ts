import { Document, Schema, Model, model, Types } from 'mongoose';
import { TLangText } from '../../../src/interfaces';
import { ICartItem } from './Cart';
const CartItem = require("../models/Cart")


type OrderType = 'finished' | 'new' | 'working' | 'canceled'


interface InfoType {
    message: string
    path: string
    files: string[] //urls to files
}


interface IOrder extends Document {
    date: string
    status: OrderType
    cart: ICartItem[]
    user: string //userId
    info: InfoType
}


const orderSchema = new Schema({
    date: {type: String, required: true},
    status: {type: String, required: true},
    cart: [{type: CartItem, required: true}],
    user: {type: Types.ObjectId, ref: 'User', required: true},
    info: {type: Object, required: true},
})

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema)


module.exports = Order
export {IOrder, OrderType}