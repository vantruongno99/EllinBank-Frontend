export type LoginDetail = {
    username: string;
    password: string
}

export type DeviceInput = {
    name: string,
    id: string,
}

export interface DeviceInfo extends DeviceForm {
    Task: { Task: TaskInfo }[]
}

export interface DeviceForm extends DeviceInput {
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
    updateUTC: string,
    status : string,
    assigned : boolean
} 


export interface EditDeviceInput extends DeviceInput {
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
}

export interface EditTaskInput  {
    id: number,
    endTime: Date,
    name: string,
    logPeriod: number
}

export type TaskInput = {
    startTime: Date,
    endTime: Date,
    name: string,
    logPeriod: number

}

export interface TaskInfo extends TaskInput {
    id: number,
    createdUTC: Date,
    completedUTC: Date | null,
    createUser: string,
    completeUser: string | null,
    status: string
    Device: {
        Device: TaskInfo
    }[]
}

export interface TaskForm extends TaskInput {
    id: number,
    createdUTC: Date,
    completedUTC: Date | null,
    createUser: string,
    completeUser: string | null,
    status: string
}

export interface DeviceForm extends DeviceInput {
    CH4_SN: string | null
    O2_SN: string | null
    CO2_SN: string | null
    PUMP_SN: string | null
    Task?: any,
    updateUTC: string
}



export type CustomError = {
    message: string
}

export interface CalibrateSensorForm {
    gasType: string
    calType: string,
    calValue: number
}

export interface ChangePasswordInput {
    username : string,
    password : string , 
    newPassword : string
}

export interface ChangePasswordForm {
    password : string , 
    newPassword : string,
    confirmPassword : string
}

export interface Log {
    id: number,
    dateTimeUTC: Date,
    timestampUTC: number,
    deviceId: string,
    taskId: number,
    logType: string,
    logValue: number,
    logNote: string
}

export interface UserInfo {
    id : number ,
    username : string,
    role : string,
    email : string
}

export interface UserInput {
    username : string,
    password : string,
    email : string,
    role? : string
}

export interface Stat {
    numberOfDevices: number,
     numberOfTasks: number, 
     numberOfOngoingTasks: number
}
