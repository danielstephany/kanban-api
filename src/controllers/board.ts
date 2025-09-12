import User from "../models/user"
import Board from "../models/board"
import Task from "../models/task"
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

type paginationType = { 
    page: string, 
    limit: string,
    sortBy: string,
    direction: "asc" | "desc"
    searchBy?: string,
    searchValue?: string
}

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    const columnMap: tColumnMap = {}
    const columnOrder: String[] = []
    try {
        const { title, columns, usersWithAccess=[]}: iBoardData = req.body

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
                tasks: {},
                usersWithAccess: [res.locals.userId, ...usersWithAccess],
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
        const userId = res.locals.userId
        const {id} = req.params
        const board = await Board.findOne({ _id: id, usersWithAccess: [userId] })
            .populate('tasks.$*', "title")

        res.status(200).json(board)
    } catch (e) {
        const err = e as iError
        err.statusCode = 404
        next(err)
    }
}

export const moveTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {boardId, sourceColumn, destColumn, taskId, taskStatus} = req.body;

        if (!boardId ||
            !Array.isArray(sourceColumn?.taskIds) || 
            !sourceColumn.columnId || 
            !Array.isArray(destColumn?.taskIds) || 
            !destColumn.columnId || 
            !taskId || 
            !taskStatus
        ){
            const error: iError = new Error("Pleas provide a valid request body.")
            error.statusCode = 500;
            throw error
        }

        const updatedBoard = await Board.findOneAndUpdate({ _id: boardId }, {
            $set: {
                [`columns.${sourceColumn.columnId}.taskIds`]: sourceColumn?.taskIds,
                [`columns.${destColumn.columnId}.taskIds`]: destColumn?.taskIds,
            }
        },{new: true}).populate('tasks.$*', "title")

        await Task.updateOne({ _id: taskId }, {
            status: taskStatus
        })

        res.status(200).json(updatedBoard)

    } catch(e) {
        const err = e as iError
        err.statusCode = 404
        next(err)
    }
}

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userId
    const { page = "0", limit = "10", sortBy = "updatedAt", direction = "asc", searchBy, searchValue, } = <paginationType>req.query
    
    try {
        const offset = parseInt(page, 10) * parseInt(limit, 10);
        const filter: { [key: string]: any } = { usersWithAccess: { $in: [userId] } }

        if(searchBy && searchValue){
            filter.title = { "$regex": searchValue, "$options": "i" }
        }

        const boardList = await Board
            .find(filter, "title updatedAt createdAt", { skip: 3, limit: 5 })
            .sort({ [sortBy]: direction })
            .limit(parseInt(limit, 10))
            .skip(offset);

        const total = await Board.countDocuments({ usersWithAccess: { $in: [userId] }})

        res.status(200).json({ 
            data: boardList, 
            pagination: {
                page: parseInt(page), 
                limit: parseInt(limit, 10), 
                total 
            }
        })
    } catch(e){
        const err = e as iError
        err.statusCode = 404
        next(err)
    }
}   

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id
        const userId = res.locals.userId
    
        const board = await Board.findById(id)
        
        if(String(board?.owner) === userId){
            await Task.deleteMany({boardId: id})
            await board?.deleteOne();
        } else {
            throw new Error("Board not found")
        }

        res.status(204).json(null)

    } catch(e){
        const err = e as iError
        if(!err.statusCode) err.statusCode = 404
        next(err)
    }
}

export const deleteColumn = async(req: Request, res: Response, next: NextFunction) => {
    const {boardId, columnId}: {boardId: string, columnId: any} = req.body
    let boardData;

    try {
        if(boardId && columnId) boardData = await Board.findById(boardId)

        if(boardData){
            const columnOrder = boardData.columnOrder.filter(column_id => column_id !== columnId)
            boardData.columnOrder = columnOrder
            boardData.columns.delete(columnId)
            boardData.save()

            Task.deleteMany({boardId: boardId, status: columnId})
        } else {
            throw new Error("board not found")
        }

        res.status(200).json(boardData)
    } catch(e){
        const err = e as iError
        if(!err.statusCode) err.statusCode = 404
        next(err)
    }
    
}


/**
 * update columns
 * 
 * update column order to new column order array
 * loop through columns, if name changed 
 *  - update new name
 *  - update columnID
 *  - update the status for each Task to match the updated column id
 *  - if column is removed tasks should be moved to new colunm specified by user.
 * 
 */