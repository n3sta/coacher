import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    default: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Type', typeSchema);