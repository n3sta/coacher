import mongoose from 'mongoose';
import User from '../models/User';
import Training from '../models/Training';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    training: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training'
    },
    pupil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: Number,
    }
});

module.exports = mongoose.model('Notification', notificationSchema);