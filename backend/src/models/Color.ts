import { Document, Schema, Model, model } from 'mongoose';
import { TLang, TLangText } from '../../../src/interfaces';

interface IColor extends Document {
    name: TLangText
    url: {
        full: string
        small: string
    }
}

const colorsSchema = new Schema({
    name: {type: Object, required: true},
    url: {type: Object, required: true}
})

const Colors: Model<IColor> = model<IColor>('Colors', colorsSchema);

module.exports = Colors
export {IColor}