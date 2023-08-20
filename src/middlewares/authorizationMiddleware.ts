import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.sendStatus(401)
    }
    if (auth !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
    }
    if (auth !== 'Bearer YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
    }
    return next()
}