import {blogsCollection, postsCollection} from "../mongoDb";
import {postsViewModel} from "../types/types";

const mapPost = (post: postsViewModel) => ({
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
})
export const postsRepository = {
    async foundAllPosts() {
        const foundPosts = await postsCollection.find({}).toArray()
        return foundPosts.map(mapPost)
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsViewModel | null> {
        const foundBlog =  await blogsCollection.findOne({id: blogId})
        if (!foundBlog) {
            return null
        }
        const newPost = {
            id: (+(new Date())).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString(),
        }
        await postsCollection.insertOne(newPost)
        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        }
    },

    async foundPostById(id: string): Promise<postsViewModel | null> {
        const foundPost = await postsCollection.findOne({id: id})

        if (foundPost) {
            return {
                id: foundPost.id,
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId,
                blogName: foundPost.blogName,
                createdAt: foundPost.createdAt,
            }
        } else {
            return null
        }
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