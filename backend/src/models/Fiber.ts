import { Document, Schema, Model, model, Types } from 'mongoose';

interface IFiber extends Document {
    name: object
    text: object
    proscons: object
    colors: {type: Types.ObjectId, ref: 'Order'}
    images: object[]
    short: object
    features: object
    params: object
}

const fiberSchema = new Schema({
    name: {type: Object},
    text: {type: Object},
    proscons: {type: Object},
    colors: {type: Types.ObjectId, ref: 'Colors'},
    images: [{type: Object}],
    short: {type: Object},
    features: {type: Object},
    params: {type: Object}
})

const Fiber: Model<IFiber> = model<IFiber>('News', fiberSchema);

module.exports = Fiber
export {IFiber}