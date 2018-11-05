import express from 'express';
import verifyToken from '../auth/index';
import answersController from '../controllers/answersController';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', verifyToken, errorHandler.catchAsync(answersController.findAll));

api.post('/', verifyToken, errorHandler.catchAsync(answersController.create));

api.put('/:id', verifyToken, errorHandler.catchAsync(answersController.update));

export default api;