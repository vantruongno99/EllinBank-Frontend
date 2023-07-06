import { useState, useEffect } from "react"
import deviceService from "../../Services/device.service"
import { useParams } from "react-router-dom"
import { DeviceForm, DeviceInfo, TaskInfo } from "../../Ultils/type"
import { Tabs } from "@mantine/core"
import moment from "moment"
import { DeviceDetail, DeviceTasks, DeviceSensors } from "../../Components/Device"
import { useQuery } from "@tanstack/react-query";
import { Loader } from '@mantine/core';
import { showErorNotification } from "../../Ultils/notification"


const Device = () => {
    const [device, setDevice] = useState<DeviceForm | null>(null)
    const [tasks, setTasks] = useState<TaskInfo[]>([])
    const params = useParams();
    const id = params.id

    if (!id) {
        return <div>
            404
        </div>
    }

    const { isLoading, error, isError, data} = useQuery({
        queryKey: ['device', id],
        initialData: undefined,
        queryFn: async () => {
            const res = await deviceService.getDevice(id)
            if(!res){
                throw new Error()
            }
            return res
        },
        onSuccess: (data) => {
            const { Task, ...detail } = data
            setTasks(data.Task.map(a => a.Task))
            setDevice(
                { ...detail, 
                    updateUTC: moment(detail.updateUTC).format('DD/MM/yyyy HH:mm'),
                    lastCheck: moment(detail.lastCheck).format('DD/MM/yyyy HH:mm')
                 })
            console.log(data)

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


    if (!device) {
        return <>
            404
        </>
    }



    return (
        <>
            <Tabs defaultValue="detail">
                <Tabs.List position="center">
                    <Tabs.Tab value="detail">DETAILS</Tabs.Tab>
                    <Tabs.Tab value="tasks">TASKS</Tabs.Tab>
                    <Tabs.Tab value="sensors">SENSORS</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="tasks">
                    <DeviceTasks tasks={tasks} />
                </Tabs.Panel>
                <Tabs.Panel value="detail">
                    < DeviceDetail device={device} />
                </Tabs.Panel>
                <Tabs.Panel value="sensors">
                    <DeviceSensors device={device} />
                </Tabs.Panel>

            </Tabs>

        </>
    )
}

export default Device