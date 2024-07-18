import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    boardId: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    upadatedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

const task = mongoose.model('Task', taskSchema);

export default task
