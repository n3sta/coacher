import express from 'express';
import notificationController from '../controllers/notificationController';
import verifyToken from '../auth/index';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.get('/', verifyToken, errorHandler.catchAsync(notificationController.findAll));

api.put('/', verifyToken, errorHandler.catchAsync(notificationController.update));

export default api;