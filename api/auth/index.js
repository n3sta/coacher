import config from "../config/config";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({error: 'Token not provided'});

    jwt.verify(token, config.secret, (err, entity) => {
        if (err) return res.status(401).json({error: 'Failed to authenticate token.'});
        
        req['userId'] = entity._id;
        next();
    });
};

module.exports = verifyToken;