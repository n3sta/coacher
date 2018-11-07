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
    default: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Type', typeSchema);