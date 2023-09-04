import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { UserInfo, UserInput } from '../Ultils/type'

import { domain } from '../Ultils/config'

const baseUrl = `${domain}/api/user`

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


const deleteUser = async (username: string): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/${username}`,
            config
        )
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const editUser = async (user: UserInfo) => {
    const { username, id, ...detail } = user

    try {
        const res = await axios.post(`${baseUrl}/${username}`, detail,
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
    getCurrentUser,
    deleteUser,
    editUser
}



export default userService