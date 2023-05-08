import { useEffect, useState } from "react";
import { TaskForm } from "../../Ultils/type"
import { showErorNotification } from "../../Ultils/notification";
import taskService from "../../Services/task.service";
const TaskLog = ({ task }: { task: TaskForm | undefined }) => {
    const [data, setData] = useState<any>([])

    const getLog = async () => {
        if (task?.id) {
            try {
                const res = await taskService.getLogs(task?.id)
                setData(res)
            }
            catch (e) {
                if (e instanceof Error) {
                    showErorNotification(e.message)
                }
                else {
                    showErorNotification("Unknown Error")
                }
            }
        }
    }


    useEffect(() => {
        getLog()
    },[])

    return(
    <>
    {JSON.stringify(data)}
    </>
    )
}

export default TaskLog
