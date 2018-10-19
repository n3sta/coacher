import bcrypt from 'bcryptjs';
import User from '../models/User';
import userHelpers from '../middlewares/helpers/users';
import fillRegisterData from '../utils/fillRegisterData';

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
            coach: req.body.coach
        }).save();

        try {
            fillRegisterData(user._id);
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

        return res.status(200).json({
            user: user,
            token: userHelpers.generateToken(user._id)
        });
    }
}