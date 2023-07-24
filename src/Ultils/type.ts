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
    lastCheck? : string,
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
    logPeriod: number,
    comment : string,
}

export type TaskInput = {
    startTime: Date,
    endTime: Date,
    name: string,
    logPeriod: number,
    company : string

}

export interface TaskInfo extends TaskInput {
    id: number,
    createdUTC: Date,
    completedUTC: Date | null,
    createUser: string,
    completeUser: string | null,
    comment : string,
    status: string
    Device: {
        Device: DeviceInfo
    }[]
}

export interface TaskForm extends TaskInput {
    id: number,
    createdUTC: Date,
    completedUTC: Date | null,
    createUser: string,
    completeUser: string | null,
    status: string,
    comment : string,

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
    email : string,
    company : string
}

export interface UserInput {
    username : string,
    password : string,
    email : string,
    role? : string,
    company : string,
}

export interface Stat {
    numberOfDevices: number,
     numberOfTasks: number, 
     numberOfOngoingTasks: number
}

export interface CompanyInfo {
    name : string,
}

export interface CompanyInfoExtended {
    name : string,
    Users : UserInfo[]
}

export interface CompanyInput {
    name : string
}

export interface GetLogOption {
    type? : string,
    devices? : string[]
}
