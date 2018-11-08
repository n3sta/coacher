import mongoose from 'mongoose';

const notificationObjectSchema = new mongoose.Schema({
    entityType: {
        type: Number,
        required: true
    },
    entityId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('NotificationObject', notificationObjectSchema);