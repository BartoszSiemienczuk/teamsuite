import * as express from 'express';
import { Config } from '../config';
var jwt = require ('jsonwebtoken');

var app = express();

var middleware = function (req, res, next) {
  let token = req.headers.authorization;
  if(token!==undefined){
    let jwtoken = token.split(" ")[1];
    jwt.verify(jwtoken, Config.secret, (error, decoded) => {
      if(error){
        req['loggedIn'] = false;
      } else {
        //good, authenticated request
        req['loggedIn'] = true;
        req['user'] = decoded;
      }
    });
  } else {
    req['loggedIn'] = false;
  }
  next();
};

export { middleware as AuthMiddleware };
