import { Document, Schema, Model, model, Types } from 'mongoose';
import { ICartItem } from './User';


type OrderType = 'finished' | 'new' | 'working' | 'canceled'



interface IOrder extends Document {
    date: Date
    status: OrderType
    cart: ICartItem[]
    user: object //userId
    info: {
        message: string
        files: string[] //urls to files
    }
}


const orderSchema = new Schema({
    date: {type: Date, required: true},
    status: {type: String, required: false},
    cart: {type: Date, required: true},
    user: {type: Types.ObjectId, required: true},
    info: {type: Object, required: true},
})

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema)


module.exports = Order
export {IOrder}