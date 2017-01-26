import * as mongoose from 'mongoose';

interface ITaskCategory{
    name:string;
    parent:string;
    team:string;
    tasks: any[];
}

interface ITaskCategoryModel extends ITaskCategory, mongoose.Document{};


var taskCatSchema = new mongoose.Schema({
    name: {type: String, required: true},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'TaskCategory'},
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'},]
});

var taskCat = mongoose.model<ITaskCategoryModel>("TaskCategory", taskCatSchema);
export { taskCat as TaskCategory };