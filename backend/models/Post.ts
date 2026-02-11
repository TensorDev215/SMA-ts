import mongoose, { Schema, Document, model } from "mongoose";

interface IComment {
    user: mongoose.Types.ObjectId;
    content: string;
    createAt: Date;
}

interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    likes: mongoose.Types.ObjectId[];
    comments:  IComment[];
    createAt: Date;
}

const postSchema = new Schema<IPost> ({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            content: {
                type: String,
                required: true
            },
            createAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    createAt: {
        type: Date,
        default: Date.now,
    }
})