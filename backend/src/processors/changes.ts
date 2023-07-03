/*import { IChangesProps, IChanges } from "../models/Changes";
const Changes = require("../models/Changes")


const saveChanges = async (prop: keyof IChangesProps, value: boolean) => {
    try { // save changes of prop
        const changes: IChanges = await Changes.findOne()
        if (!changes) {
            const newChanges: IChanges = new Changes({ 
                news: true,
                fibers: true,
                catalog: true,
                colors: true, 
                products: true
            })
            await newChanges.save()
        } else {
            changes[prop] = value
            await changes.save()
        }
    } catch (e) {
        //console.log(`Error while saving changes: ${e}`);
    }
}



const checkChanges = async (prop: keyof IChangesProps) => {
    try { // check passed changes
        const changes: IChanges = await Changes.findOne()
        if (!changes) {
            const newChanges: IChanges = new Changes({ 
                news: true,
                fibers: true,
                catalog: true,
                colors: true, 
                products: true
            })
            await newChanges.save()
            return true
        } else {
            return changes[prop]
        }
    } catch (e) {
        //console.log(`Error while getting changes: ${e}`);
        return true
    }
}
 export {saveChanges, checkChanges}*/