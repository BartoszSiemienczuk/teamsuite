import {User, ChatMessage} from '../model';
export class ChatSocket {
    connectedUsers: any[][] = [];
    allConnectedUsers: any[] = [];

    constructor(private socketIO: any) {
        this.socketIO.of('/sockets/chat').on('connection', (con: any) => {

            this.listen(con);
        });
        console.log("Chat socket listening at /sockets/chat/");
    }

    private listen(socket): void {
        socket.on("message", (data: any) => {
            let msg = new ChatMessage({text: data.text, user: data.user, room: data.room});
            msg.save();
            msg.populate({path: 'user', select: 'login name'}, (err, data: any) => {
                //broadcast message with populated user data
                socket.broadcast.to(data.room).emit("message", data);
                socket.emit("message", data);
            });
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
            socket.in(user.room).emit("userlist", this.getSimpleUserList(user.room));
            socket.emit("userlist", this.getSimpleUserList(user.room));
            this.sendServerMessage("User " + user.name + " joined this room.", user.room, socket);

        });

        socket.on("logout", (user: any) => {
            var room = this.allConnectedUsers[user._id].room;
            delete this.allConnectedUsers[user._id];
            delete this.connectedUsers[room][user._id];
            this.sendServerMessage("User " + user.name + " has disconnected.", room, socket);
            socket.broadcast.to(room).emit("userlist", this.getSimpleUserList(room));
            socket.leave(room);
        });

        socket.on("disconnect", () => { });
    }

    private sendServerMessage(text: string, room: string, socket:any): void {
        if (socket) {
            let message = {
                text: text,
                room: room,
                user: {_id: 0, login: 'server', name: 'Server'},
                created: new Date()
            };
            socket.broadcast.to(room).emit("message", message);
            socket.emit("message", message);
        }
    }

    private getSimpleUserList(room: string) {
        let list = [];
        for(let key in this.connectedUsers[room]){
            list.push(this.connectedUsers[room][key].name);
        }
        return list;
    }
}