import {Request, Response, Router} from "express"
import {blogsRepository} from "../repositories/mongoDb/blogs-db-repository";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {blogsValidation} from "../middlewares/blogs-validation";
import {
    blogSortingQueryModel,
    paginatorViewModel,
    postInputModel,
    postsViewModel,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery, sortingQueryModel
} from "../dto/types";
import {postsRepository} from "../repositories/mongoDb/posts-db-repository";
import {postsValidation} from "../middlewares/post-validation";
import {postsValidationByBlogId} from "../middlewares/post-validation-by-blog-id";

export const blogsRouter = Router({})

blogsRouter.get('/' ,
    async (req: RequestWithQuery<blogSortingQueryModel>, res: Response) => {

        const {searchNameTerm,
            sortBy ,
            sortDirection,
            pageNumber,
            pageSize} = req.query

        if (searchNameTerm) {
            const foundBlogs = await blogsRepository.findBlogsWithQuery(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundBlogs)
        } else {
            const foundBlogs = await blogsRepository.findAllBlogs(sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundBlogs)
        }


})

blogsRouter.get('/:blogsId',
    async (req: Request, res: Response) => {

        const blog = await blogsRepository.findBlogById(req.params.blogsId)

        if (blog) {
            res.send(blog)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.get('/:blogsId/posts',
    async (req: RequestWithParamsAndQuery<{blogsId: string}, sortingQueryModel>, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query
        const blogsId = req.params.blogsId

        const blog = await blogsRepository.findBlogById(blogsId)

        if (blog) {
            const foundPostsByBlogId: paginatorViewModel<postsViewModel> = await postsRepository.findPostsByBlogId(blogsId, sortBy, sortDirection, pageNumber, pageSize)
            res.send(foundPostsByBlogId)
        }
        res.sendStatus(404)
    })

blogsRouter.post ('/',
    authorizationMiddleware,
    blogsValidation,
    async (req: Request, res: Response) => {

    const {name, description, websiteUrl} = req.body
    const newBlog = await blogsRepository.createBlog(
        name,
        description,
        websiteUrl,
    )

    res.status(201).send(newBlog)
})

blogsRouter.post ('/:blogsId/posts',
    authorizationMiddleware,
    postsValidationByBlogId,
    async (req: RequestWithParamsAndBody<{blogsId: string}, postInputModel>, res: Response) => {
        const {title, shortDescription, content} = req.body

        const blogId = req.params.blogsId

        const newPost = await postsRepository.createPost(title, shortDescription, content, blogId)

        if (newPost) {
            res.status(201).send(newPost)
        } else { res.sendStatus(404) }
    })

blogsRouter.put('/:blogsId',
    authorizationMiddleware,
    blogsValidation,
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const successUpdate = await blogsRepository.updateBlog(
            req.params.blogsId,
            name,
            description,
            websiteUrl,
        )

        if(successUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:blogsId',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const successDelete = await blogsRepository.deleteBlog(req.params.blogsId)
        console.log(successDelete)
        if (successDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })