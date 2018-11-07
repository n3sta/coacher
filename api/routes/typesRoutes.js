import express from 'express';
import typesController from '../controllers/typesController';
import verifyToken from '../auth/index';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.get('/', verifyToken, errorHandler.catchAsync(typesController.findAll));

api.get('/:id', verifyToken, errorHandler.catchAsync(typesController.findOne));

api.put('/:id', verifyToken, errorHandler.catchAsync(typesController.update));

api.post('/', verifyToken, errorHandler.catchAsync(typesController.create));

api.delete('/:id', verifyToken, errorHandler.catchAsync(typesController.delete));

export default api;