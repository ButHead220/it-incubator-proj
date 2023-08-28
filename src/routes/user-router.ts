import {Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {userValidation} from "../middlewares/user-validation";
import {RequestWithBody, userInputModel} from "../dto/types";
import {userService} from "../services/user-service";

export const usersRouter = Router({})

usersRouter.post('/',
    authorizationMiddleware,
    userValidation,
    async (req: RequestWithBody<userInputModel>, res: Response) => {
        const {login, password, email} = req.body

        const idCreatedUser = await userService.createUser(login, password, email)

    })