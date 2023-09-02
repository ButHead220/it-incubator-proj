import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {userValidation} from "../middlewares/user-validation";
import {
    RequestWithBody,
    RequestWithQuery
} from "../dto/types";
import {userInputModel, userSortingQueryModel} from "../dto/user-types";
import {userService} from "../services/user-service";
import {usersQueryRepository} from "../repositories/mongoDb/usersRepository/user-db-query-repository";

export const usersRouter = Router({})

usersRouter.get('/' ,
    authorizationMiddleware,
    async (req: RequestWithQuery<userSortingQueryModel>, res: Response) => {
        const foundUsers = await usersQueryRepository
            .findAllUsers(req.query)

        res.send(foundUsers)
    })
usersRouter.post('/',
    authorizationMiddleware,
    userValidation,
    async (req: RequestWithBody<userInputModel>, res: Response) => {
        const {login, password, email} = req.body

        const createdUser = await userService.createUser(login, password, email)

        res.status(201).send(createdUser)
    })

usersRouter.delete('/:userId',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const isDeletedUser = await userService.deleteUser(req.params.userId)
        if (isDeletedUser) {
            res.sendStatus(204)
        } else { res.sendStatus(404) }
    })
