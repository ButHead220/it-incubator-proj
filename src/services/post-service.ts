import {blogViewModel, postsViewModel} from "../dto/types";
import {postsCommandRepository} from "../repositories/mongoDb/postsRepository/posts-db-command-repository";

export const postsService = {
    async createPost(foundBlog: blogViewModel, title: string, shortDescription: string, content: string) {
        const newPost = {
            id: (+(new Date())).toString(),
            title,
            shortDescription,
            content,
            blogId: foundBlog.id,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString(),
        }

        return await postsCommandRepository.createPost(newPost)
    },
    async updatePost(post: postsViewModel, title: string, shortDescription: string, content: string, blogId: string) {
        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId

        return postsCommandRepository.updatePost(post)
    },
    async deletePost(foundPost: postsViewModel) {
        console.log(foundPost)
        return await postsCommandRepository.deletePost(foundPost.id)
    },
}