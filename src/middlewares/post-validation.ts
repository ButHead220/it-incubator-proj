import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {db} from "../database";

export const postsValidation = [
    body('title').isString().trim().isLength({min: 1, max: 30}).withMessage('incorrect title'),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}).withMessage('incorrect shortDescription'),
    body('content').isString().trim().isLength({min: 1, max: 1000}).withMessage('incorrect content'),
    body('blogId').isString().trim().notEmpty().withMessage('incorrect blogId').custom((id, parse) => {
            const foundBlogId =  db.blogs.find(b => b.id === id)
            if (!foundBlogId) {
                throw new Error('blogId not found')
            } else {
                parse.req.body.blogName = foundBlogId.name
                return true
            }
        }
    ),
    inputValidationMiddleware
]