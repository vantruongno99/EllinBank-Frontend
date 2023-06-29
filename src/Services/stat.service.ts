import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { CalibrateSensorForm, DeviceInfo, DeviceInput, EditDeviceInput } from '../Ultils/type'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { domain } from '../Ultils/config'
import { Stat } from '../Ultils/type'

const baseUrl = `${domain}/api/stat`
const config = {
    headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
}

const getStat = async (): Promise<Stat|undefined> => {
    try {
        const res = await axios.get(`${baseUrl}`,
            config
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

const statService = {
    getStat,
}

export default statService