export type commentInputModel = {
    content: string
}

export type commentViewModel = {
    id: string,
    content: string,
    commentatorInfo: commentatorInfo,
    createdAt: string
}

export type commentDbModel = {
    _id: string,
    content: string,
    commentatorInfo: commentatorInfo,
    postId: string,
    createdAt: string
}

export type commentatorInfo = {
    userId: string,
    userLogin: string,
}