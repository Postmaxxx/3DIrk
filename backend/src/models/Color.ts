import { Document, Schema, Model, model } from 'mongoose';
import { TLangText } from '../interfaces';

interface IColor extends Document {
    _id: string
    name: TLangText
    images: {
        paths: {
            full: string
            thumb: string
        },
        files: {
            full: string
            thumb: string
        }
    },
    active: boolean
}

const colorsSchema = new Schema({
    name: {type: Object, required: true},
    images: {type: Object, required: true},
    active: {type: Boolean, required: false, default: true}
})

const Colors: Model<IColor> = model<IColor>('Colors', colorsSchema);

module.exports = Colors
export {IColor}