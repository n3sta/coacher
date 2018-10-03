import express from 'express';
import authController from '../controllers/authController';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.post('/register', errorHandler.catchAsync(authController.register));

api.post('/login', errorHandler.catchAsync(authController.login));

export default api;