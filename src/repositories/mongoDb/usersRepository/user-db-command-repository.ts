import {userDbModel} from "../../../dto/types";
import {usersCollection} from "../../../mongoDb";

export const userCommandRepository = {
    async createUser(newUser: userDbModel) {
        await usersCollection.insertOne(newUser)

        return newUser.id
    }
}