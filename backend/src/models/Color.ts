import { Document, Schema, Model, model } from 'mongoose';
import { TLang, TLangText } from '../../../src/interfaces';

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
    }
}

const colorsSchema = new Schema({
    name: {type: Object, required: true},
    images: {type: Object, required: true}
})

const Colors: Model<IColor> = model<IColor>('Colors', colorsSchema);

module.exports = Colors
export {IColor}