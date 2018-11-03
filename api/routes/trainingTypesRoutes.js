import express from 'express';
import trainingTypesController from '../controllers/trainingTypesController';
import verifyToken from '../auth/index';
import getFilters from '../middlewares/filters/trainingTypes';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(trainingTypesController.findAll));

api.put('/:id', verifyToken, errorHandler.catchAsync(trainingTypesController.update));

api.delete('/:id', verifyToken, errorHandler.catchAsync(trainingTypesController.delete));

export default api;