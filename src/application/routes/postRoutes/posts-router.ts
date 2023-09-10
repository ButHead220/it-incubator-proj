import {Router, Request, Response} from "express";
import {authorizationBaseMiddleware} from "../../../middlewares/authorization-base-middleware";
import {postsValidation} from "../../../middlewares/post-validation";
import {
    paginatorViewModel,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery,
    sortingQueryModel
} from "../../../dto/types";
import {postsQueryRepository} from "../../../repositories/mongoDb/postsRepository/posts-db-query-repository";
import {blogsQueryRepository} from "../../../repositories/mongoDb/blogsRepository/blogs-db-query-repository";
import {postsService} from "../../../services/post-service";
import {commentInputModel, commentViewModel} from "../../../dto/comments-types";
import {commentsQueryRepository} from "../../../repositories/mongoDb/commentsRepository/comments-db-query-repository";
import {authBearerMiddleware} from "../../../middlewares/authorization-bearer-middleware";
import {commentsValidation} from "../../../middlewares/comments-validation";
import {commentsService} from "../../../services/comment-service";

export const postsRouter = Router({})

postsRouter.get ('/',
    async (req: RequestWithQuery<sortingQueryModel>, res: Response) => {
    const {sortBy, sortDirection, pageNumber, pageSize} = req.query

    const posts = await postsQueryRepository.foundAllPosts(sortBy, sortDirection, pageNumber, pageSize)
    res.send(posts)
})

postsRouter.post ('/',
    authorizationBaseMiddleware,
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
    authorizationBaseMiddleware,
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
    authorizationBaseMiddleware,
    async (req: Request, res: Response) => {

        const foundPost = await postsQueryRepository.foundPostById(req.params.postId)
        if (foundPost) {
            await postsService.deletePost(foundPost)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

postsRouter.get('/:postId/comments',
    async (req: RequestWithParamsAndQuery<{postId: string}, sortingQueryModel>, res: Response)=> {
        const foundPost = await postsQueryRepository.foundPostById(req.params.postId)
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query

        if (foundPost) {
            const foundCommentsByPostId: paginatorViewModel<commentViewModel> = await commentsQueryRepository
                .findCommentsByPostId(req.params.postId,
                    sortBy,
                    sortDirection,
                    pageNumber,
                    pageSize)

            res.send(foundCommentsByPostId)
        } else { res.sendStatus(404) }
    })
postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    commentsValidation,
    async (req: RequestWithParamsAndBody<{postId: string}, commentInputModel>, res: Response) => {
        const foundPost = await postsQueryRepository.foundPostById(req.params.postId)

        if (foundPost) {
            const createdComment = await commentsService
                .createComment(
                    req.body.content,
                    req.user!,
                    req.params.postId
                )
            res.status(201).send(createdComment)
        } else {
            res.sendStatus(404)
        }
    })