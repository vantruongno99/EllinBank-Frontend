const deviceStatusColor = (status: string): string => {
    switch (status) {
        case "READY": return "green"
        case "RUNNING": return "blue"
        case "PAUSED": return "orange"
        default:
            return ""
    }
}

const taskStatusColor = (status: string): string => {
    switch (status) {
        case "ONGOING": return "blue"
        case "PAUSED": return "orange"
        case "COMPLETED": return "green"
        default:
            return ""
    }
}

export { deviceStatusColor, taskStatusColor }

