import jwt from 'jsonwebtoken';
import config from '../../config/config';

export default {
	generateToken(_id) {
	    return jwt.sign({_id: _id}, config.secret, {
	        expiresIn: 86400*30
	    });
	}
}