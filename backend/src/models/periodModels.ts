//models/periodModel.ts
import mongoose, { Document, Schema } from 'mongoose';


// mondodb model
// {"_id":{"$oid":"67251408a4a1dae5ea36f635"},"id":"1","starttime":"08:00"}
export interface IPeriod extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    starttime: string;
}

const periodSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    id: { type: String, required: true },
    starttime: { type: String, required: true }
}, { collection: 'periods' });


const Period = mongoose.model<IPeriod>('Period', periodSchema);

export default Period;