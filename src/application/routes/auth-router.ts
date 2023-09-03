import {Request, Response, Router} from "express";
import {authValidation} from "../../middlewares/auth-validation";
import {RequestWithBody} from "../../dto/types";
import {authInputModel} from "../../dto/auth-types";
import {userService} from "../../services/user-service";
import {jwtService} from "../jwt-service";
import {authBearerMiddleware} from "../../middlewares/authorization-bearer-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    authValidation,
    async (req: RequestWithBody<authInputModel>, res: Response) => {
        const user = await userService.checkCredentials(req.body)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.sendStatus(201).send(token)
        } else { res.sendStatus(401) }
    })

authRouter.get('/me',
    authBearerMiddleware,
    async (req: Request, res: Response) => {
         const userInfo = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!._id
        }

        res.send(userInfo)
    })