import {blogsCollection} from "../mongoDb";

export const blogsRepository = {
    async findAllBlogs() {
        return blogsCollection.find({}).toArray()
    },

    async createBlog (name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
            createdAt: (new Date()).toString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)
        return newBlog
    },

    async findBlogById(id: string) {
        return blogsCollection.findOne({id: id})
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