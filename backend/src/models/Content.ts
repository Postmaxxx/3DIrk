import { Document, Schema, Model, model } from 'mongoose';

interface IContent extends Document {
    splider: {
        paths: {
            full: string
            spliderMain: string
        },
        files: string[]
    }
}

const contentSchema = new Schema({
    splider: {type: Object, required: true},
})

const Content: Model<IContent> = model<IContent>('Content', contentSchema);

module.exports = Content
export {IContent}