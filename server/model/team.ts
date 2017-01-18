import * as mongoose from 'mongoose';
import * as User from './user';

interface ITeam{
  name:string;
  users:string[];
}

interface ITeamModel extends ITeam, mongoose.Document{
  
};

var teamSchema = new mongoose.Schema({
  name: {type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

var team = mongoose.model<ITeamModel>("Team", teamSchema);

export { team as Team };