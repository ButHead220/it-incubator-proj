import {blogViewModel, paginatorViewModel} from "../../../dto/types";
import {blogsCollection} from "../../../mongoDb";

export const blogsQueryRepository = {
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
    async findBlogsWithQuery(querySearchNameTerm: string, querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number): Promise<paginatorViewModel<blogViewModel>> {

        const regex = new RegExp(`.*${querySearchNameTerm}.*`, "i")
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

        const totalCount = await blogsCollection.find({ name : {$regex: regex}}).count()
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
}