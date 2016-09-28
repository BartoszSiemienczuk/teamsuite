import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as User from '../model/user';
var expressJwt = require ('express-jwt');
var jwt = require ('jsonwebtoken');

let secret = "aJD39xmZA8b24uD9qfkddmH3yk5dcZjw";
let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(expressJwt({secret : secret, credentialsRequired: false}).unless({path : ['/auth/login']}));

router.post('/login', (req : express.Request, res : express.Response) => {
  console.log("Login attempt : "+req.body.login +"\n posted.");
  User.findOne({login: req.body.login}, (err, user) => {
    if(!user){
      res.status(401).json({error:"bad_login"});
    } else {
      user.comparePassword(req.body.password, (err, matches) => {
        if(err){
          console.log(err);
        }
        if(!matches){ //bad credentials
          res.status(401).json({error:"bad_password", success: false});
        } else { //credentials match, lets login
          let token_ = jwt.sign({user:user}, secret);
          res.status(200).json({error:null, success:true, token:token_});
        }
      });
    }
  });
});

router.get('/user', (req: express.Request, res : express.Response) => {
  console.log("User data expected.");
  res.status(200).send("OK");
});

export { router as authRoutes};