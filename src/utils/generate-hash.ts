import bcrypt from "bcrypt";

export const _generateHash: any = (password: string) => {
    return bcrypt.hash(password, 10)
}