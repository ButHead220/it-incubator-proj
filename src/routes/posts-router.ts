import {Router, Request, Response} from "express";
import {postsRepository} from "../repositories/mongoDb/posts-db-repository";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {postsValidation} from "../middlewares/post-validation";
import {RequestWithQuery, sortingQueryModel} from "../dto/types";

export const postsRouter = Router({})

postsRouter.get ('/',
    async (req: RequestWithQuery<sortingQueryModel>, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = req.query

    const posts = await postsRepository.foundAllPosts(sortBy, sortDirection, pageNumber, pageSize)
    res.send(posts)
})

postsRouter.post ('/',
    authorizationMiddleware,
    postsValidation,
    async (req: Request, res: Response) => {

    const {title, shortDescription, content, blogId} = req.body
    const newPost = await postsRepository.createPost(
        title,
        shortDescription,
        content,
        blogId,
    )

    res.status(201).send(newPost)
})

postsRouter.get('/:postId',
    async (req: Request, res: Response) => {
    const post = await postsRepository.foundPostById(req.params.postId)

    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.put('/:postId',
    authorizationMiddleware,
    postsValidation,
    async (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body
    const successUpdate = await postsRepository.updatePost(
        req.params.postId,
        title,
        shortDescription,
        content,
        blogId,
    )

    if (successUpdate) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
    })

postsRouter.delete('/:postId',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const deletePost = await postsRepository.deletePost(req.params.postId)

        if (deletePost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })