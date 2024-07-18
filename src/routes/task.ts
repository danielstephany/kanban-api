import Express from 'express'
import isAuth from '../middleware/isAuth'
import {
    createTask
} from "../controllers/task";

const router = Express.Router()

router.post("/", isAuth, createTask)

export default router