import * as express from 'express';
import * as bodyParser from 'body-parser';
import { User, Team } from '../model';
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
  console.log("LOGIN REQUEST");
  User.findOne({login: req.body.login}).populate('teams').exec((err, user) => {
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
    let uid = req['user'].user._id;
    User.findOne({_id: uid}).select('_id login name teams role email').populate('teams').exec((err, usr) => {
      let token_ = jwt.sign({user:usr}, secret, {expiresIn: Config.tokenExpiration});
      res.status(200).json({user:usr, token:token_});
    });
  } else {
    res.status(401).json({error:"Unauthorized."});
  }
});

router.post('/user', (req, res) => {
  if(req['loggedIn']){
    let uid = req['user'].user._id;
    User.findOne({_id:uid}, (err, usr) => {
      if(err){
        res.status(200).json({error:'Error updating DB.', success: false});
      } else {
        usr.email = req.body.email; 
        usr.name = req.body.name;
        usr.save();
        res.status(200).json({error:null, success: true, login: usr.login});
      }
    });
  } else {
    res.status(401).json({error:"Unauthorized."});
  } 
});

export { router as authRoutes};