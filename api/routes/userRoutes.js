import express from 'express';
import usersController from '../controllers/usersController'
import getFilters from '../middlewares/filters/users';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', getFilters, errorHandler.catchAsync(usersController.find));

api.put('/:id', errorHandler.catchAsync(usersController.update));

export default api;