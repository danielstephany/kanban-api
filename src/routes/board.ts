import Express from 'express'
import {
    createBoard,
    ownedByUser,
    forUsersWithAccess,
    getBoardsNavList,
    addUsers,
    getById,
    moveTask,
    getBoards
} from '../controllers/board'
import isAuth from '../middleware/isAuth'

const router = Express.Router()

router.post("/", isAuth, createBoard)
router.get("/", isAuth, getBoards)
router.post("/move-task", isAuth, moveTask)
router.get("/get/:id", isAuth, getById)
router.get("/owned-by-user", isAuth, ownedByUser)
router.get("/for-users-with-access", isAuth, forUsersWithAccess)
router.get("/nav-list", isAuth, getBoardsNavList)
router.get("/add-user/:id", isAuth, addUsers)
router.get("/owned-by-user", isAuth, ownedByUser)

export default router