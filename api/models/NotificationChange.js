import mongoose from 'mongoose';

const notificationChangeSchema = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationObject',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('NotificationChange', notificationChangeSchema);