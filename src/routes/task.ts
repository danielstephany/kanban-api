import Express from 'express'
import isAuth from '../middleware/isAuth'
import {
    createTask,
    getTasksForBoard,
    getTask,
    updateTask,
    deleteTaskAndRemoveFromBoard
} from "../controllers/task";

const router = Express.Router()

router.post("/", isAuth, createTask)

router.put("/update", updateTask)

router.delete("/delete-task-and-remove-from-board/:id", deleteTaskAndRemoveFromBoard)

router.get("/get/:id", isAuth, getTask)

router.get("/for-board/:boardId", getTasksForBoard)

export default router