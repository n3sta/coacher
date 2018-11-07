import express from 'express';
import verifyToken from '../auth/index';
import questionsController from '../controllers/questionsController';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.put('/change/reorder', verifyToken, errorHandler.catchAsync(questionsController.reorder));

api.get('/', verifyToken, errorHandler.catchAsync(questionsController.find));

api.get('/:id', verifyToken, errorHandler.catchAsync(questionsController.findOne));

api.post('/', verifyToken, errorHandler.catchAsync(questionsController.create));

api.put('/:id', verifyToken, errorHandler.catchAsync(questionsController.update));

api.delete('/:id', verifyToken, errorHandler.catchAsync(questionsController.delete));

export default api;