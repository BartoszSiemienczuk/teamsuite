import * as mongoose from 'mongoose';
import * as Team from './team';
var bcrypt = require('bcrypt-nodejs');

interface IUser{
  login:string;
  name:string;
  email:string;
  password:string;
  role:string;  
  teams:string[];
}

interface IUserModel extends IUser, mongoose.Document{
  comparePassword(inputPassword:string, callback:any);
};

var userSchema = new mongoose.Schema({
  login: {type: String, required: true, index: {unique:true} },
  password: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  role: {type: String, enum:['ADMIN','LEADER','USER'],default:'USER',required: false},
  teams: [{type:mongoose.Schema.Types.ObjectId, ref:'Team'}]
});

userSchema.pre('save', function(next) {
  let user = this;
  if(!user.isModified('password')){
    return next();
  }
  
  user.password = bcrypt.hashSync(user.password);
  return next();
});

userSchema.methods.comparePassword = function(inputPassword, callback) {
  bcrypt.compare(inputPassword, this.password, (err, result)=>{
    if(err){
      return callback(err);
    }
    callback(null, result);
  });
}
var user = mongoose.model<IUserModel>("User", userSchema);
export { user as User };