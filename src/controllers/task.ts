
import Task from "../models/task"
import Board from "../models/board"
import { Request, Response, NextFunction } from 'express'
import iError from '../types/error'

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {title, description, status, boardId} = req.body
        
        if (title && status){
            const task = await Task.create({ 
                title, 
                description, 
                status, 
                boardId,
                createdBy: res.locals.userId,
                upadatedBy: res.locals.userId
            })

            //TODO: add logic to add the task to the board and set its column to the first column
            const board = await Board.findById(boardId)
            if(board?.columns){
                const firstColumnName = board.columnOrder[0]
                const firstColumn = board.columns.get(firstColumnName)
                if (firstColumn){
                    firstColumn.taskIds.push(task._id)
                    board.tasks.set(String(task._id), task._id )
                    await board.save()
                } 
            }

            res.status(201).json(task)
        } else {
            const err: iError = new Error("title, status and boardId are required.")
            err.statusCode = 422
            throw err
        }
    } catch (e) {
        next(e)
    }
}

export const getTasksForBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {boardId} = req.params        
        const tasks = await Task.find({boardId})

        res.status(200).json(tasks)

    } catch(e){
        next(e)
    }
}

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const task = await Task.findById(id)

        res.status(200).json(task)

    } catch(e){
        next(e)
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {        
        const { id } = req.params
        const { title, description, status } = req.body

        if (title && status && description) {
            const task = await Task.updateOne({ _id: id }, {
                title,
                description,
                status,
                upadatedBy: res.locals.userId
            })

            res.status(204).json(null)
        } else {
            const err: iError = new Error("title, status and description are required.")
            err.statusCode = 422
            throw err
        }

    } catch(e){
        next(e)
    }
}