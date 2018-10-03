import express from 'express';
import notificationsController from '../controllers/notificationsController';
import getFilters from '../middlewares/filters/notifications';
import verifyToken from '../auth/index';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(notificationsController.findAll));

api.post('/', verifyToken, errorHandler.catchAsync(notificationsController.create));

export default api;