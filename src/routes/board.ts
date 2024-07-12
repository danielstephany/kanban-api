import Express from 'express'
import {
    createBoard,
    ownedByUser,
    getById
} from '../controllers/board'
import isAuth from '../middleware/isAuth'

const router = Express.Router()

router.post("/", isAuth, createBoard)
router.get("/owned-by-user", isAuth, ownedByUser)
router.get("/:id", isAuth, getById)

export default router