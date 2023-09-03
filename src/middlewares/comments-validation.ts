import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const commentsValidation = [
    body('content').isString().trim().isLength({min: 20, max: 300}).withMessage('incorrect content'),
    inputValidationMiddleware
]