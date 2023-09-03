import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {blogViewModel, postsViewModel} from "./dto/types";
import {userDbModel} from "./dto/user-types";
import {settings} from "./settings";
import {commentDbModel} from "./dto/comments-types";
dotenv.config()

const client = new MongoClient(settings.MONGO_URI)

const db = client.db("socialMedia")
export const blogsCollection = db.collection<blogViewModel>("blogs")
export const postsCollection = db.collection<postsViewModel>("posts")
export const usersCollection = db.collection<userDbModel>("users")
export const commentsCollection = db.collection<commentDbModel>("comments")
export async function runDb() {
    try {
        await client.connect()

        await client.db("blogsAndPosts").command({ ping: 1 })
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Can't connect to db")
        await client.close()
    }
}