
import Task from "../models/task"
import Board from "../models/board"
import { Request, Response, NextFunction } from 'express'
import iError from '../types/error'

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {title, description, status, boardId} = req.body
        
        if (title && status && boardId){
            const board = await Board.findById(boardId)
            const selectedColumn = board ? board.columns.get(status) : null
                
            if (selectedColumn && board){
                const task = await Task.create({
                    title,
                    description: description || "",
                    status: selectedColumn?.title,
                    boardId,
                    createdBy: res.locals.userId,
                    upadatedBy: res.locals.userId
                })

                selectedColumn.taskIds.push(task._id)
                board.tasks.set(String(task._id), task._id )
                await board.save()
                res.status(201).json(task)

            } else {
                throw new Error("Issue setting task status")
            }

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
        const { _id, title, description, status } = req.body

        if (_id && title && status) {
            const task = await Task.findOneAndUpdate({ _id: _id }, {
                title,
                description: description || "",
                status,
                upadatedBy: res.locals.userId
            })

            if(task && task.status !== status){
                const board = await Board.findById(task.boardId)
                if(board){
                    const movedFromColumn = board.columns.get(task.status)
                    const filteredArray = movedFromColumn?.taskIds.filter(taskId => String(taskId) !== _id)
                    
                    if (movedFromColumn && filteredArray){
                        movedFromColumn.taskIds = filteredArray;
                    }

                    const destinationColumn = board.columns.get(status)
                    destinationColumn?.taskIds.push(task._id)
                    board.save()
                }
            }

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