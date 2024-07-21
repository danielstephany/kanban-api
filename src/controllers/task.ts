import Task from "../models/task"
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
        const {id} = req.params
        const { title, description, status } = req.body
        const task = await Task.updateOne({ _id: id }, {
            title,
            description,
            status,
            upadatedBy: res.locals.userId
        })

        res.status(204).json(null)

    } catch(e){
        next(e)
    }
}