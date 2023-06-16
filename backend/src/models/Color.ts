import { Document, Schema, Model, model } from 'mongoose';

interface IColor extends Document {
    name: {
        en: string
        ru: string
    }
    url: {
        big: string
        small: string
    }
}

const colorsSchema = new Schema({
    name: {type: Object},
    url: {type: Object}
})

const Colors: Model<IColor> = model<IColor>('Colors', colorsSchema);

module.exports = Colors
export {IColor}