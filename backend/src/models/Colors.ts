import { Document, Schema, Model, model } from 'mongoose';

interface IColors extends Document {
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

const Colors: Model<IColors> = model<IColors>('Colors', colorsSchema);

module.exports = Colors
export {IColors}