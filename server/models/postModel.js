import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Post cannot be empty'],
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Post = new mongoose.model('Post', postSchema);
