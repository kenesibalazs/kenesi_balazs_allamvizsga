// models/OccasionComment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOccasionComment {
    dayId: string;
    timeId: string;
    type: string;
    comment: string;
}
const OccasionCommentSchema: Schema = new Schema({
    dayId: { type: String, required: true },
    timeId: { type: String, required: true },
    type: { type: String, required: true },
    comment: { type: String, required: true },
});

export const OccasionComment = mongoose.model<IOccasionComment>('OccasionComment', OccasionCommentSchema);

export default OccasionComment;
