import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { EditTaskInput, Log, TaskInfo, TaskInput } from '../Ultils/type'
import { AxiosHandleResponse } from '../Ultils/middleware'
import { domain } from '../Ultils/config'

const baseUrl = `${domain}/api/task`

const config = {
    headers: { Authorization: `bearer ${Cookies.get('token')}` }, // notice the Bearer before your token
}



const getAllTasks = async (): Promise<TaskInfo[] | undefined> => {
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

const getTask = async (deviceId: string): Promise<TaskInfo | undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/${deviceId}`,
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

const createTask = async (newTask: TaskInput): Promise<TaskInfo | undefined> => {
    try {
        const res = await axios.post(`${baseUrl}`, newTask,
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

const updateTask = async (task: EditTaskInput): Promise<TaskInfo | undefined> => {
    const { id, ...detail } = task
    try {
        const res = await axios.put(`${baseUrl}/${id}`, detail,
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

const completeTask = async (taskId: number) => {
    try {
        const res = await axios.put(`${baseUrl}/${taskId}/complete`, {},
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

const pauseTask = async (taskId: number) => {
    try {
        const res = await axios.put(`${baseUrl}/${taskId}/pause`, {},
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

const resumeTask = async (taskId: number) => {
    try {
        const res = await axios.put(`${baseUrl}/${taskId}/resume`, {},
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

const assignTask = async (taskId: number, deviceId: string) => {
    try {
        const detail =
        {
            taskId,
            deviceId
        }

        const response = await axios.post(`${baseUrl}/assignSensor`, detail, config)
        return response.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            throw AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const unassignTask = async (taskId: number, deviceId: string) => {
    try {
        const detail =
        {
            taskId,
            deviceId
        }
        const response = await axios.post(`${baseUrl}/unassignSensor`, detail, config)
        return response.data
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            console.log(error)
        } else {
            console.log(error)

        }
    }
}

const deleteTask = async (taskId: number): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/${taskId}`,
            config
        )
    }
    catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
            AxiosHandleResponse(error)
        } else {
            console.log(error)

        }
    }
}

const getLogs = async (taskId: number): Promise<Log[]|undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/${taskId}/logs`,
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

const getLogsByType = async (taskId: number , type : string): Promise<Log[]|undefined> => {
    try {
        const res = await axios.get(`${baseUrl}/${taskId}/logs/${type}`,
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

const taskService = {
    getAllTasks,
    getTask,
    createTask,
    assignTask,
    completeTask,
    pauseTask,
    resumeTask,
    updateTask,
    deleteTask,
    unassignTask,
    getLogs,
    getLogsByType
}

export default taskService