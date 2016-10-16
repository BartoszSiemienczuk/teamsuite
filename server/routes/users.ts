import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as User from '../model/user';

let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/', (req : express.Request, res : express.Response) => {
  if(req['loggedIn']==false){
    res.status(401).json({success:false, error:"Unauthorized."});
    return;
  }
  User.find((err, Users) => {
    if(err){
      res.json({error: err, info: "Error loading users"});
    } else {
      res.json(Users);      
    }
  });
});

router.post('/', (req : express.Request, res : express.Response) => {
  let user = new User({login: req.body.login, password: req.body.password});
  user.save();
  res.status(200).json({success: 'true', login: user.login});
});

router.post('/:login', (req : express.Request, res : express.Response) => {
  var login = req.params.login;
  if(req['loggedIn']==false){
    res.status(401).json({success:false, error:"Unauthorized."});
  } else {
    if(req['user'].user.login != login){
      res.status(401).json({success:false, error:"Unauthorized."});      
    } else {
      res.status(200).json({success: 'true', login: login});
    }
  }
});

export { router as userRoutes};