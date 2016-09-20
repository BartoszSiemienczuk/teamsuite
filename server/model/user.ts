import * as mongoose from 'mongoose';

interface IUser{
  login:string;
  password:string;
  role:string;  
}

interface IUserModel extends IUser, mongoose.Document{};

var userSchema = new mongoose.Schema({
  login: String,
  password: String,
  role: String
});

var User = mongoose.model<IUserModel>("User", userSchema);

export = User;