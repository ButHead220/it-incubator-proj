import {postsCollection} from "../../../mongoDb";
import {postsViewModel} from "../../../dto/types";
import {postsQueryRepository} from "./posts-db-query-repository";


export const postsCommandRepository = {
    async createPost(newPost: postsViewModel): Promise<postsViewModel | null> {

        const createdPost = newPost

        await postsCollection.insertOne(createdPost)
        return postsQueryRepository.foundPostById(createdPost.id)
    },
    async updatePost(post: postsViewModel) {
        const result = await postsCollection.updateOne({id: post.id}, {
            $set: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
            }
        })

        return result.matchedCount === 1
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
}