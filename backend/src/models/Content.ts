import { Document, Schema, Model, model } from 'mongoose';
import { IImgWithThumb } from '../../../src/interfaces';

interface IContent extends Document {
    splider: IImgWithThumb[]
}

const contentSchema = new Schema({
    splider: [{type: Object, required: true}],
})

const Content: Model<IContent> = model<IContent>('Content', contentSchema);

module.exports = Content
export {IContent}