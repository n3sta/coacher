import User from '../models/User';
import bcrypt from "bcryptjs";

export default {
	async find(req, res) {
		const users = await User.find(req.filters);

		return res.status(200).json(users)
	},
    async findOne(req, res) {
        const user = await User.findOne({_id: req.params.id});

        return res.status(200).json(user)
    },
	async update(req, res) {
		const user = await User.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(user)
	},
	async patch(req, res) {
		const user = await User.findOneAndUpdate({_id: req.params.id}, req.body);

        return res.status(200).json(user)
	},
    async changePassword(req, res) {
        const password = bcrypt.hashSync(req.body.password, 8);
        const user = await User.findOneAndUpdate({_id: req.userId}, {password: password});

        return res.status(200).json(password);
    },
	async checkPassword(req, res) {
		const user = await User.findOne({_id: req.userId}).select('+password');

		return res.status(200).json(bcrypt.compareSync(req.query.password, user.password))
	}
}