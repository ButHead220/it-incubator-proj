import {Request, Response, Router} from "express"
import {db} from "../../database";
import {blogsCollection, postsCollection, usersCollection} from "../../mongoDb";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req:Request, res: Response) => {
        db.posts.length = 0
        db.blogs.length = 0
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})

    res.sendStatus(204)
})