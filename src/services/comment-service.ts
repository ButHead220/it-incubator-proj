import {commentViewModel} from "../dto/comments-types";
import {ObjectId} from "mongodb";
import {userDbModel} from "../dto/user-types";
import {commentsCommandRepository} from "../repositories/mongoDb/commentsRepository/comments-db-command-repository";
import {commentsQueryRepository} from "../repositories/mongoDb/commentsRepository/comments-db-query-repository";

export const commentsService = {
    async createComment(comment: string, user: userDbModel, postId: string): Promise<commentViewModel | null> {
        const newComment = {
            _id: new ObjectId().toString(),
            content: comment,
            commentatorInfo: {
                userId: user._id,
                userLogin: user.login
            },
            postId,
            createdAt: new Date().toISOString()
        }

        return await commentsCommandRepository.createComment(newComment)
    },

    async updateComment(commentId: string, content: string, userId: string) {
        const foundComment = await commentsQueryRepository.foundCommentById(commentId)
        if (foundComment?.commentatorInfo.userId === userId) {
            foundComment.content = content
            return await commentsCommandRepository.updateComment(foundComment)
        } else if (foundComment?.commentatorInfo.userId !== userId) {
            return null
        } else { return false }
    },

    async deleteComment(commentId: string, userId: string) {
        console.log(commentId)
        console.log(userId)
        const foundComment = await commentsQueryRepository.foundCommentById(commentId)
        console.log(foundComment)
        console.log(foundComment?.commentatorInfo.userId !== userId)
        if (foundComment?.commentatorInfo.userId === userId) {
            return await commentsCommandRepository.deleteComment(foundComment)
        } else if (foundComment && (foundComment?.commentatorInfo.userId !== userId)) {
            return false
        } else { return null }
    },
}