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

const hostname = '54.38.55.135';
const port = process.env.PORT || 8082;
const app = express();
const mongoDB = 'mongodb://localhost:27017/app';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/trainingTypes', trainingTypesRoutes);
app.use('/api/invitations', invitationsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/competitions', competitionsRoutes);

app.listen(port, hostname, () => {
    console.log('Server running at http://'+ hostname + ':' + port + '/');
});