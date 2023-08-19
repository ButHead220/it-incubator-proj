import {Request, Response, Router} from "express"
import {blogsRepository} from "../repositories/blogs-db-repository";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {blogsValidation} from "../middlewares/blogs-validation";

export const blogsRouter = Router({})

blogsRouter.get('/' ,
    async (req: Request , res: Response) => {
    const blogs = await blogsRepository.findAllBlogs()
    res.send(blogs)
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

blogsRouter.get('/:blogsId',
    async (req: Request, res: Response) => {

    const blog = await blogsRepository.findBlogById(req.params.blogsId)

    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
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

        if (successDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })