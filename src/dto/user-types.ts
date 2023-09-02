

export type userInputModel = {
    login: string,
    password: string,
    email: string,
}

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userDbModel = {
    _id: string,
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string
}

export type userInputDbModel = {
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
}

export type userSortingQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}