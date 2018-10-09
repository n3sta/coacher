import User from '../models/User';

export default {
	async find(req, res) {
		const users = await User.find(req.filters);

		return res.status(200).json(users)
	},
	async update(req, res) {
		const user = await User.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(user)
	},
	async patch(req, res) {
		const user = await User.findOneAndUpdate({_id: req.params.id}, req.body);

        return res.status(200).json(user)
	}
}