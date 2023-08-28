import bcrypt from 'bcrypt'
import {userCommandRepository} from "../repositories/mongoDb/usersRepository/user-db-command-repository";

export const userService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            id: (+(new Date())).toString(),
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash
        }
        return await userCommandRepository.createUser(newUser)
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
}