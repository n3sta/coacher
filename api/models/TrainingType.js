import mongoose from 'mongoose';

const trainingTypeSchema = new mongoose.Schema({
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
});

export default mongoose.model('TrainingType', trainingTypeSchema);