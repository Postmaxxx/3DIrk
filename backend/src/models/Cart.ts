import { Document, Schema, Model, model } from 'mongoose';



interface ICart extends Document{
    items: Object
}

const CartSchema = new Schema({
    items: [{type: Object, required: true}]
})

const Cart: Model<ICart> = model<ICart>('Cart', CartSchema)


module.exports = Cart
export {ICart}