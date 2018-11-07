import Type from '../models/Type';
import Training from '../models/Training';

export default {
	async findAll(req, res) {
		const types = await Type.find({user: req.query.user});

		return res.status(200).json(types);
	},
	async findOne(req, res) {
		const type = await Type.findOne({_id: req.params.id});

		return res.status(200).json(type);
	},
	async create(req, res) {
		const type = await new Type(req.body).save();

		return res.status(200).json(type);
	},
	async update(req, res) {
		const type = await Type.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(type);
	},
	async delete(req, res) {
		const type = await Type.findOne({_id: req.params.id});
		if (type._default) res.status(400).json({message: 'Nie można usunąć domyślnego typu'});

		const defaultType = await Type.findOne({user: req.userId, default: true});
		await Training.update(
			{type: type._id},
			{type: defaultType._id},
			{multi: true}
		);
		await Type.findOne({_id: req.params.id}).remove()

        return res.status(200).json(type);
	},
}