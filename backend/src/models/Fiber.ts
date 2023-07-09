import { Document, Schema, Model, model, Types } from 'mongoose';
import { IFiberParam, IImgWithThumb, TLang, TLangText } from '../../../src/interfaces';

interface IFiber extends Document {
    name: TLangText
    text: TLangText
    proscons: {
            pros: TLangText[]
    cons: TLangText[]
    }
    colors: [string]
    images: {
        paths: {
            full: string
            small: string
        },
        files: string[]
    }
    short: {
        name: TLangText
        text: TLangText
    }
    params: {
        strength: number 
        stiffnes: number 
        durability: number 
        resistantImpact: number 
        minTemp: number 
        maxTemp: number 
        thermalExpansion: number 
        density: number 
        flexible: number 
        elastic: number 
        soft: number 
        composite: number 
        resistantUV: number 
        resistantWater: number 
        resistantHeat: number 
        resistantChemically: number 
        dissolvable: number 
        resistantFatigue: number 
        cutting: number 
        grinding: number  
        price: number 
        priceGr: string
    }
}

const fiberSchema = new Schema({
    name: {type: Object, required: true},
    text: {type: Object, required: true},
    proscons: {type: Object, required: false},
    colors: [{type: Types.ObjectId, ref: 'Colors', required: true}],
    images: {type: Object, required: true},
    short: {type: Object, required: true},
    params: {type: Object, required: true}
})

const Fiber: Model<IFiber> = model<IFiber>('Fibers', fiberSchema);

module.exports = Fiber
export {IFiber}