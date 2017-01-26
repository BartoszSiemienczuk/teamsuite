import * as express from 'express';
import * as db from 'mongoose';
import socketIo = require('socket.io');
import {AuthMiddleware} from './middleware/auth.middleware';
import {userRoutes} from './routes/users';
import {authRoutes} from './routes/auth';
import {teamRoutes} from './routes/teams';
import {ChatSocket} from './sockets/chat.socket';
import {Config} from './config';
import path = require('path');

export class Server {
    private app_: express.Express;
    private port_: number = Config.port;
    private host_: string = Config.host;
    private server_: any;
    private io_: any;
    private chatSocket: ChatSocket;

    db_url_: string = Config.db_url;

    constructor() {
        this.app_ = express();
    }

    public startServer() {
        db.connect(this.db_url_);

        this.startStatic();
        this.startMiddlewares();
        this.startRoutes();

        this.server_ = this.app_.listen(this.port_, this.host_, 511, () => {
            var host = this.server_.address().address;
            var port = this.server_.address().port;
            console.log('App listening at http://%s:%s', host, port);
            this.startSockets();
        });

    }

    private startRoutes() {
        this.app_.use('/api/v1/users', userRoutes);
        this.app_.use('/auth', authRoutes);
        this.app_.use('/api/v1/teams', teamRoutes);

        this.app_.get('/*', (req: express.Request, res: express.Response) => {
            res.status(404).json({success:false, error:"No such URL"});
        });

    }

    private startStatic() {
        this.app_.use('/libs', express.static(path.resolve(__dirname, '../../node_modules')));
        this.app_.use('/app', express.static(path.resolve(__dirname, '../app')));
        this.app_.use(express.static(path.resolve(__dirname, '../../public')));
    }

    private startMiddlewares() {
        this.app_.use(AuthMiddleware);
    }

    private startSockets() {
        if (this.server_) {
            this.io_ = socketIo(this.server_);
            this.chatSocket = new ChatSocket(this.io_);
        } else {
            console.error("You need to start express server before starting sockets.");
        }
    }

}
