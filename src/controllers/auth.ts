import User from "../models/user"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import iError from '../types/error'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, email, password, password2} = req.body

    try {
        if(password !== password2){
            const error: iError = new Error("passwords do not match")
            error.statusCode = 422
            throw error
        }

        if (firstName && lastName && email && password){

            const existingUser = await User.findOne({email})
            if(existingUser){
                const error: iError = new Error("User with submited email already exists")
                error.statusCode = 409
                throw error
            }

            const salt = bcrypt.genSaltSync(10)
            const passwordHash = bcrypt.hashSync(password, salt)
            await User.create({ firstName, lastName, email, password: passwordHash })
            const user = await User.findOne({ email })
            let token;

            if (user) token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string)

            res.status(200).json({ user, token})
        } else {
            const error: iError = new Error("All field are required")
            error.statusCode = 422
            throw error
        }

    } catch(e){
        const err = e as iError
        if (!err.statusCode) err.statusCode = 500;
        next(e)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body

    try {
        if(email && password){
            const userWithPass = await User.findOne({email}, "password").select("+password")
            if (!userWithPass || !bcrypt.compareSync(password, userWithPass.password)){
                const error: iError = new Error("Wrong password or email")
                error.statusCode = 422;
                throw error
            }
            const userWithoutPass = await User.findOne({email})
            let token
            if (userWithoutPass) token = jwt.sign({ userId: userWithoutPass._id }, process.env.JWT_SECRET as string)

            res.status(200).json({user: userWithoutPass, token})

        } else {
            const error: iError = new Error("email and password are required")
            error.statusCode = 422;
            throw error
        }

    } catch (e){
        const err = e as iError
        if (!err.statusCode) err.statusCode = 500
        next(e)
    }

}

export const varifyToken = async (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.userId){
        const user = await User.findById(res.locals.userId).select("+password")
        res.status(200).json({user})
    } else {
        const error: iError = new Error("Token invalid")
        error.statusCode = 401;
        next(error)
    }
}