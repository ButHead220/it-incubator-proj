import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const postsValidationByBlogId = [
    body('title').isString().trim().isLength({min: 1, max: 30}).withMessage('incorrect title'),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}).withMessage('incorrect shortDescription'),
    body('content').isString().trim().isLength({min: 1, max: 1000}).withMessage('incorrect content'),
    inputValidationMiddleware
]