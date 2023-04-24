import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { AxiosHandleResponse } from '../Ultils/middleware'


const baseUrl = ' http://localhost:3003/api/user'

const config = {
    headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
}

const getUser = async (username: string): Promise<any | undefined> => {
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


const userService = {
    getUser
}



export default userService