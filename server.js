import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from "./api/routes/authRoutes";
import userRoutes from "./api/routes/userRoutes";
import trainingRoutes from "./api/routes/trainingRoutes";
import types from "./api/routes/typesRoutes";
import questionsRoutes from "./api/routes/questionsRoutes";
import answersRoutes from "./api/routes/answersRoutes";
import notificationRoutes from "./api/routes/notificationRoutes";

const hostname = 'localhost';
const port = 8082;
const app = express();
const mongoDB = 'mongodb://localhost:27017/app';

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/types', types);
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/notifications', notificationRoutes);
app.listen(port, hostname, () => {
    console.log('Server running at http://'+ hostname + ':' + port + '/');
});