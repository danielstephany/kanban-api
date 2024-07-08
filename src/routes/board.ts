import Express from 'express'
import {
    createBoard
} from '../controllers/board'
import isAuth from '../middleware/isAuth'

const router = Express.Router()

router.post("/", isAuth, createBoard)

export default router