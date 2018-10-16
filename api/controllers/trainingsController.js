import moment from 'moment';
import Training from '../models/Training';
import trainingHelpers from '../middlewares/helpers/trainings';

export default {
	async findOne(req, res) {
		const training = await Training.findOne({_id: req.params.id});

		return res.status(200).json(training);
	},
	async findAll(req, res) {
		const trainings = await Training.find(req.filters).populate('trainingType');

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
		const startWeek = moment(req.query.date).startOf('isoweek');
		const endWeek = moment(req.query.date).endOf('isoweek');
		const startMonth = moment(req.query.date).startOf('month');
		const endMonth = moment(req.query.date).endOf('month');

		const week = trainingHelpers.sum(user, startWeek, endWeek);
		const weekDone = trainingHelpers.sum(user, startWeek, endWeek, 1);
		const month = trainingHelpers.sum(user, startMonth, endMonth);
		const monthDone = trainingHelpers.sum(user, startMonth, endMonth, 1);
		const plan = Training.count({user: user}).exec();
		const planDone = Training.count({user: user, done: true}).exec();

		await Promise.all([week, weekDone, month, monthDone, plan, planDone]).then((entity) => {
			return res.status(201).json({
				week: entity[0],
				weekDone: entity[1],
				month: entity[2],
				monthDone: entity[3],
				plan: entity[4],
				planDone: entity[5]
			});
		})		
	},
}