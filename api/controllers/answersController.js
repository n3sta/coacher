import Answer from '../models/Answer';

export default {
    async find(req, res) {
        const answers = await Answer.find({userId: req.query.user});

        return res.status(200).json(answers);
    },
    async create(req, res) {
        const answer = await new Answer(req.body).save();

        return res.status(200).json(answer);
    },
    async update(req, res) {
        const answer = await Answer.findOneAndUpdate({_id: req.params.id}, req.body).save();

        return res.status(200).json(answer);
    },
}