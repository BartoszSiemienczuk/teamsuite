import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as User from '../model/user';

let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/', (req : express.Request, res : express.Response) => {
  User.find((err, Users) => {
    if(err){
      res.json({error: err, info: "Error loading users"});
    }
    res.json(Users);
  });
});

router.post('/', (req : express.Request, res : express.Response) => {
  let user = new User({login: req.body.login, password: req.body.password});
  user.save();
  res.status(200).json({success: 'true', login: user.login});
});

export { router as userRoutes};