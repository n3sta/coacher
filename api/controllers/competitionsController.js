import Competition from '../models/Competition';

export default {
    async findAll(req, res) {
        const competitions = await Competition.find(req.filters).sort(req.extraFilters.sort).skip(req.extraFilters.skip).limit(req.extraFilters.limit);

        return res.status(200).json(competitions);
    },
    async findOne(req, res) {
        const competition = await Competition.findOne({_id: req.params.id});

        return res.status(200).json(competition);
    },
    async create(req, res) {
        const competition = await new Competition(req.body).save();

        return res.status(200).json(competition);
    },
    async update(req, res) {
        const competition = await Competition.findOneAndUpdate({_id: req.params.id}, req.body);

        return res.status(200).json(competition);
    },
    async delete(req, res) {
        const competition = await Competition.remove({_id: req.params.id});

        return res.status(200).json(competition);
    }
}