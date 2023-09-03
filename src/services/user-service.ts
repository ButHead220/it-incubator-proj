import {usersCommandRepository} from "../repositories/mongoDb/usersRepository/user-db-command-repository";
import {_generateHash} from "../utils/generate-hash";
import {ObjectId} from "mongodb";
import {authInputModel} from "../dto/auth-types";
import {usersQueryRepository} from "../repositories/mongoDb/usersRepository/user-db-query-repository";
import bcrypt from "bcrypt";

export const userService = {
    async createUser(login: string, password: string, email: string) {
        const passwordHash = await _generateHash(password)

        const newUser = {
            _id: new ObjectId().toString(),
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash
        }
        return await usersCommandRepository.createUser(newUser)
    },

    async deleteUser(id: string) {
      return await usersCommandRepository.deleteUser(id)
    },
    async checkCredentials(body: authInputModel) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(body.loginOrEmail)
        if (user) {
            const correctCredentials = await bcrypt.compare(body.password, user.passwordHash)
            if (correctCredentials) {
                return user
            } else { return }
        } else { return null }
    },
}