import moment from 'moment';
import Training from '../models/Training';
import trainingHelpers from '../middlewares/helpers/trainings';

export default {
	async findOne(req, res, next) {
		const training = await Training.findOne({_id: req.params.id});

	    return res.status(200).json(training);
	},
	async findAll(req, res, next) {
	    const trainings = await Training.find(req.filters).populate('trainingType');

	    return res.status(200).json(trainings);
	},
	async create(req, res) {
		const training = await new Training({
	        content: req.body.content,
	        note: req.body.note,
	        amount: req.body.amount,
	        done: req.body.done,
	        user: req.body.user,
	        trainingType: req.body.trainingType,
	        createdAt: req.body.createdAt
	    }).save();

	    return res.status(200).json(training)
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
		const startYear = moment(req.query.date).startOf('year');
		const endYear = moment(req.query.date).endOf('year');

		const week = trainingHelpers.stats(user, startWeek, endWeek);
		const weekDone = trainingHelpers.stats(user, startWeek, endWeek, 1);
		const month = trainingHelpers.stats(user, startMonth, endMonth);
		const monthDone = trainingHelpers.stats(user, startMonth, endMonth, 1);
		const year = trainingHelpers.stats(user, startYear, endYear);
		const yearDone = trainingHelpers.stats(user, startYear, endYear, 1);

		await Promise.all([week, weekDone, month, monthDone, year, yearDone]).then((entity) => {
			return res.status(201).json({
				week: entity[0],
				weekDone: entity[1],
				month: entity[2],
				monthDone: entity[3],
				year: entity[4],
				yearDone: entity[5]
			});
		})		
	}
}