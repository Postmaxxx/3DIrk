import {Schema, Document, model, Model, Types} from 'mongoose'
import { TLangText } from '../interfaces'


interface IProduct extends Document {
    _id: string
    name: TLangText
    text: TLangText
    text_short: TLangText
    price: number
    images: {
        paths: {
            full: string
            small: string
            medium: string
            preview: string
        },
        files: string[]
    }
    fibers: string[]
    mods: TLangText[]
    category: string
}


const productSchema = new Schema({
    name: {type: Object, required: true},
    text: {type: Object, required: true},
    text_short: {type: Object, required: true},
    price: {type: Number, required: true},
    images: {type: Object, required: true},
    fibers: [{type: Types.ObjectId, ref: 'Fiber', required: true}],
    mods: {type: Object, required: false},
    category: {type: Types.ObjectId, ref: 'Catalog', required: true}
})

const Product: Model<IProduct> = model<IProduct>('Product', productSchema)


module.exports = Product

export {IProduct}