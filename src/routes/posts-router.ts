import {Router, Request, Response} from "express";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {postsValidation} from "../middlewares/post-validation";
import {RequestWithQuery, sortingQueryModel} from "../dto/types";
import {postsQueryRepository} from "../repositories/mongoDb/postsRepository/posts-db-query-repository";
import {blogsQueryRepository} from "../repositories/mongoDb/blogsRepository/blogs-db-query-repository";
import {postsService} from "../services/post-service";

export const postsRouter = Router({})

postsRouter.get ('/',
    async (req: RequestWithQuery<sortingQueryModel>, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = req.query

    const posts = await postsQueryRepository.foundAllPosts(sortBy, sortDirection, pageNumber, pageSize)
    res.send(posts)
})

postsRouter.post ('/',
    authorizationMiddleware,
    postsValidation,
    async (req: Request, res: Response) => {

    const {title, shortDescription, content, blogId} = req.body

    const foundBlog =  await blogsQueryRepository.findBlogById(blogId)

    if (foundBlog) {
        const newPost = await postsService.createPost(
            foundBlog,
            title,
            shortDescription,
            content
        )
        res.status(201).send(newPost)
    }


})

postsRouter.get('/:postId',
    async (req: Request, res: Response) => {
    const post = await postsQueryRepository.foundPostById(req.params.postId)

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

    const foundPost = await postsQueryRepository.foundPostById(req.params.postId)

    if (foundPost) {
        await postsService.updatePost(foundPost, title, shortDescription, content, blogId,)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
    })

postsRouter.delete('/:postId',
    authorizationMiddleware,
    async (req: Request, res: Response) => {

        const foundPost = await postsQueryRepository.foundPostById(req.params.postId)
        if (foundPost) {
            await postsService.deletePost(foundPost)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })