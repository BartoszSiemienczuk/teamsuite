import * as express from 'express';
import * as bodyParser from 'body-parser';
import {User, Team} from '../model';

let router = express.Router();

router = express.Router();

//noinspection TypeScriptValidateTypes
router.use(bodyParser.json());
//noinspection TypeScriptUnresolvedFunction,TypeScriptValidateTypes
router.use(bodyParser.urlencoded({extended: true}));

//TODO implement roles conditions

router.get('/', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    Team.find((err, Teams) => {
        if (err) {
            res.json({error: err, info: "Error loading teams."});
        } else {
            res.json(Teams);
        }
    });
});

router.get('/users/:team_id', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false) {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    var teamid = req.params.team_id;
    console.log(teamid);
    Team.findOne({_id: teamid}).populate("users", "_id login name").exec((err, team)=>{
        if(err){
            res.status(200).json({success: false, error: "DB error."});
            return;
        }
        res.status(200).json(team.users);
    });
});

router.post('/', (req: express.Request, res: express.Response) => {
    if(req['role']!="ADMIN" || req['loggedIn'] == false){
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    let name = req.body.name;

    let team = new Team({name:name});
    team.save();

    res.status(200).json({success: 'true', name: team.name});
});

router.post('/assign', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false || req['role'] != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    let uid = req.body.user_id;
    let teamid = req.body.team_id;
    console.log("uid=" + uid);
    console.log("Teamid=" + teamid);
    User.findOne({_id: uid}, (err, user) => {
        if (err) {
            res.status(200).json({success: false, error: "No such user exception."});
            return;
        } else {
            Team.findOne({_id: teamid}, (err, team) => {
                if (err) {
                    res.status(200).json({success: false, error: "No such team exception."});
                    return;
                } else {
                    if (team.users.indexOf(uid) == -1) {
                        team.users.push(uid);
                        team.save();
                    }
                    if (user.teams.indexOf(teamid) == -1) {
                        user.teams.push(teamid);
                        user.save();
                    }
                    res.status(200).json({success: 'true', login: user.login, team: team.name});
                }
            });
        }
    });
});

router.post('/unassign', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false || req['role'] != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    let uid = req.body.user_id;
    let teamid = req.body.team_id;
    console.log("uid=" + uid);

    console.log("Teamid=" + teamid);
    User.findOne({_id: uid}, (err, user) => {
        if (err) {
            res.status(200).json({success: false, error: "No such user exception."});
            return;
        } else {
            Team.findOne({_id: teamid}, (err, team) => {
                if (err) {
                    res.status(200).json({success: false, error: "No such team exception."});
                    return;
                } else {
                    if (team.users.indexOf(uid) > -1) {
                        team.users.splice(team.users.indexOf(uid), 1);
                        team.save();
                    }
                    if (user.teams.indexOf(teamid) > -1) {
                        user.teams.splice(user.teams.indexOf(teamid), 1);
                        user.save();
                    }
                    res.status(200).json({success: 'true', login: user.login, team: team.name});
                }
            });
        }
    });
});


router.post('/delete', (req: express.Request, res: express.Response) => {
    if (req['loggedIn'] == false || req['role'] != "ADMIN") {
        res.status(401).json({success: false, error: "Unauthorized."});
        return;
    }
    var team_id = req.body.team_id;
    Team.findOne({_id:team_id}, (err, team)=>{
        if(err || team==null){
            res.status(200).json({success: false, error: "DB error."});
            return;
        }
        if(team.users.length>0){
            res.status(200).json({success: false, error: "Can't delete non-empty team."});
            return;
        }
        team.remove();
        res.status(200).json({success: true, error: null});
    });
});

export {router as teamRoutes};