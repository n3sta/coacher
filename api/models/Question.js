import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    question: {
        type: 'String'
    },
    order: {
        type: 'Number',
        default: 0
    },
    type: {
        type: 'Number'
    },
    options: {
        type: 'Array'
    }
});

questionSchema.pre('save', function(next) {
    const self = this;
    Question.find({}).sort({order: -1}).then((res) => {
        self.order = (res.length) ? res[0].order + 1 : 0;
        next();
    }).catch((err) => {
        next(err);
    });
});

const Question = mongoose.model('Question', questionSchema);

export default Question;