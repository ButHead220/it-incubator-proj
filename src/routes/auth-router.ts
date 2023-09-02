import {Response, Router} from "express";
import {authValidation} from "../middlewares/auth-validation";
import {RequestWithBody} from "../dto/types";
import {authInputModel} from "../dto/auth-types";
import {authService} from "../services/auth-service";

export const authRouter = Router({})

authRouter.post('/login',
    authValidation,
    async (req: RequestWithBody<authInputModel>, res: Response) => {
        const result = await authService.authUser(req.body)
        if (result) {
            res.sendStatus(204)
        } else { res.sendStatus(401) }
    })