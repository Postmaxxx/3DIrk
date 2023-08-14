import {Schema, Document, model, Model, Types} from 'mongoose'
import { TImageSizes, TLangText } from '../interfaces'


interface IProduct extends Document {
    _id: string
    name: TLangText
    text: TLangText
    text_short: TLangText
    price: number
    images: {
        paths: {
            [key in TImageSizes]: string;
        }
        files: string[]
    }
    fibers: string[]
    mods: TLangText[]
    category: string
    active: boolean
}


const productSchema = new Schema({
    name: {type: Object, required: true},
    text: {type: Object, required: true},
    text_short: {type: Object, required: true},
    price: {type: Number, required: true},
    images: {type: Object, required: true},
    fibers: [{type: Types.ObjectId, ref: 'Fiber', required: true}],
    mods: {type: Object, required: false},
    category: {type: Types.ObjectId, ref: 'Catalog', required: true},
    active: {type: Boolean, required: false, default: true}
})

const Product: Model<IProduct> = model<IProduct>('Product', productSchema)


module.exports = Product

export {IProduct}