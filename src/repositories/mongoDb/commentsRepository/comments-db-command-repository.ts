import {commentsCollection} from "../../../mongoDb";
import {commentDbModel, commentViewModel} from "../../../dto/comments-types";
import {commentsQueryRepository} from "./comments-db-query-repository";

export const commentsCommandRepository = {
    async createComment(newComment: commentDbModel): Promise<commentViewModel | null> {
        try {
            await commentsCollection.insertOne(newComment)
            return await commentsQueryRepository.foundCommentById(newComment._id)
        } catch (err) {
            return null
        }
    },

    async updateComment(updatedComment: commentViewModel) {
        const result = await commentsCollection.updateOne({_id: updatedComment.id}, {
            $set: {
                content: updatedComment.content
            }
        })

        return result.matchedCount === 1
    },

    async deleteComment(commentForDelete: commentViewModel) {
        const result = await commentsCollection.deleteOne({_id: commentForDelete.id})

        return result.deletedCount === 1
    },
}