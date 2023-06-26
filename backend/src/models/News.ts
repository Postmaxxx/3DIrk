import { Document, Schema, Model, model } from 'mongoose';

interface INews extends Document {
    date: Date
    header: object
    short: object
    text: object
    images: object[]
}

const newsSchema = new Schema({
    date: {type: Date, required: true},
    header: {type: Object, required: true},
    short: {type: Object, required: true},
    text: {type: Object, required: true},
    images: [{type: Object, required: false}],
})

const News: Model<INews> = model<INews>('News', newsSchema);

module.exports = News
export {INews}