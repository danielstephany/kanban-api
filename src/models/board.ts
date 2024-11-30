import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
    title: String,
    columnId: {
        type: String,
        unique: true,
    },
    taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    columns: {
        type: Map,
        of: columnSchema
    },
    tasks: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        required: true
    },
    columnOrder: [String],
    usersWithAccess: [String],
}, { timestamps: true });


interface boardInterface {
    title: string,
    owner: mongoose.Types.ObjectId,
    columns: Map<string, {
        title: string,
        columnId: string,
        taskIds: mongoose.Types.ObjectId[],
    }>,
    tasks: Map<string, mongoose.Types.ObjectId>,
    columnOrder: string[],
    usersWithAccess: string[],
}

const board = mongoose.model<boardInterface>('Board', boardSchema);

export default board
