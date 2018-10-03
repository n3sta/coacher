import Training from '../../models/Notification';
import qs from 'qs'
import _ from 'lodash';

export default function getFilters(req, res, next) {
	const availableFilters = Object.keys(Training.schema.paths);
	const filters = qs.parse(req.query);

	req.filters = _.pickBy(filters, (value, key) => availableFilters.indexOf(key) > -1);
	next();
}