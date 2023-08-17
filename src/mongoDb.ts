import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'


console.log(process.env.MONGO_URL)

export const client = new MongoClient(mongoURI)

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