import mongoose from 'mongoose';
import moment from "moment/moment";

const canBeDone = (date) => {
    return moment(date).format('YYYY-MM-DD') >= moment(new Date()).format('YYYY-MM-DD')
};

const trainingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    trainingType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingType'
    },
    content: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        min: 0,
        max: 256,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    deletedAt: {
        type: Date,
        default: ''
    },
});

trainingSchema.pre('save', function(next) {
    if (canBeDone(this.createdAt)) {
        this.done = false;
    }
    next();
});

trainingSchema.pre('findOneAndUpdate', function(next) {
    if (canBeDone(this.createdAt)) {
        this.findOneAndUpdate({}, {done: false});
    }
    next();
});

const Training = mongoose.model('Training', trainingSchema);

export default Training;