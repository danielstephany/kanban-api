import Express from 'express'
import isAuth from '../middleware/isAuth'
import {
    createTask,
    getTasksForBoard,
    getTask,
    updateTask
} from "../controllers/task";

const router = Express.Router()

router.post("/", isAuth, createTask)

router.put("/update/:id", updateTask)

router.get("/get/:id", isAuth, getTask)

router.get("/for-board/:boardId", getTasksForBoard)

export default router