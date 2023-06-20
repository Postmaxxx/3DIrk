import { Document, Schema, Model, model } from 'mongoose';


interface IChangesProps {
    news: boolean
    catalog: boolean
    fibers: boolean
    colors: boolean
}

interface IChanges extends IChangesProps, Document {}


const changesSchema = new Schema({
    news: {type: Boolean},
    catalog: {type: Boolean},
    fibers: {type: Boolean},
    colors: {type: Boolean},
})

const News: Model<IChanges> = model<IChanges>('Changes', changesSchema);

module.exports = News
export {IChanges, IChangesProps}