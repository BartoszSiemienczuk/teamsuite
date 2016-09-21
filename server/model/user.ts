import * as mongoose from 'mongoose';
var bcrypt = require('bcrypt-nodejs');

interface IUser{
  login:string;
  password:string;
  role:string;  
}

interface IUserModel extends IUser, mongoose.Document{
  comparePassword(inputPassword:string, callback:any);
};

var userSchema = new mongoose.Schema({
  login: {type: String, required: true, index: {unique:true} },
  password: {type: String, required: true},
  role: {type: String, required: false}
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

var User = mongoose.model<IUserModel>("User", userSchema);

export = User;