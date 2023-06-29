import {Schema, Document, model, Model, Types} from 'mongoose'
import { IImgWithThumb, TLangText } from '../../../src/interfaces'


interface IProduct extends Document {
    name: TLangText
    text: TLangText
    text_short: TLangText
    price: TLangText
    images: IImgWithThumb[]
    fibers: string[]
    mods: TLangText[]
    category: string
}


const productSchema = new Schema({
    name: {type: Object, required: true},
    text: {type: Object, required: true},
    text_short: {type: Object, required: true},
    price: {type: Object, required: true},
    images: [{type: Object, required: true}],
    fibers: [{type: Types.ObjectId, ref: 'Fiber', required: true}],
    mods: {type: Object, required: false},
    category: {type: Types.ObjectId, ref: 'Catalog', required: true}

})

const Product: Model<IProduct> = model<IProduct>('Product', productSchema)


module.exports = Product

export {IProduct}