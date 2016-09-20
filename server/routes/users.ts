
import * as express from 'express';
import * as bodyParser from 'body-parser';

let router = express.Router();

router = express.Router(); 
    
router.use(bodyParser());

router.get('/', (req : express.Request, res : express.Response) => {
  let users = [
    {login: 'baxet', password: 'qwerty', role: 'ADMIN'},
    {login: 'test', password: 'test', role: 'USER'}
  ];
  console.log("All users requested.");
  res.send("OK");
});

router.post('/', (req : express.Request, res : express.Response) => {
  console.log("User : "+req.body.login+" posted.");
  res.send("OK");
});

export { router as userRoutes};