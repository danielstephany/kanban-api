import User from "../models/user"
import Board from "../models/board"
import { Request, Response, NextFunction } from 'express'
import iError from '../types/error'


export const createBoard = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const board = await Board.create({
            owner: res.locals.userId,
            title: "Test Board",
            columns: {
                "ready": {
                    columnId: "ready",
                    title: "Ready"
                },
                "in-progress": {
                    columnId: "column2",
                    title: "In Progress"
                },
                "done": {
                    columnId: "done",
                    title: "Done"
                },
            },
            columnOrder: ["Ready", "In Progress", "Done"],
            usersWithAccess: []
        })
        res.status(200).json(board)

    } catch (e) {
        const err = e as iError
        if (!err.statusCode) err.statusCode = 500;
        next(e)
    }
}