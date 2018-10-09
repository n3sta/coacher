import Training from '../../models/Training.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export default {
	sum(user, startDate, endDate, done) {
		let filters = {
			user: ObjectId(user)
		};
		if (startDate && endDate) {
			filters.createdAt = {
				$lte: new Date(endDate),
				$gte: new Date(startDate)
			}
		}
		if (done) {
			filters.done = !!done;
		}
		return new Promise((resolve, reject) => {
			Training.aggregate([
				{ 
					$match: filters
				},
				{
					$group: {
						_id: null,
						amount: {
							$sum: "$amount"
						}
					}
				}
			]).then((entity) => {
				resolve((entity[0]) ? entity[0].amount : 0);
			}).catch((err) => {
				reject(err);
			})
		})
	},
}