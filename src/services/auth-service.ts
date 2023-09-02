import {authInputModel} from "../dto/auth-types";
import {usersQueryRepository} from "../repositories/mongoDb/usersRepository/user-db-query-repository";
import bcrypt from "bcrypt";

export const authService = {
    async authUser(body: authInputModel) {
        const result = await usersQueryRepository.findUserByLoginOrEmail(body.loginOrEmail)
        if (result) {
            return await bcrypt.compare(body.password, result.passwordHash)
        } else { return null }
    },
}