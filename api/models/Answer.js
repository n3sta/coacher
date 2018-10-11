import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: String,
        default: null
    }
});

export default mongoose.model('Answer', invitationSchema);