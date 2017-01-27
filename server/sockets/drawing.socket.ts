import {User} from '../model';
export class DrawingSocket {
    connectedUsers = [];
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
            console.log("[DRAWING] Room "+data.room);
            this.drawingConnection.to(data.room).emit("draw", data);
        });


        this.drawingConnection.on("clear", (data: any) => {
            console.log("[DRAWING] CLEAR for room "+data.room);
            this.drawingConnection.to(data.room).emit("clear", data);
        });

        this.drawingConnection.on("login", (user: any) => {
            this.drawingConnection.join(user.room);
            this.connectedUsers[user._id] = user;
            this.drawingConnection.to(user.room).emit("userlist", this.getSimpleUserList());
            this.drawingConnection.emit("userlist", this.getSimpleUserList());
            console.log("User " + user.name + " joined room " + user.room);
            console.log(JSON.stringify(this.socketIO.rooms));

        });

        this.drawingConnection.on("logout", (user: any) => {
            var room = this.connectedUsers[user._id].room;
            this.drawingConnection.to(room).emit("userlist", this.getSimpleUserList());
            this.drawingConnection.leave(room);
            console.log("User " + user.name + " disconnecting from room " + room + ".");
        });

        this.drawingConnection.on("disconnect", () => {
            //leave room and such
        });
    }

    private getSimpleUserList() {
        let list = this.connectedUsers.map((user) => user.login);
        return list;
    }
}