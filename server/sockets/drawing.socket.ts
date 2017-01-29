import {User} from '../model';
export class DrawingSocket {
    connectedUsers: any[][] = [];
    allConnectedUsers: any[] = [];
    drawingConnection: any;

    constructor(private socketIO: any) {
        this.socketIO.of('/sockets/drawing').on('connection', (con: any) => {
            this.drawingConnection = con;
            this.listen();
        });
        console.log("Drawing socket listening at /sockets/drawing/");
    }

    private listen(): void {
        this.drawingConnection.on("drawing", (data: any) => {
            this.drawingConnection.to(data.room).emit("draw", data);
        });


        this.drawingConnection.on("clear", (data: any) => {
            this.drawingConnection.to(data.room).emit("clear", data);
        });

        this.drawingConnection.on("login", (user: any) => {
            this.drawingConnection.join(user.room);
            this.allConnectedUsers[user._id] = user;
            if(this.connectedUsers[user.room]==undefined){
                this.connectedUsers[user.room] = new Array();
            }
            this.connectedUsers[user.room][user._id] = user;
            this.drawingConnection.to(user.room).emit("userlist", this.getSimpleUserList(user.room));
            this.drawingConnection.emit("userlist", this.getSimpleUserList(user.room));

        });

        this.drawingConnection.on("logout", (user: any) => {
            var room = this.allConnectedUsers[user._id].room;
            delete this.allConnectedUsers[user._id];
            delete this.connectedUsers[room][user._id];
            this.drawingConnection.broadcast.to(room).emit("userlist", this.getSimpleUserList(room));
            this.drawingConnection.leave(room);
        });

        this.drawingConnection.on("disconnect", () => {
            //leave room and such
        });
    }

    private getSimpleUserList(room: string) {
        let list = [];
        for(let key in this.connectedUsers[room]){
            list.push(this.connectedUsers[room][key].name);
        }
        console.log("Userlist send = ", list);
        return list;
    }
}