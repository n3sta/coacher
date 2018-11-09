import bcrypt from 'bcryptjs';
import User from '../models/User';
import Training from "../models/Training";
import Question from '../models/Question';
import userHelpers from '../middlewares/helpers/users';
import { fillRegisterData, fillSampleData } from '../utils/fillRegisterData';
import Type from '../models/Type';

export default {
	async register(req, res) {
		const hashed = bcrypt.hashSync(req.body.password, 8);
        const user = await new User({
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName
            },
            email: req.body.email,
            password: hashed,
            coach: req.body.coach,
            coachId: req.body.coachId
        }).save();

        try {
            if (user.coach) {
                fillRegisterData(user._id);
                fillSampleData(user._id);
            } else {
                setNotification({
                    entityType: 1,
                    entityId: training._id,
                    notifier: (forCoach) ? req.userId : training.user,
                    actor: (forCoach) ? training.user : req.userId
                })
            }
            return res.status(200).json({
                user: user,
                token: userHelpers.generateToken(user._id)
            });
        } catch(e) {
            return res.status(400).json({message: 'Błąd podczas tworzenia konta.',});
        }
	},
	async login(req, res) {
		const user = await User.findOne({email: req.body.email}).select('+password').exec();
		if (!user) return res.status(404).json({'message': 'Nie ma takiego adresu e-mail.'});

        const valid = bcrypt.compareSync(req.body.password, user.password);
		if (!valid) return res.status(403).json({'message': 'Nieprawidłowe hasło lub adres e-mail.'});

        const userNew = await User.findOne({email: req.body.email}).exec();

        return res.status(200).json({
            user: userNew,
            token: userHelpers.generateToken(userNew._id)
        });
	},
    async logged(req, res) {
        const user = await User.findOne({_id: req.params.id});
        if (!user) return res.status(404).json({message: 'Nie ma takiego użytkownika.'})

        return res.status(200).json({
            user: user,
            token: userHelpers.generateToken(user._id)
        });
    },
    async clean(req, res) {
        try {
            await User.remove({coachId: req.userId});
            await Training.remove({user: req.userId});
            await Question.remove({user: req.userId});
            await Type.remove({user: req.userId});
            await User.findOneAndUpdate({_id: req.userId}, {activated: true});
            return res.status(200).json({message: 'Przykładowe dane zostały usunięte.'});
        } catch(e) {
            return res.status(400).json({message: 'Wystąpił bład. Spróbuj ponownie.'});
        }
    },
    async email(req, res) {
        const user = await User.findOne({email: req.query.email});

        return res.status(200).json(user);
    },
    async fill(req, res) {
        fillRegisterData('5be31dd320becd02314bc0d6');
        return res.status(200).json(fillSampleData('5be31dd320becd02314bc0d6'));
    }
}