import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'
import type iError from '../types/error'

interface iJwt { userId: string };

export default (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization")

    if(!authHeader){
        const error: iError = new Error("Not Authorized")
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1]

    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as iJwt

        if(!decodedToken){
            const error: iError = new Error("Not Authorized")
            error.statusCode = 401;
            throw error;
        }
    
        res.locals.userId = decodedToken.userId
    } catch(e){
        const err = e as iError
        err.statusCode = 500
    }


    next()
}