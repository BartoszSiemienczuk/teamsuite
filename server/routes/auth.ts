import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as User from '../model/user';
import { Config } from '../config';
var expressJwt = require ('express-jwt');
var jwt = require ('jsonwebtoken');

let secret = Config.secret;
let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(expressJwt({secret : secret, credentialsRequired: false}).unless({path : ['/auth/login']}));

router.post('/login', (req : express.Request, res : express.Response) => {
  User.findOne({login: req.body.login}, (err, user) => {
    if(!user){
      res.status(200).json({error:"bad_login", success: false, token: null});
    } else {
      user.comparePassword(req.body.password, (err, matches) => {
        if(!matches){ //bad credentials
          res.status(200).json({error:"bad_password", success: false, token: null});
        } else { //credentials match, lets login and save user data in token
          delete user.password;
          let token_ = jwt.sign({user:user}, secret, {expiresIn: Config.tokenExpiration});
          res.status(200).json({error:null, success:true, token:token_});
        }
      });
    }
  });
});

router.get('/user', (req, res) => {
  if(req['loggedIn']){
    res.status(200).json({user: req['user']});
  } else {
    res.status(401).json({error:"Unauthorized."});
  }
});

export { router as authRoutes};