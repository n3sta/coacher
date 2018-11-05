import Competition from '../../models/Competition';
import qs from 'qs'
import _ from 'lodash';

export default function getFilters(req, res, next) {
	const availableFilters = Object.keys(Competition.schema.paths);
	const filters = qs.parse(req.query);
	req.extraFilters = {
		order_by: req.query.orderBy || 'date',
		page: parseInt(req.query.page) || 0,
		limit: parseInt(req.query.limit) || 0,
		skip: req.query.page * req.query.limit || 0
	};

	req.filters = _.pickBy(filters, (value, key) => availableFilters.indexOf(key) > -1);
	req.filters.user = req.userId;
	next();
}