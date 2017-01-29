import {User} from '../model';
export class DrawingSocket {
    connectedUsers: any[][] = [];
    allConnectedUsers: any[] = [];
    drawingConnection: any;

    constructor(private socketIO: any) {
        this.socketIO.of('/sockets/drawing').on('connection', (con: any) => {
            this.listen(con);
        });
        console.log("Drawing socket listening at /sockets/drawing/");
    }

    private listen(socket): void {
        socket.on("drawing", (data: any) => {
            socket.to(data.room).emit("draw", data);
        });


        socket.on("clear", (data: any) => {
            socket.to(data.room).emit("clear", data);
        });

        socket.on("login", (user: any) => {
            if(user==null){
                socket.disconnect();
                return;
            }
            socket.join(user.room);
            this.allConnectedUsers[user._id] = user;
            if(this.connectedUsers[user.room]==undefined){
                this.connectedUsers[user.room] = new Array();
            }
            this.connectedUsers[user.room][user._id] = user;
            socket.to(user.room).emit("userlist", this.getSimpleUserList(user.room));
            socket.emit("userlist", this.getSimpleUserList(user.room));

        });

        socket.on("logout", (user: any) => {
            var room = this.allConnectedUsers[user._id].room;
            delete this.allConnectedUsers[user._id];
            delete this.connectedUsers[room][user._id];
            socket.broadcast.to(room).emit("userlist", this.getSimpleUserList(room));
            socket.leave(room);
        });

        socket.on("disconnect", () => {
            //leave room and such
        });
    }

    private getSimpleUserList(room: string) {
        let list = [];
        for(let key in this.connectedUsers[room]){
            list.push(this.connectedUsers[room][key].name);
        }
        return list;
    }
}