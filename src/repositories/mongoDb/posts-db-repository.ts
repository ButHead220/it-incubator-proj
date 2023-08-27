import {blogsCollection, postsCollection} from "../../mongoDb";
import {postsViewModel} from "../../dto/types";


export const postsRepository = {
    async foundAllPosts(querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number) {
        const sortBy = querySortBy ? querySortBy : 'createdAt'
        const sortDirection = querySortDirection === 'asc' ? 1 : -1
        const pageNumber = queryPageNumber ? Number(queryPageNumber) : 1
        const pageSize = queryPageSize ? Number(queryPageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbPosts = await postsCollection
            .find({})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.find({}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbPosts: postsViewModel[] = foundedDbPosts.map(dbPost => {
            return {
                id: dbPost.id,
                title: dbPost.title,
                shortDescription: dbPost.shortDescription,
                content: dbPost.content,
                blogId: dbPost.blogId,
                blogName: dbPost.blogName,
                createdAt: dbPost.createdAt
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbPosts
        }
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
    },

    async findPostsByBlogId(blogsId: string, querySortBy: string, querySortDirection: string, queryPageNumber: number, queryPageSize: number) {
        const sortBy = querySortBy ? querySortBy : 'createdAt'
        const sortDirection = querySortDirection === 'asc' ? 1 : -1
        const pageNumber = queryPageNumber ? Number(queryPageNumber) : 1
        const pageSize = queryPageSize ? Number(queryPageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbPostsByBlogId = await postsCollection
            .find({ blogId: blogsId })
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.find({}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbPostsByBlogId: postsViewModel[] = foundedDbPostsByBlogId.map(dbPost => {
            return {
                id: dbPost.id,
                title: dbPost.title,
                shortDescription: dbPost.shortDescription,
                content: dbPost.content,
                blogId: dbPost.blogId,
                blogName: dbPost.blogName,
                createdAt: dbPost.createdAt
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbPostsByBlogId
        }
    }
}