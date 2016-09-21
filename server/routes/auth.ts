import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as User from '../model/user';

let secret = "aJD39xmZA8b24uD9qfkddmH3yk5dcZjw";
let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));


router.post('/login', (req : express.Request, res : express.Response) => {
  console.log("Login attempt : "+req.body.login +"\n posted.");
  User.findOne({login: req.body.login}, (err, user) => {
    user.comparePassword(req.body.password, (err, matches) => {
      if(err) throw err;
      if(!matches){
        res.status(401).send("Not authenticated");
      } else {
        res.status(200).json("OK");
      }
    });
  });
});

export { router as authRoutes};