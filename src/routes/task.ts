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

router.put("/:id", updateTask)

router.get("/for-board/:boardId", getTasksForBoard)

router.get("/:id", isAuth, getTask)

router.delete("/:id/delete-task-and-remove-from-board", deleteTaskAndRemoveFromBoard)

export default router