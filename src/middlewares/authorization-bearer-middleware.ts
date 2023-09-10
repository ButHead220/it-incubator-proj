import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/mongoDb/usersRepository/user-db-query-repository";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        console.log(userId)
        console.log(typeof userId.toString())
        req.user = await usersQueryRepository.findUserByIdAndReturnUserDbModel(userId)
        next()
    } else { res.sendStatus(401) }
}