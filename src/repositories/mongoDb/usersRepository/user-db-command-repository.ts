import {userDbModel} from "../../../dto/user-types";
import {usersCollection} from "../../../mongoDb";
import {usersQueryRepository} from "./user-db-query-repository";

export const usersCommandRepository = {
    async createUser(newUser: userDbModel) {
        const result = await usersCollection.insertOne(newUser)
        return usersQueryRepository.findUserById(result.insertedId.toString())
    },

    async deleteUser(id: string) {
        const isDeleted = await usersCollection.deleteOne({_id: id})
        return isDeleted.deletedCount === 1
    }
}