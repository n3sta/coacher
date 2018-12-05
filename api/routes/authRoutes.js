import express from 'express';
import authController from '../controllers/authController';
import errorHandler from '../middlewares/errors';
import verifyToken from '../auth/index';

let api = express.Router();

api.get('/logged/:id', errorHandler.catchAsync(authController.logged));

api.get('/email', errorHandler.catchAsync(authController.email));

api.post('/register', errorHandler.catchAsync(authController.register));

api.post('/login', errorHandler.catchAsync(authController.login));

api.delete('/clean', verifyToken, errorHandler.catchAsync(authController.clean));

export default api;