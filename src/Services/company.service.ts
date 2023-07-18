import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { CompanyInfo, CompanyInfoExtended, CompanyInput } from '../Ultils/type'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { domain } from '../Ultils/config'

const baseUrl = `${domain}/api/company`

const config = {
    headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
}


const createCompany = async (newCompany: CompanyInput): Promise<CompanyInfo | undefined> => {
    try {
        const res = await axios.post(`${baseUrl}`, newCompany,
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


const getAllCompany = async (): Promise<CompanyInfo[] | undefined> => {
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

const getCompany = async (name : string): Promise<CompanyInfoExtended | undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/${name}`,
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

const companyService = {
    getAllCompany,
    getCompany,
    createCompany
}

export default companyService