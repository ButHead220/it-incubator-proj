import {blogsCollection} from "../../../mongoDb";
import {blogViewModel} from "../../../dto/types";

export const blogsCommandRepository = {
    async createBlog (newBlog: blogViewModel) {

        await blogsCollection.insertOne(newBlog)

        return newBlog.id
    },

    async updateBlog (updatedBlog: blogViewModel) {
        const result = await blogsCollection.updateOne({id: updatedBlog.id}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl,
            }
        })

        return result.matchedCount === 1
    },

    async deleteBlog(foundBlog: blogViewModel) {
        const result = await blogsCollection.deleteOne({id: foundBlog.id})
        return result.deletedCount === 1
    },
}