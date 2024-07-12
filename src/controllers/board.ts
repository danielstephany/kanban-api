import User from "../models/user"
import Board from "../models/board"
import { Request, Response, NextFunction } from 'express'
import iError from '../types/error'

interface iBoardData  {
    title: string,
    columns: string[]
    usersWithAccess: string[]
}

type tColumnMap = {[key: string]: {
    title: string,
    columnId: string,
}}

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    const columnMap: tColumnMap = {}
    const columnOrder: String[] = []
    try {
        const { title, columns, usersWithAccess}: iBoardData = req.body

        if(title && Array.isArray(columns)){
            columns.forEach(columnTitle => {
                const titleKey = columnTitle.toLowerCase().split(" ").join("-")
                columnMap[titleKey] = {
                    title: columnTitle,
                    columnId: titleKey
                }
                columnOrder.push(titleKey)
            })

            const board = await Board.create({
                owner: res.locals.userId,
                title,
                columns: columnMap,
                columnOrder,
                usersWithAccess,
            })
            res.status(200).json(board)
        } else {
            const error: iError = new Error("title, columns, and usersWithAccess are required")
            error.statusCode = 402
            throw error
        }


    } catch (e) {
        const err = e as iError
        if (!err.statusCode) err.statusCode = 500;
        next(e)
    }
}



export const ownedByUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({owner: res.locals.userId})

        res.status(200).json(boards)
    } catch (e){
        const err = e as iError
        err.statusCode = 500
        next(err) 
    }
}

export const forUsersWithAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({ usersWithAccess: res.locals.userId })

        res.status(200).json(boards)
    } catch (e) {
        const err = e as iError
        err.statusCode = 500
        next(err)
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const board = await Board.findById(id)

        res.status(200).json(board)
    } catch (e) {
        const err = e as iError
        err.statusCode = 500
        next(err)
    }
}