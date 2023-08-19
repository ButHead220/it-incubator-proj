import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
dotenv.config()

type blogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}
type postsViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoURI)
const db = client.db("socialMedia")
export const blogsCollection = db.collection<blogViewModel>("blogs")
export const postsCollection = db.collection<postsViewModel>("posts")
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