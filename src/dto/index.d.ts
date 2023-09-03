import {userDbModel} from "./user-types";

declare global {
    declare namespace Express {
        export interface Request {
            user: userDbModel | null
        }
    }
}