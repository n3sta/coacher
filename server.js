import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from "./api/routes/authRoutes";
import userRoutes from "./api/routes/userRoutes";
import trainingRoutes from "./api/routes/trainingRoutes";
import trainingTypesRoutes from "./api/routes/trainingTypesRoutes";
import invitationsRoutes from "./api/routes/invitationsRoutes";
import questionsRoutes from "./api/routes/questionsRoutes";
import answersRoutes from "./api/routes/answersRoutes";
import competitionsRoutes from "./api/routes/competitionsRoutes";

const hostname = 'localhost/api';
const port = 8080;
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
app.use('/invitations', invitationsRoutes);
app.use('/questions', questionsRoutes);
app.use('/answers', answersRoutes);
app.use('/competitions', competitionsRoutes);

app.listen(port, hostname, () => {
    console.log('Server running at http://'+ hostname + ':' + port + '/');
});