import { Document, Schema, Model, model } from 'mongoose';

interface INews extends Document {
    date: Date
    header: object
    short: object
    text: object
    images: object[]
}

const newsSchema = new Schema({
    date: {type: Date},
    header: {type: Object},
    short: {type: Object},
    text: {type: Object},
    images: [{type: Object}],
})

const News: Model<INews> = model<INews>('News', newsSchema);

module.exports = News
export {INews}