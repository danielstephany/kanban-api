import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
    title: String,
    columnId: {
        type: String,
        unique: true,
    },
    taskIds: [String]
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
    columnOrder: [String],
    usersWithAccess: [String],
}, { timestamps: true });

const board = mongoose.model('Board', boardSchema);

export default board
