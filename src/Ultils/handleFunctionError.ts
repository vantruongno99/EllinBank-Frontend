import { showErorNotification } from "./notification"

const handleFunctionError = (e : any) =>{
    if (e instanceof Error) {
        showErorNotification(e.message)
    }
    else {
        showErorNotification("Unknown Error")
    }
}

export default handleFunctionError