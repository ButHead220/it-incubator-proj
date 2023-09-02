import express, {Express} from "express";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";

export const app : Express = express()
export const port : 3000 = 3000

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)