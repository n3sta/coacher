import mongoose from 'mongoose';
import User from '../models/User';
import TrainingType from '../models/TrainingType';

const trainingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    trainingType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingType'
    },
    content: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true
    },
    done: {
        type: Boolean,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    deletedAt: {
        type: Date,
        default: ''
    },
});

module.exports = mongoose.model('Training', trainingSchema);