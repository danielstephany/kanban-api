import Express from 'express'
import {
    createBoard,
    ownedByUser,
    forUsersWithAccess,
    getBoardsNavList,
    addUsers,
    getById,
    moveTask,
    getBoards,
    deleteBoard,
    deleteColumn,
    renameColumn
} from '../controllers/board'
import isAuth from '../middleware/isAuth'

const router = Express.Router()

router.post("/", isAuth, createBoard)
router.get("/", isAuth, getBoards)
router.delete('/:id', isAuth, deleteBoard)
router.patch("/delete-column", deleteColumn)
router.patch("/rename-column", renameColumn)
router.post("/move-task", isAuth, moveTask)
router.get("/owned-by-user", isAuth, ownedByUser)
router.get("/for-users-with-access", isAuth, forUsersWithAccess)
router.get("/nav-list", isAuth, getBoardsNavList)
router.get("/:id/add-user", isAuth, addUsers)
router.get("/:id", isAuth, getById)

export default router