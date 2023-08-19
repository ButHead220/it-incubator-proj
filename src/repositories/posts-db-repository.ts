import {postsCollection} from "../mongoDb";

export const postsRepository = {
    async foundAllPosts() {
        return postsCollection.find({}).toArray()
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        const newPost = {
            id: (+(new Date())).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: (new Date()).toString(),
        }
        await postsCollection.insertOne(newPost)
        return newPost
    },

    async foundPostById(id: string) {
        return postsCollection.findOne({id: id})
    },

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string) {
        const result = await postsCollection.updateOne({id: postId}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
            }
        })

        return result.matchedCount === 1
    },

    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}