import {blogsCommandRepository} from "../repositories/mongoDb/blogsRepository/blogs-db-command-repository";
import {blogViewModel} from "../dto/types";

export const blogService = {
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return await blogsCommandRepository.createBlog(newBlog)
    },
    async updateBlog(Blog: blogViewModel, name: string, description: string, websiteUrl: string) {
        Blog.name = name
        Blog.description = description
        Blog.websiteUrl = websiteUrl

        return blogsCommandRepository.updateBlog(Blog)
    },
    async deleteBlog(foundBlog: blogViewModel) {
        return blogsCommandRepository.deleteBlog(foundBlog)
    },
}