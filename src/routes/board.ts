import Express from 'express'
import {
    createBoard,
    ownedByUser,
    forUsersWithAccess,
    getById
} from '../controllers/board'
import isAuth from '../middleware/isAuth'

const router = Express.Router()

router.post("/", isAuth, createBoard)
router.get("/owned-by-user", isAuth, ownedByUser)
router.get("/for-users-with-access", isAuth, forUsersWithAccess)
router.get("/owned-by-user", isAuth, ownedByUser)
router.get("/:id", isAuth, getById)

export default router