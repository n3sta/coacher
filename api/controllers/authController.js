import bcrypt from 'bcryptjs';
import User from '../models/User';
import fillTrainingTypes from '../middlewares/helpers/trainingTypes';
import userHelpers from '../middlewares/helpers/users';

export default {
	async register(req, res) {
		const hashed = bcrypt.hashSync(req.body.password, 8);
	    const user = await new User({
	        email: req.body.email,
	        password: hashed,
	        coach: req.body.coach
	    }).save();


	    return res.status(200).json({
            user: user,
            token: userHelpers.generateToken(user._id)
        });
	},
	async login(req, res) {
		const user = await User.findOne({email: req.body.email}).exec();
		if (!user) return res.status(400).json({'message': 'Nie ma takiego adresu e-mail lub użytkownika.'})

	    const valid = bcrypt.compareSync(req.body.password, user.password);
		if (!valid) return res.status(403);

        return res.status(200).json({
            user: user,
            token: userHelpers.generateToken(user._id)
        });
	}
}