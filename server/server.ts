// import express = require('express');
// import path = require('path');
// import { UserRouter } from './routes/users';

// var port: number = process.env.PORT || 3000;
// var app = express();

// app.use('/libs', express.static(path.resolve(__dirname, '../node_modules')));
// app.use('/app', express.static(path.resolve(__dirname, '../dist/app')));
// app.use(express.static(path.resolve(__dirname, '../public')));

// var renderIndex = (req: express.Request, res: express.Response) => {
//     res.sendFile(path.resolve(__dirname, '../public/index.html'));
// }

// app.get('/', renderIndex);
// app.use('/users', UserRouter.router);

// var server = app.listen(port, '0.0.0.0', 511 , function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('App listening at http://%s:%s', host, port);
// });

import * as express from 'express';
import * as db from 'mongoose';
import { userRoutes } from './routes/users';
import { authRoutes } from './routes/auth';
import path = require('path');

export class Server {
  private app_ : express.Express;
  port_ : number = 3000;
  host_ : string = '0.0.0.0';

  db_url_ : string ='mongodb://localhost/teamsuite';

  constructor(){
    this.app_ = express();
  }

  public startServer(){
    db.connect(this.db_url_);
    
    this.startStatic();
    this.startRoutes();
    
    let server = this.app_.listen(this.port_, this.host_, 511, ()=>{
      var host = server.address().address;
      var port = server.address().port;
      console.log('App listening at http://%s:%s', host, port);
    });
  }

  private startRoutes(){
    this.app_.get('/', (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, '../../public/index.html'));
    });
    
    this.app_.use('/api/v1/users', userRoutes);
    this.app_.use('/auth', authRoutes);
  }

  private startStatic(){
    console.log("Dir : %s", path.resolve(__dirname, '../app'));
    this.app_.use('/libs', express.static(path.resolve(__dirname, '../../node_modules')));
    this.app_.use('/app', express.static(path.resolve(__dirname, '../app')));
    this.app_.use(express.static(path.resolve(__dirname, '../../public')));
  }
  
}