import { useState } from "react"
import taskService from "../../Services/task.service"
import { useParams } from "react-router-dom"
import { DeviceInfo, TaskForm, TaskInfo } from "../../Ultils/type"
import { Tabs } from "@mantine/core"
import { TaskDetail, TaskDevices, TaskLog } from "../../Components/Task"
import { useQuery } from "@tanstack/react-query"
import { showErorNotification } from "../../Ultils/notification"
import { Loader } from '@mantine/core'


const intialValue ={
    startTime: new Date(),
    endTime: new Date(),
    name: '',
    logPeriod: 0,
    id: 0,
    createdUTC: new Date(),
    completedUTC: null,
    createUser: '',
    completeUser: null,
    status: ''
}

const Task = () => {
    const [devices, setDevices] = useState<DeviceInfo[]>([])
    const [task, setTask] = useState<TaskForm >(intialValue)
    const [activeTab, setActiveTab] = useState<string | null>('detail');

    const params = useParams();
    const id = params.id

    if (!id) {
        return <>
            404</>
    }


    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['task',parseInt(id)],
        queryFn: async () => {
            const res: TaskInfo | undefined = await taskService.getTask(id)
            if (!res) {
                throw new Error()
            }
            return res
        },
        onSuccess(data) {
            const { Device, ...detail } = data
            const task = {
                ...detail,
                startTime: new Date(detail.startTime),
                endTime: new Date(detail.endTime),
                createdUTC: new Date(detail.createdUTC),
                completedUTC: detail.completedUTC ? new Date(detail.completedUTC) : null
            }
            setDevices(data.Device.map((a: { Device: any }) => a.Device))
            setTask(task)
        },
        onError: (e) => {
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
    })

    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List position="center">
                    <Tabs.Tab value="detail">DETAILS</Tabs.Tab>
                    <Tabs.Tab value="devices">DEVICES</Tabs.Tab>
                    <Tabs.Tab value="tracking">TRACKING</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="detail">
                    <TaskDetail task={task} />
                </Tabs.Panel>

                <Tabs.Panel value="devices">
                    <TaskDevices devices={devices} task={task} />
                </Tabs.Panel>

                <Tabs.Panel value="tracking">
                    {activeTab === "tracking" && <TaskLog task={task} />}
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default Task