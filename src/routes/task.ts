import Express from 'express'
import isAuth from '../middleware/isAuth'
import {
    createTask,
    getTasksForBoard,
    getTask
} from "../controllers/task";

const router = Express.Router()

router.post("/", isAuth, createTask)

router.get("/get/:id", isAuth, getTask)

router.get("/for-board/:boardId", getTasksForBoard)

export default router