import {userDbModel, userSortingQueryModel, userViewModel} from "../../../dto/user-types";
import {usersCollection} from "../../../mongoDb";
import {WithId} from "mongodb";
import {paginatorViewModel} from "../../../dto/types";

export const usersQueryRepository = {
    async findAllUsers(query: userSortingQueryModel): Promise<paginatorViewModel<userViewModel>> {
        let termLogin
        let termEmail
        if (query.searchLoginTerm === undefined) {
            termLogin = new RegExp('.*')
        }
        else {
            termLogin = new RegExp('.*' + query.searchLoginTerm + '.*', 'i')
        }
        if (query.searchEmailTerm === undefined) {
            termEmail = new RegExp('.*')
        }
        else {
            termEmail = new RegExp('.*' + query.searchEmailTerm + '.*', 'i')
        }
        console.log(typeof query.searchLoginTerm, typeof query.searchEmailTerm)
        console.log(termLogin , termEmail)
        const sortBy = query.sortBy ? query.sortBy : 'createdAt'
        const sortDirection = query.sortDirection === 'asc' ? 1 : -1
        const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1
        const pageSize = query.pageSize ? Number(query.pageSize) : 10

        const skipPages = (pageNumber - 1) * pageSize

        const foundedDbUsers : userDbModel[] = await usersCollection
            .find({ $or: [{'login': termLogin}, {'email': termEmail}]})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.find({ $or: [{'login': termLogin}, {'email': termEmail}]}).count()
        const pagesCount = Math.ceil(totalCount/pageSize)

        const mapedFoundedDbUsers: userViewModel[] = foundedDbUsers.map(dbUser => {
            return {
                id: dbUser._id.toString(),
                login: dbUser.login,
                email: dbUser.email,
                createdAt: dbUser.createdAt,
            }
        })

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mapedFoundedDbUsers
        }
    },

    async findUserById(id: string): Promise<userViewModel | null> {
        const result = await usersCollection.findOne({_id: id})

        if (result) {
            return {
                id: result._id.toString(),
                login: result.login,
                email: result.email,
                createdAt: result.createdAt
            }
        } else {
            return null
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<userDbModel> | null> {
        const foundedUser = await usersCollection.findOne({ $or:[{'login': loginOrEmail}, {'email': loginOrEmail}]})
        return foundedUser ? foundedUser : null
    }
}