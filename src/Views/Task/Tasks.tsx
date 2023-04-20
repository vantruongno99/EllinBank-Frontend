import React, { useState, useEffect } from "react"
import taskService from "../../Services/task.service";
import { TaskInfo } from "../../Ultils/type"
import { Table, Anchor, Button, Group, Space , Tooltip ,Text} from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import {
    IconAlertTriangle
} from '@tabler/icons-react';
const Devices = () => {
    const [tasks, setTasks] = useState<TaskInfo[]>([])
    const navigate = useNavigate()


    const getDevice = async () => {
        try {
            const res: TaskInfo[] | undefined = await taskService.getAllTasks()
            if (res && res?.length > 0) {
                setTasks(res)
            }

        }
        catch (e) {
            console.log(e)
        }
    }

    const statusColor = (status: string): string => {
        switch (status) {
            case "ONGOING": return "blue"
            case "PAUSED": return "orange"
            case "COMPLETED": return "green"
            default:
                return ""
        }
    }

    const location = useLocation();

    const rows = tasks.map((element) => (
        <tr key={element.id}>
            <td>
                <Anchor href={`${location.pathname}/${element.id}`} target="_blank">
                    {element.id}
                </Anchor>
            </td>
            <td>{element.name}</td>
            <td> {moment(element.startTime).format('DD/MM/yyyy HH:mm')}</td>
            <td> <Group position="left">
                {moment(element.endTime).format('DD/MM/yyyy HH:mm')} 
            {(new Date(element.endTime) < new Date()) && <Tooltip label="Delayed"  color="orange"><IconAlertTriangle color="orange"/></Tooltip>}
            </Group>
            </td>
            <td>{element.createUser}</td>
            <td><Text color={statusColor(element.status)}>{element.status}</Text></td>
        </tr>
    ))


    useEffect(() => {
        getDevice()
    }, [])



    return (
        <> <Group position="right">
            <Button onClick={() => navigate(`${location.pathname}/new`)}>
                New Task
            </Button>
        </Group>
            <Space h="xl" />
            <Table fontSize="md">
                <thead>
                    <tr>
                        <th>Task No.</th>
                        <th>Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Created By</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default Devices