import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const userValidation = [
    body('login').isString().trim().isLength({min: 3, max: 10}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('incorrect login'),
    body('password').isString().trim().isLength({min: 6, max: 20}).withMessage('incorrect password'),
    body('email').isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('incorrect email'),
    inputValidationMiddleware
]