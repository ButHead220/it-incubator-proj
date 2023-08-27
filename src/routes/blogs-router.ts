import {Request, Response, Router} from "express"
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {blogsValidation} from "../middlewares/blogs-validation";
import {
    blogSortingQueryModel, blogViewModel,
    paginatorViewModel,
    postInputModel,
    postsViewModel,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery, sortingQueryModel
} from "../dto/types";
import {postsValidationByBlogId} from "../middlewares/post-validation-by-blog-id";
import {blogService} from "../services/blog-service";
import {blogsQueryRepository} from "../repositories/mongoDb/blogsRepository/blogs-db-query-repository";
import {postsQueryRepository} from "../repositories/mongoDb/postsRepository/posts-db-query-repository";
import {postsService} from "../services/post-service";

export const blogsRouter = Router({})

blogsRouter.get('/' ,
    async (req: RequestWithQuery<blogSortingQueryModel>, res: Response) => {

        const {searchNameTerm,
            sortBy ,
            sortDirection,
            pageNumber,
            pageSize} = req.query

        if (searchNameTerm) {
            const foundBlogs = await blogsQueryRepository.findBlogsWithQuery(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundBlogs)
        } else {
            const foundBlogs = await blogsQueryRepository.findAllBlogs(sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundBlogs)
        }


})

blogsRouter.get('/:blogsId',
    async (req: Request, res: Response) => {

        const blog = await blogsQueryRepository.findBlogById(req.params.blogsId)

        if (blog) {
            res.send(blog)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.get('/:blogsId/posts',
    async (req: RequestWithParamsAndQuery<{blogsId: string}, sortingQueryModel>, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query

        const blog = await blogsQueryRepository.findBlogById(req.params.blogsId)

        if (blog) {
            const foundPostsByBlogId: paginatorViewModel<postsViewModel> = await postsQueryRepository.findPostsByBlogId(req.params.blogsId, sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundPostsByBlogId)
        } else { res.sendStatus(404) }
    })

blogsRouter.post ('/',
    authorizationMiddleware,
    blogsValidation,
    async (req: Request, res: Response) => {

    const {name, description, websiteUrl} = req.body
    const idCreatedBlog = await blogService.createBlog(
        name,
        description,
        websiteUrl,
    )

    const foundCreatedBlog: blogViewModel | null = await blogsQueryRepository.findBlogById(idCreatedBlog)

    res.status(201).send(foundCreatedBlog)
})

blogsRouter.post ('/:blogsId/posts',
    authorizationMiddleware,
    postsValidationByBlogId,
    async (req: RequestWithParamsAndBody<{blogsId: string}, postInputModel>, res: Response) => {
        const {title, shortDescription, content} = req.body

        const foundBlog = await blogsQueryRepository.findBlogById(req.params.blogsId)

        if (foundBlog) {
            const newPost = await postsService.createPost(
                foundBlog,
                title,
                shortDescription,
                content)
            res.status(201).send(newPost)
        } else { res.sendStatus(404) }
    })

blogsRouter.put('/:blogsId',
    authorizationMiddleware,
    blogsValidation,
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body

        const foundBlog = await blogsQueryRepository.findBlogById(req.params.blogsId)

        if (foundBlog) {
            await blogService.updateBlog(foundBlog, name, description, websiteUrl)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:blogsId',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const foundBlog = await blogsQueryRepository.findBlogById(req.params.blogsId)
        if (foundBlog) {
            await blogService.deleteBlog(foundBlog)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })