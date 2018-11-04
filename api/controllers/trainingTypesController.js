import TrainingType from '../models/TrainingType';

export default {
	async findAll(req, res) {
		const trainingTypes = await TrainingType.find({user: req.query.user});

		return res.status(200).json(trainingTypes);
	},
	async update(req, res) {
		const trainingType = await TrainingType.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(trainingType);
	},
}