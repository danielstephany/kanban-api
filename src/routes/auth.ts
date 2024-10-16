import express from "express"
import { 
    signup,
    login,
    varifyToken
} from "../controllers/auth"
import isAuth from '../middleware/isAuth'

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.get("/varify-token", isAuth, varifyToken)

export default router