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
                res.locals.loggedIn = false;
                res.locals.user = {};
                res.locals.role = "";
                next();
            } else {
                //good, authenticated request
                delete decoded.user.password;

                res.locals.loggedIn = true;
                res.locals.user = decoded;
                res.locals.user_id = decoded.user._id;
                res.locals.role = res.locals.user.user.role;

                next();
            }
        });
    } else {
        res.locals.loggedIn = false;
        res.locals.user = {};
        res.locals.role = "";
        next();
    }
};

export {middleware as AuthMiddleware};
