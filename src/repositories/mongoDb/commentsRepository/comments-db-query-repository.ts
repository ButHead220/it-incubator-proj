import {commentViewModel} from "../../../dto/comments-types";
import {commentsCollection} from "../../../mongoDb";

export const commentsQueryRepository = {
    async foundCommentById(commentId: string): Promise<commentViewModel | null> {
        const foundComment = await commentsCollection.findOne({_id: commentId})

        if (foundComment) {
            return {
                id: foundComment._id,
                content: foundComment.content,
                commentatorInfo: {
                    userId: foundComment.commentatorInfo.userId,
                    userLogin: foundComment.commentatorInfo.userLogin,
                },
                createdAt: foundComment.createdAt
            }
        } else {
            return null
        }
    },

    async findCommentsByPostId(postId: string, querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number) {
        const sortBy = querySortBy ? querySortBy : 'createdAt'
        const sortDirection = querySortDirection === 'asc' ? 1 : -1
        const pageNumber = queryPageNumber ? Number(queryPageNumber) : 1
        const pageSize = queryPageSize ? Number(queryPageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbCommentsByPostId = await commentsCollection
            .find({ postId: postId })
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection.find({ postId: postId}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbCommentsByPostId: commentViewModel[] = foundedDbCommentsByPostId.map(dbComments => {
            return {
                id: dbComments._id,
                content: dbComments.content,
                commentatorInfo: {
                    userId: dbComments.commentatorInfo.userId,
                    userLogin: dbComments.commentatorInfo.userLogin,
                },
                createdAt: dbComments.createdAt
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbCommentsByPostId
        }
    },
}