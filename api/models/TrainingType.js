import mongoose from 'mongoose';
import User from '../models/User';

const trainingTypeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('TrainingType', trainingTypeSchema);