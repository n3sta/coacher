import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from "./api/routes/authRoutes";
import userRoutes from "./api/routes/userRoutes";
import trainingRoutes from "./api/routes/trainingRoutes";
import trainingTypesRoutes from "./api/routes/trainingTypesRoutes";
import notificationsRoutes from "./api/routes/notificationsRoutes";

const hostname = '127.0.0.1';
const port = 8081;
const app = express();
const mongoDB = 'mongodb://localhost:27017/app';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/trainings', trainingRoutes);
app.use('/trainingTypes', trainingTypesRoutes);
app.use('/notifications', notificationsRoutes);

app.listen(port, hostname, () => {
    console.log('Server running at http://'+ hostname + ':' + port + '/');
});