import {db} from "../database"
export const blogsRepository = {
    async findAllBlogs() {
        return db.blogs
    },

    async createBlog (name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
        }

        db.blogs.push(newBlog)
        return newBlog
    },

    async findBlogById(id: string) {
        let blog = db.blogs.find(b => b.id === id)
        return blog;
    },

    async updateBlog (id: string, name: string, description: string, websiteUrl: string) {
        const blog = db.blogs.find(b => b.id === id)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return true
        } else {
            return false
        }
    },

    async deleteBlog(id: string) {
        const deleteBlog = db.blogs.filter(b => b.id === id)
        if (deleteBlog.length) {
            for (let i = 0; i < db.blogs.length; i++) {
                if (db.blogs[i].id === id) {
                    db.blogs.splice(i, 1)
                    break
                } 
            } return true
        }    else {
            return false
        }
    }
}