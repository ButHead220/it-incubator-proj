import {userDbModel} from "../dto/user-types";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
export const jwtService = {
    async createJWT(user: userDbModel) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '5m'})

        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (err) {
            return null
        }
    }
}