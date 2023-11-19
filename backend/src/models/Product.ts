import {Schema, Document, model, Model, Types} from 'mongoose'
import { IImages, TLangText } from '../interfaces'

interface IMods {
    name: TLangText
    price: number
    _id: string
}
interface IProduct extends Document {
    _id: string
    name: TLangText
    text: TLangText
    textShort: TLangText
    images: IImages
    fibers: string[]
    mods: IMods[]
    category: string
    active: boolean
}


const productSchema = new Schema({
    name: {type: Object, required: true},
    text: {type: Object, required: true},
    textShort: {type: Object, required: true},
    images: {type: Object, required: true},
    fibers: [{type: Types.ObjectId, ref: 'Fiber', required: true}],
    mods: {type: Object, required: true},
    category: {type: Types.ObjectId, ref: 'Catalog', required: true},
    active: {type: Boolean, required: false, default: true}
})

const Product: Model<IProduct> = model<IProduct>('Product', productSchema)


module.exports = Product

export {IProduct}