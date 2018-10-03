import express from 'express';
import verifyToken from '../auth/index';
import trainingsController from '../controllers/trainingsController';
import getFilters from '../middlewares/filters/trainings';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/stats', verifyToken, errorHandler.catchAsync(trainingsController.stats));

api.get('/:id', verifyToken, errorHandler.catchAsync(trainingsController.findOne));

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(trainingsController.findAll));

api.post('/', errorHandler.catchAsync(trainingsController.create));

api.put('/:id', verifyToken, errorHandler.catchAsync(trainingsController.update));

api.delete('/:id', verifyToken, errorHandler.catchAsync(trainingsController.delete));

export default api;