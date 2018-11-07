import Training from '../models/Training';
import User from '../models/User';
import Type from '../models/Type';

export default {
	async findOne(req, res) {
		const training = await Training.findOne({_id: req.params.id});

		return res.status(200).json(training);
	},
	async findAll(req, res) {
		const user = await User.findOne({_id: req.query.user});
		const id = (user.coach) ? req.query.user : user.coachId;
		const types = await Type.find({user: id, active: true});
		//req.filters.type = {$in: types};
		const trainings = await Training.find(req.filters).sort('createdAt').populate('type');

		return res.status(200).json(trainings);
	},
	async create(req, res) {
		const training = await new Training(req.body).save();

		return res.status(200).json(training);
	},
	async update(req, res) {
		const training = await Training.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(training);
	},
	async delete(req, res) {
		const training = await Training.find({_id: req.params.id}).remove();

		return res.status(200).json(training);
	},
	async stats(req, res) {
		const user = req.query.user;
		const plan = Training.count({user: user}).exec();
		const planDone = Training.count({user: user, done: true}).exec();

		await Promise.all([plan, planDone]).then((entity) => {
			return res.status(200).json({
				plan: entity[0],
				planDone: entity[1]
			});
		})		
	},
}