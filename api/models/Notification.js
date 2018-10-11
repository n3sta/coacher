import mongoose from 'mongoose';
import User from '../models/User';
import Training from '../models/Training';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    training: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: true
    },
    pupil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: Number,
    }
});

export default mongoose.model('Notification', notificationSchema);