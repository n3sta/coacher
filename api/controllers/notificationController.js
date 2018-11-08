import Notification from '../models/Notification';

export default {
	async findAll(req, res) {
		const notifications = await Notification.find({notifier: req.query.notifier}).populate('notifier').populate('notificationObject');

		return res.status(200).json(notifications);
	},
	async update(req, res) {
		const notification = await Notification.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(notification);
	},
}