import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotificationObject',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model('Notification', notificationSchema);