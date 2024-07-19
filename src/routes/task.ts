import Express from 'express'
import isAuth from '../middleware/isAuth'
import {
    createTask,
    getTasksForBoard
} from "../controllers/task";

const router = Express.Router()

router.post("/", isAuth, createTask)

router.get("/:boardId", getTasksForBoard)

export default router