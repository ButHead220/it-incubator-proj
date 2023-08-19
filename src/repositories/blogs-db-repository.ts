import {blogsCollection} from "../mongoDb";
import {blogViewModel} from "../types/types";

const mapBlog = (blog: blogViewModel) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
})
export const blogsRepository = {
    async findAllBlogs() {
        const foundBlogs = await blogsCollection.find({}).toArray()
        return foundBlogs.map(mapBlog)
    },

    async createBlog (name: string, description: string, websiteUrl: string): Promise<blogViewModel> {
        const newBlog = {
            id: (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)

        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership,
        }
    },

    async findBlogById(id: string): Promise<blogViewModel | null> {
        const foundBlog = await blogsCollection.findOne({id: id})

        if (foundBlog) {
            return {
            id: foundBlog.id,
            name: foundBlog.name,
            description: foundBlog.description,
            websiteUrl: foundBlog.websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership,
        }} else { return null }
    },

    async updateBlog (id: string, name: string, description: string, websiteUrl: string) {
        const result = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
            }
        })

        return result.matchedCount === 1
    },

    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}