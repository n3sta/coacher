import mongoose from 'mongoose';
import moment from "moment/moment";

const daysDiff = (date) => {
    const start = moment(date).startOf('day');
    const end = moment(new Date()).startOf('day');
    return start.diff(end, 'days');
};

const trainingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    },
    content: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: ''
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
    if (daysDiff(this.createdAt) > 0) {
        this.done = false;
    }
    next();
});

trainingSchema.pre('findOneAndUpdate', function(next) {
    if (daysDiff(this._update.createdAt) > 0) {
        this.findOneAndUpdate({_id: this._conditions._id}, {done: false});
    }
    next();
});

const Training = mongoose.model('Training', trainingSchema);

export default Training;