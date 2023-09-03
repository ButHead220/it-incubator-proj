import {Response, Router} from "express";
import {authBearerMiddleware} from "../../../middlewares/authorization-bearer-middleware";
import {commentsValidation} from "../../../middlewares/comments-validation";
import {
    paginatorViewModel,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery, sortingQueryModel
} from "../../../dto/types";
import {commentInputModel, commentViewModel} from "../../../dto/comments-types";
import {postsQueryRepository} from "../../../repositories/mongoDb/postsRepository/posts-db-query-repository";
import {commentsService} from "../../../services/comment-service";
import {commentsQueryRepository} from "../../../repositories/mongoDb/commentsRepository/comments-db-query-repository";

export const commentsInPostsRouter = Router({})

commentsInPostsRouter.get('/',
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
commentsInPostsRouter.post('/',
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