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
    taskIds: string[]
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
                    columnId: titleKey,
                    taskIds: []
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
        err.statusCode = 404
        next(err) 
    }
}

export const forUsersWithAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({ usersWithAccess: res.locals.userId })

        res.status(200).json(boards)
    } catch (e) {
        const err = e as iError
        err.statusCode = 404;
        next(err)
    }
}

export const getBoardsNavList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await Board.find({ usersWithAccess: res.locals.userId }, "title _id")

        res.status(200).json(boards)
    } catch (e) {
        const err = e as iError
        err.statusCode = 404;
        next(err)
    }
}

//TODO: hash out add users work flow
export const addUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const {users} = req.body

        const board: iBoardData | null = await Board.findById(id)
        const storedUsers = await User.find({_id: users}, "_id")
        
        if (board?.usersWithAccess && storedUsers.length === users.length){
            const updatedBoard = await Board.updateOne({_id: id}, {
                usersWithAccess: [...board?.usersWithAccess, ...users]
            }) 
            res.status(200).json(updatedBoard)
        } else {
            const error: iError = new Error("Expected valid array of users")
            error.statusCode = 500;
            throw error
        }

    } catch (e) {
        const err = e as iError
        if(!err.statusCode) err.statusCode = 404;
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
        err.statusCode = 404
        next(err)
    }
}