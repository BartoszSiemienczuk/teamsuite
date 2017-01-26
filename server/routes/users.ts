import * as express from 'express';
import * as bodyParser from 'body-parser';
import {User} from '../model';

let router = express.Router();

router = express.Router();

//noinspection TypeScriptValidateTypes
router.use(bodyParser.json());
//noinspection TypeScriptUnresolvedFunction,TypeScriptValidateTypes
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req: express.Request, res: express.Response) => {
    //TODO permissions
    if (req['loggedIn'] == false) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    User.find().populate('teams').exec((err, Users) => {
        if (err) {
            res.json({error: err, info: "Error loading users"});
        }
        else {
            res.json(Users);
        }
    });
});

router.post('/', (req: express.Request, res: express.Response) => {
    var role = req['user'].user.role;
    if (req['loggedIn'] == false || role != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }

    let user = new User({
        login: req.body.login,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    });
    user.save();
    res.status(200).json({success: 'true', login: user.login});
});

router.post('/delete/', (req: express.Request, res: express.Response) => {
    var role = req['role']
    if (req['loggedIn'] == false || role != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    let uid = req.body.user_id;

    User.remove({_id: uid}, (err) => {
        if (err) {
            res.status(200).json({success: 'false', error: err});
        }
        else {
            res.status(200).json({success: 'true'});
        }
    });

});

router.get('/notes', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false ) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }

    console.log("DBG1:"+req['user_id']);

    User.findOne({_id:req['user_id']}, (err, user)=>{
        if(err){
            res.status(200).json({success: false, error: "Error loading user notes."});
            return;
        } else {
            res.status(200).json({success: true, login: user.login, notes: user.notes});
            return;
        }
    });
});

router.post('/notes', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false ) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }

    let uid = req['user'].user._id;
    let newNote = req.body.note;

    User.findOne({_id:uid}, (err, user)=>{
        if(err){
            res.status(200).json({success: false, error: "Error loading user notes."});
            return;
        } else {
            user.notes.push(newNote);
            user.save();
        }
    });
});

router.post('/notes/delete', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false ) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }

    let uid = req['user'].user._id;
    let deletedNote = req.body.note;

    User.findOne({_id:uid}, (err, user)=>{
        if(err){
            res.status(200).json({success: false, error: "Error loading user notes."});
            return;
        } else {
            user.notes = user.notes.filter(note => note!=deletedNote);
            user.save();
        }
    });
});

router.post('/role', (req: express.Request, res: express.Response) => {
    var uid = req.body.user_id;
    var role = req.body.role;
    if (req['loggedIn'] == false || req['role'] != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    if (role != "ADMIN" && role != "USER" && role != "LEADER") {
        res.status(200).json({success: false, error: "Invalid role type."});
        return;
    }
    User.findOne({_id: uid}, (err, user) => {
        if (err) {
            res.status(200).json({success: false, error: "Error loading user."});
            return;
        } else {
            user.role = req.body.role;
            user.save();
            res.status(200).json({success: true, error: null, login: user.login});
            return;
        }
    });
});

router.patch('/:login', (req: express.Request, res: express.Response) => {
    var role = req['user'].user.role;
    if (req['loggedIn'] == false || role != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }

    User.findOne({login: req.params['login']}, (err, user) => {
        if (err) {
            res.status(200).json({success: false, error: "Error loading user."});
            return;
        } else {
            if (req.body.name) user.name = req.body.name;
            if (req.body.login) user.login = req.body.login;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;
            user.save();
            res.status(200).json({success: true, error: null, login: user.login});
            return;
        }
    });
});

export {router as userRoutes};