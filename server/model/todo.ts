import * as mongoose from 'mongoose';

interface ITodoTask{
    text: string;
    done: boolean;
}

interface ITodo{
    name: string;
    team: string;
    tasks: ITodoTask[];
}

interface ITodoModel extends ITodo, mongoose.Document{};

var taskTodoSchema = new mongoose.Schema({
    text: {type: String, required:true},
    done: {type: Boolean, required: true, default:false}
});

var todoSchema = new mongoose.Schema({
    name: {type: String},
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    tasks: [{type: taskTodoSchema}]
});

var todo = mongoose.model<ITodoModel>("Todo", todoSchema);
export { todo as Todo };