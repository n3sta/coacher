import express from 'express';
import usersController from '../controllers/usersController'
import getFilters from '../middlewares/filters/users';
import errorHandler from '../middlewares/errors';
import verifyToken from '../auth/index';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.patch('/changePassword', verifyToken, getFilters, errorHandler.catchAsync(usersController.changePassword));

api.get('/checkPassword', verifyToken, getFilters, errorHandler.catchAsync(usersController.checkPassword));

api.get('/', verifyToken, getFilters, errorHandler.catchAsync(usersController.find));

api.get('/:id', verifyToken, getFilters, errorHandler.catchAsync(usersController.findOne));

api.put('/:id', verifyToken, errorHandler.catchAsync(usersController.update));

api.patch('/:id', verifyToken, errorHandler.catchAsync(usersController.patch));

api.delete('/:id', verifyToken, errorHandler.catchAsync(usersController.delete));

export default api;