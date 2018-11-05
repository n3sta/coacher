import express from 'express';
import verifyToken from '../auth/index';
import competitionsController from '../controllers/competitionsController';
import errorHandler from '../middlewares/errors';
import getFilters from '../middlewares/filters/competitions';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(competitionsController.findAll));

api.get('/:id', verifyToken, errorHandler.catchAsync(competitionsController.findOne));

api.post('/', verifyToken, errorHandler.catchAsync(competitionsController.create));

api.put('/:id', verifyToken, errorHandler.catchAsync(competitionsController.update));

api.delete('/:id', verifyToken, errorHandler.catchAsync(competitionsController.delete));

export default api;