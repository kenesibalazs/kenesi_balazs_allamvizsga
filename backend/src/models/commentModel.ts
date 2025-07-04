import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
    _id: Types.ObjectId;
    creatorId: string;
    occasionId: Types.ObjectId; 
    comment: string;
    timeId: string;
    type: 'COMMENT' | 'TEST' | 'CANCELED'; 
    reactions?: {
        votes: {
            userId: Types.ObjectId;
            type: 'upvote' | 'downvote';
        }[];
    };
    replies?: Types.ObjectId[];
}

const CommentSchema: Schema = new Schema({
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    occasionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Occasion', required: true },
    comment: { type: String, required: true },
    timeId: { type: String, required: true },
    type: { type: String, enum: ['COMMENT', 'TEST', 'CANCELED'], required: true },
    reactions: {
        votes: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                type: { type: String, enum: ['upvote', 'downvote'] }
            }
        ]
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
