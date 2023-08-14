import { Document, Schema, Model, model } from 'mongoose';
import { IImageSubFolder } from '../interfaces';

interface IContent extends Document {
    carousel: {
        images: {
            basePath: string
            files: string[]
            sizes: IImageSubFolder[]
        }
    }
}

const contentSchema = new Schema({
    carousel: {type: Object, required: true},
})

const Content: Model<IContent> = model<IContent>('Content', contentSchema);

module.exports = Content
export {IContent}