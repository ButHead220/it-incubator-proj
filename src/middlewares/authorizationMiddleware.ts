import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request<any ,any ,any ,any>, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (auth === 'Basic YWRtaW46cXdlcnR5') {
        return next()
    } else {
    res.sendStatus(401)
    }
}