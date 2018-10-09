import express from 'express';
import verifyToken from '../auth/index';
import invitationsController from '../controllers/invitationsController';
import errorHandler from '../middlewares/errors';

let api = express.Router();

api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", '*');
    res.header("Content-Type", 'application/json');
    next();
});

api.get('/', verifyToken, errorHandler.catchAsync(invitationsController.find));

api.post('/', verifyToken, errorHandler.catchAsync(invitationsController.create));

api.delete('/:id', verifyToken, errorHandler.catchAsync(invitationsController.delete));

export default api;