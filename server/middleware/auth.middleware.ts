import * as express from 'express';
import {Config} from '../config';
var jwt = require('jsonwebtoken');

var app = express();

var middleware = function (req, res, next) {
    let token = req.headers.authorization;
    if (token !== undefined) {
        let jwtoken = token.split(" ")[1];
        jwt.verify(jwtoken, Config.secret, (error, decoded) => {
            if (error) {
                req['loggedIn'] = false;
                req['user'] = {};
                req['role'] = "";
                next();
            } else {
                //good, authenticated request
                req['loggedIn'] = true;
                delete decoded.user.password;
                req['user'] = decoded;
                req['user_id'] = decoded.user._id;
                req['role'] = req['user'].user.role;
                res.locals.user = decoded;
                res.locals.role = decoded.user.role;
                res.locals.user_id = decoded.user._id;
                next();
            }
        });
    } else {
        req['loggedIn'] = false;
        req['user'] = {};
        req['role'] = "";
        next();
    }
};

export {middleware as AuthMiddleware};
