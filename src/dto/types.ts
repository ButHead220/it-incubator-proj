import { Request } from "express"

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>

export type blogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type paginatorViewModel<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}

export type postInputModel = {
    title: string,
    shortDescription: string,
    content: string,
}

export type postsViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type sortingQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

export type blogSortingQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string | null,
}