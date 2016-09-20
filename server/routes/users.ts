import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as db from 'mongoose';
import * as User from '../model/user';

let router = express.Router();

router = express.Router(); 
db.connect('mongodb://localhost/teamsuite');
    
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
  console.log("User : "+req.body.login +"\n posted.");
  res.send("OK");
});

export { router as userRoutes};