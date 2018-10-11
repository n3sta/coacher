import Question from '../models/Question';

export default {
    async find(req, res) {
        const questions = await Question.find({userId: req.query.userId}).sort({order: 1});

        return res.status(200).json(questions);
    },
    async findOne(req, res) {
        const questions = await Question.findOne({_id: req.params.id});

        return res.status(200).json(questions);
    },
    async create(req, res) {
        const question = await new Question(req.body).save();

        return res.status(200).json(question);
    },
    async update(req, res) {
        const question = await Question.findOneAndUpdate({_id: req.params.id}, req.body);

        return res.status(200).json(question);
    },
    async delete(req, res) {
        const question = await Question.find({_id: req.params.id}).remove();

        return res.status(200).json(question);
    },
    async reorder(req, res) {
        const oldIndex = req.body.oldIndex*1;
        const newIndex = req.body.newIndex*1;

        if (oldIndex > newIndex) {
            await Question.update(
                {userId: req.userId, order: {$lte: oldIndex, $gte: newIndex}},
                {$inc: {order: 1}},
                {multi: true}
            ).exec();
            await Question.findOneAndUpdate({userId: req.userId, order: oldIndex + 1}, {order: newIndex});
        } else if (oldIndex < newIndex) {
            await Question.update(
                {userId: req.userId, order: {$lte: newIndex, $gte: oldIndex}},
                {$inc: {order: -1}},
                {multi: true}
            ).exec();
            await Question.findOneAndUpdate({userId: req.userId, order: oldIndex - 1}, {order: newIndex});
        }

        return res.status(200).json(true);
    }
}