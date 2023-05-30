import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { UserInfo, UserInput } from '../Ultils/type'

const baseUrl = ' http://localhost:3003/api/user'

const config = {
    headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
}

const getCurrentUser = async (): Promise<UserInfo | undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/current`, config)
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const getUser = async (username: string): Promise<UserInfo | undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/${username}`,
            config
        )
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const getAllUsers = async (): Promise<UserInfo[] | undefined> => {
    try {
        const res = await axios.get(`${baseUrl}`,
            config
        )
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const createUser = async (newUser: UserInput): Promise<UserInfo | undefined> => {
    try {
        const res = await axios.post(`${baseUrl}/signup`, newUser,
            config
        )
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            console.log(error)
            AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}


const userService = {
    getUser,
    getAllUsers,
    createUser,
    getCurrentUser
}



export default userService