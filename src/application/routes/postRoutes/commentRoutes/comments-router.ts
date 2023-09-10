import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../../../../dto/types";
import {
    commentsQueryRepository
} from "../../../../repositories/mongoDb/commentsRepository/comments-db-query-repository";
import {authBearerMiddleware} from "../../../../middlewares/authorization-bearer-middleware";
import {commentInputModel} from "../../../../dto/comments-types";
import {commentsService} from "../../../../services/comment-service";
import {commentsValidation} from "../../../../middlewares/comments-validation";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
    async (req: RequestWithParams<{commentId: string}>, res: Response) => {
        const foundComment = await commentsQueryRepository.foundCommentById(req.params.commentId)

        if (foundComment) {
            res.send(foundComment)
        } else { res.sendStatus(404) }
    })

commentsRouter.put('/:commentId',
    authBearerMiddleware,
    commentsValidation,
    async (req: RequestWithParamsAndBody<{commentId: string}, commentInputModel>, res: Response) => {
        const isUpdatedComment = await commentsService.updateComment(req.params.commentId, req.body.content, req.user!._id)

        if (isUpdatedComment) {
            res.sendStatus(204)
        } else if (isUpdatedComment === null) {
            res.sendStatus(403)
        } else {
            res.sendStatus(404)
        }
    })

commentsRouter.delete('/:commentId',
    authBearerMiddleware,
    async (req: RequestWithParams<{commentId: string}>, res: Response) => {
        const isDeletedComment = await commentsService.deleteComment(req.params.commentId, req.user!._id)

        if (isDeletedComment) {
            res.sendStatus(204)
        } else if (isDeletedComment === false) {
            res.sendStatus(403)
        } else {
            res.sendStatus(404)
        }
    })