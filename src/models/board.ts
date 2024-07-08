import mongoose from 'mongoose'
import User from './user'

const columnSchema = new mongoose.Schema({
    title: String,
    columnId: {
        type: String,
        unique: true,
    }
});

const boardSchema = new mongoose.Schema({
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
});

const board = mongoose.model('Board', boardSchema);

export default board
