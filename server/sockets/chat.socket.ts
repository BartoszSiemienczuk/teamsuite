

export class ChatSocket{
  chatConnection: any;
  
  constructor(private socketIO: any){
    this.socketIO.of('/sockets/chat').on('connection', (con: any) => {
      console.log("Chat socket client connected.");
      this.chatConnection = con;
      
      this.listen();
    });
      
    console.log("Chat socket listening at /sockets/chat/");
  }  

  private listen(): void {
    this.chatConnection.on("message", (data: any) => {
      this.chatConnection.emit("message", data);
      this.chatConnection.broadcast.emit("message", data);
    });
  }
}