import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const authValidation = [
    body('loginOrEmail').isString().trim().isLength({min: 1}).withMessage('incorrect Login Or Email'),
    body('password').isString().trim().isLength({min: 1}).withMessage('incorrect password'),
    inputValidationMiddleware
]