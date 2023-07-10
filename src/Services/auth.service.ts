import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { LoginDetail, ChangePasswordInput } from '../Ultils/type'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { domain } from '../Ultils/config'
const baseUrl = `${domain}/api/auth`


async function loging(loginDetail: LoginDetail) {
    try {

        const response = await axios.post(`${baseUrl}/login`, loginDetail)
        const result = response.data


        Cookies.set('token', result.token)
        Cookies.set('username', result.username)
        Cookies.set('role', result.role)

        return result
    }

    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw ({ message: error.response?.data.error })
        } else {
            console.log(error)

        }
    }
}

const logout = async () => {
    Cookies.remove('username')
    Cookies.remove('token')
    Cookies.remove('role')
    window.location.href = '/login'

}

const tokenAuth = async () => {
    try {
        console.log(Cookies.get('token'))
        const res = await axios.get(`${baseUrl}`,
            {
                headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
            }
        )
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw ({ message: error.response?.data })
        } else {
            console.log(error)

        }
    }
}

const changePassword = async (input: ChangePasswordInput) => {
    try {
        const res = await axios.post(`${baseUrl}/changePassword`, input,
            {
                headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
            }
        )
        return res.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const authservice = {
    loging,
    logout,
    tokenAuth,
    changePassword
}



export default authservice