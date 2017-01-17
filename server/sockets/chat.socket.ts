import { User, ChatMessage } from '../model';

export class ChatSocket{
  connectedUsers = [];
  chatConnection: any;
  
  constructor(private socketIO: any){
    this.socketIO.of('/sockets/chat').on('connection', (con: any) => {
      this.chatConnection = con;
      console.log("Something connecting");
      this.listen();
    });
      
    console.log("Chat socket listening at /sockets/chat/");
  }  

  private listen(): void {
    this.chatConnection.on("message", (data: any) => {
      console.log("Message!");
      let msg = new ChatMessage({text:data.text, user:data.user, room:data.room});
      msg.save();
      msg.populate({path:'user', select:'login name'},(err,data:any)=>{ 
        //broadcast message with populated user data
        console.log("Message from "+data.user.name+" to room " + data.room);
        this.chatConnection.broadcast.to(data.room).emit("message", data);
        this.chatConnection.emit("message", data);
      });
      this.sendData();
    });
    
    this.chatConnection.on("login", (user: any) => {
      console.log("User "+user.name+" joined room "+user.room);
      this.chatConnection.join(user.room);
      console.log("Current room "+user.room+" connections : "+this.getRoomCount(user.room));
      this.connectedUsers[user._id]=user;
      this.chatConnection.in(user.room).emit("userlist", this.getSimpleUserList());
      this.chatConnection.emit("userlist", this.getSimpleUserList());
      this.sendData();
      this.sendServerMessage("User "+user.name+" joined this room.", user.room);
    });
    
    this.chatConnection.on("logout", (user: any) =>{
//       this.connectedUsers.forEach((elem, index, arr) => {
//         if(elem._id == user._id){
//           arr.splice(index,1);
//           return;
//         }
//       });
      var room = this.connectedUsers[user._id].room;
      console.log("User "+user.name+" disconnecting from room "+room+".");
      this.sendServerMessage("User "+user.name+" has disconnected.", room);
      this.chatConnection.broadcast.to(room).emit("userlist", this.getSimpleUserList());
      this.chatConnection.leave(room);
      console.log("Current room "+room+" connections : "+this.getRoomCount(room));
    });
    
    this.chatConnection.on("disconnect", () => {
      //leave room and such
    });
  }

  private sendServerMessage(text: string, room: string) :void {
    if(this.chatConnection){
      console.log("Message from SERVER to room " + room);
      let message = {text: text, room:room, user:{_id:0, login:'server', name:'Serwer'},created:new Date()};
      this.chatConnection.broadcast.to(room).emit("message", message);
      this.chatConnection.emit("message", message);
    }
  }

  private getRoomCount(room: string){
    if(this.socketIO.nsps['/sockets/chat'].adapter.rooms[room])
      return this.socketIO.nsps['/sockets/chat'].adapter.rooms[room].length;
    else return 0;
  }

  private sendData(){
    var data = this.socketIO.nsps['/sockets/chat'].adapter.sids[this.chatConnection.id];
    
    this.chatConnection.emit("debug", data);
      
  }

  private getSimpleUserList(){
    let list = this.connectedUsers.map((user)=> user.login );
    return list;
  } 
}