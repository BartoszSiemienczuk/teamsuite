import {User, ChatMessage} from '../model';
export class ChatSocket {
    connectedUsers: any[][] = [];
    allConnectedUsers: any[] = [];
    chatConnection: any;
    uploader: any;

    constructor(private socketIO: any) {
        this.socketIO.of('/sockets/chat').on('connection', (con: any) => {
            this.chatConnection = con;

            this.listen();
        });
        console.log("Chat socket listening at /sockets/chat/");
    }

    private listen(): void {
        this.chatConnection.on("message", (data: any) => {
            let msg = new ChatMessage({text: data.text, user: data.user, room: data.room});
            msg.save();
            msg.populate({path: 'user', select: 'login name'}, (err, data: any) => {
                //broadcast message with populated user data
                this.chatConnection.broadcast.to(data.room).emit("message", data);
                this.chatConnection.emit("message", data);
            });
        });

        this.chatConnection.on("login", (user: any) => {
            this.chatConnection.join(user.room);
            this.allConnectedUsers[user._id] = user;
            if(this.connectedUsers[user.room]==undefined){
                this.connectedUsers[user.room] = new Array();
            }
            this.connectedUsers[user.room][user._id] = user;
            this.chatConnection.in(user.room).emit("userlist", this.getSimpleUserList(user.room));
            this.chatConnection.emit("userlist", this.getSimpleUserList(user.room));
            this.sendServerMessage("User " + user.name + " joined this room.", user.room);

        });

        this.chatConnection.on("logout", (user: any) => {
            var room = this.allConnectedUsers[user._id].room;
            delete this.allConnectedUsers[user._id];
            delete this.connectedUsers[room][user._id];
            this.sendServerMessage("User " + user.name + " has disconnected.", room);
            this.chatConnection.broadcast.to(room).emit("userlist", this.getSimpleUserList(room));
            this.chatConnection.leave(room);
        });

        this.chatConnection.on("disconnect", () => { });
    }

    private sendServerMessage(text: string, room: string): void {
        if (this.chatConnection) {
            let message = {
                text: text,
                room: room,
                user: {_id: 0, login: 'server', name: 'Server'},
                created: new Date()
            };
            this.chatConnection.broadcast.to(room).emit("message", message);
            this.chatConnection.emit("message", message);
        }
    }

    private getRoomCount(room: string) {
        if (this.socketIO.nsps['/sockets/chat'].adapter.rooms[room])
            return this.socketIO.nsps['/sockets/chat'].adapter.rooms[room].length;
        else return 0;
    }

    private sendData() {
        var data = this.socketIO.nsps['/sockets/chat'].adapter.sids[this.chatConnection.id];

        this.chatConnection.emit("debug", data);

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