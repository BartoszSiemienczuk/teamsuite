import * as mongoose from 'mongoose';

interface ITask{
    name: string;
    due: Date;
    description: string;
    type: string;
    status: string;
    estimated_time: number;
    spent_time: number;
}

interface ITaskModel extends ITask, mongoose.Document{};


var taskSchema = new mongoose.Schema({
    name: {type: String, required:true},
    due: {type: Date},
    description: {type: String},
    type: {type: String, enum:['BUG','TASK']},
    status: {type: String},
    estimated_time: {type: Number},
    spent_time: {type: Number},
    assignee: {type:mongoose.Schema.Types.ObjectId, ref:'User', required: false},
    category: {type:mongoose.Schema.Types.ObjectId, ref:'TaskCategory'}
});

var task = mongoose.model<ITaskModel>("Task", taskSchema);
export { task as Task };