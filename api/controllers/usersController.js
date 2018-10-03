import User from '../models/User';

export default {
	async find(req, res, next) {
		const users = await User.find(req.filters);

		return res.status(200).json(users)
	},
	async update(req, res, next) {
		const user = await User.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(user)
	},
}