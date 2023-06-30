import { Document, Schema, Model, model } from 'mongoose';
import { TLangText } from '../../../src/interfaces';


interface IUser extends Document {
    date: Date
    email: string,
    password: string,
    phone: string,
    name: string,
    cart: {
        productId: string
        fiberId: string //id
        colorId: string  //id
        type: TLangText
        amount: number
    }[]
}


const userSchema = new Schema({
    date: {type: Date, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    name: {type: String, required: true},
    cart: [{type: Object, required: false}]
    //orders: [{type: Types.ObjectId, ref: 'Order'}]
})


const User: Model<IUser> = model<IUser>('User', userSchema);

module.exports = User
export { IUser }