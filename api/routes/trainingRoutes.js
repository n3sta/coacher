import express from 'express';
import verifyToken from '../auth/index';
import trainingsController from '../controllers/trainingsController';
import getFilters from '../middlewares/filters/trainings';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.get('/stats', verifyToken, errorHandler.catchAsync(trainingsController.stats));

api.get('/:id', verifyToken, errorHandler.catchAsync(trainingsController.findOne));

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(trainingsController.findAll));

api.post('/', errorHandler.catchAsync(trainingsController.create));

api.put('/:id', verifyToken, errorHandler.catchAsync(trainingsController.update));

api.delete('/:id', verifyToken, errorHandler.catchAsync(trainingsController.delete));

export default api;