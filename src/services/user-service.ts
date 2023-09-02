import {usersCommandRepository} from "../repositories/mongoDb/usersRepository/user-db-command-repository";
import {_generateHash} from "../utils/generate-hash";

export const userService = {
    async createUser(login: string, password: string, email: string) {
        const passwordHash = await _generateHash(password)

        const newUser = {
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
}