import { Document, Schema, Model, model } from 'mongoose';
import { IImgWithThumb, TLangText } from '../../../src/interfaces';

interface INews extends Document {
    date: Date
    header: TLangText
    short: TLangText
    text: TLangText
    images: {
        paths: {
            full: string
            medium: string
            small: string
        },
        files: string[]
    }
}

const newsSchema = new Schema({
    date: {type: Date, required: true},
    header: {type: Object, required: true},
    short: {type: Object, required: true},
    text: {type: Object, required: true},
    images: {type: Object, required: false},
})

const News: Model<INews> = model<INews>('News', newsSchema);

module.exports = News
export {INews}