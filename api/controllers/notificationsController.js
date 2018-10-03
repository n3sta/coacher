import moment from 'moment';
import Notification from '../models/Notification';
import notificationHelpers from '../middlewares/filters/notifications';

export default {
	async findAll(req, res, next) {
	    await Notification.find(req.filters).populate('User').populate('Training').then((entities) => {
	    	return res.status(200).json(entities);
	    }).catch((err) => {
	    	return res.status(500).json({message: 'Błąd serwera.'});
	    });
	},
	async create(req, res, next) {
		const notification = await new Notification({
			user: req.body.user,
	        training: req.body.training,
	        pupil: req.body.pupil
		}).save().then((entity) => {
			return res.status(200).json(entity);
		});
	}
}