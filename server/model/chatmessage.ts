import * as mongoose from 'mongoose';
import * as User from './user';

interface IChatMessage{
  created:string;
  text:string;
  //file
  image:string;
  room:string;
  user:any;
}

interface IChatMessageModel extends IChatMessage, mongoose.Document{
  
};

var fileSchema = new mongoose.Schema({
  name: {type: String, default: "File"},
  url: {type: String}
});

var messageSchema = new mongoose.Schema({
  created: {type: Date, required: true, default: Date.now },
  room: {type: String, required: true },
  text: {type: String },
  image: {type: String },
  file: {type: fileSchema, required: false},
  user: {type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

var ChatMessage = mongoose.model<IChatMessageModel>("ChatMessage", messageSchema);

export { ChatMessage };