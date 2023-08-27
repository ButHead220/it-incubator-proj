import {blogsCollection} from "../../mongoDb";
import {blogViewModel, paginatorViewModel} from "../../dto/types";

export const blogsRepository = {
    async findAllBlogs(querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number): Promise<paginatorViewModel<blogViewModel>> {

        const sortBy = querySortBy ? querySortBy : 'createdAt'
        const sortDirection = querySortDirection === 'asc' ? 1 : -1
        const pageNumber = queryPageNumber ? Number(queryPageNumber) : 1
        const pageSize = queryPageSize ? Number(queryPageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbBlogs = await blogsCollection
            .find({})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.find({}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbBlogs: blogViewModel[] = foundedDbBlogs.map(dbBlog => {
            return {
                id: dbBlog.id,
                name: dbBlog.name,
                description: dbBlog.description,
                websiteUrl: dbBlog.websiteUrl,
                createdAt: dbBlog.createdAt,
                isMembership: dbBlog.isMembership
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbBlogs
        }
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
    },


    async findBlogsWithQuery(querySearchNameTerm: string, querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number): Promise<paginatorViewModel<blogViewModel>> {

        const searchNameTerm = querySearchNameTerm
        const regex = new RegExp(`^${searchNameTerm}$`, "i")
        const sortBy = querySortBy ? querySortBy : 'createdAt'
        const sortDirection = querySortDirection === 'asc' ? 1 : -1
        const pageNumber = queryPageNumber ? Number(queryPageNumber) : 1
        const pageSize = queryPageSize ? Number(queryPageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbBlogs = await blogsCollection
            .find({ name : {$regex: regex}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.find({ name : {$regex: searchNameTerm}}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbBlogs: blogViewModel[] = foundedDbBlogs.map(dbBlog => {
            return {
                id: dbBlog.id,
                name: dbBlog.name,
                description: dbBlog.description,
                websiteUrl: dbBlog.websiteUrl,
                createdAt: dbBlog.createdAt,
                isMembership: dbBlog.isMembership
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbBlogs
        }
    },

    async findPostsByBlogId() {

    }
}