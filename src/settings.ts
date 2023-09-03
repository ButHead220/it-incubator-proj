import express, {Express} from "express";
import {blogsRouter} from "./application/routes/blogs-router";
import {postsRouter} from "./application/routes/postRoutes/posts-router";
import {testingRouter} from "./application/routes/testing-router";
import {usersRouter} from "./application/routes/users-router";
import {authRouter} from "./application/routes/auth-router";
import dotenv from "dotenv";
import {commentsInPostsRouter} from "./application/routes/postRoutes/comments-in-posts-router";
import {commentsRouter} from "./application/routes/postRoutes/commentRoutes/comments-router";
dotenv.config()
export const app : Express = express()
export const port : 3000 = 3000

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/posts/:postId/comments', commentsInPostsRouter)
app.use('/comments', commentsRouter)

export const settings = {
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || "123"
}