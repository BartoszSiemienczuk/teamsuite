import * as mongoose from 'mongoose';

interface IChatRoom{
  name:string;
}

interface IChatRoomModel extends IChatRoom, mongoose.Document{
  
};

var chatRoomSchema = new mongoose.Schema({
  name: {type: String, required: true },
});

var ChatRoom = mongoose.model<IChatRoomModel>("ChatRoom", chatRoomSchema);

export { ChatRoom };