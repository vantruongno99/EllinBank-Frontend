import React, { useState, useEffect } from "react"
import taskService from "../../Services/task.service";
import { TaskInfo } from "../../Ultils/type"
import { Anchor, Button, Group, Space, Tooltip, Text, Loader, ActionIcon } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import {
    IconAlertTriangle
} from '@tabler/icons-react';
import { taskStatusColor } from "../../Ultils/colors"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import { IconCirclePlus } from '@tabler/icons-react';




const Tasks = () => {

    const navigate = useNavigate()
    const location = useLocation();


    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['task'],
        initialData: [],
        queryFn: async () => {
            const res: TaskInfo[] | undefined = await taskService.getAllTasks()
            if (!res) {
                throw new Error()
            }
            return res
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
    if (isLoading) return <Loader />

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <> <Group position="right">
            <Tooltip
                label="Create new Task"
                color="blue"
                position="left"
            >
                <ActionIcon color="blue" size="lg" radius="xl" variant="light" onClick={() => {
                    navigate(`${location.pathname}/new`)
                }}>
                    <IconCirclePlus />
                </ActionIcon >
            </Tooltip>
        </Group>
            <Space h="xl" />
            <TaskTable data={data} isLoading={isLoading} />

        </>
    )
}

const TaskTable = ({ data, isLoading }: { data: TaskInfo[], isLoading: boolean }) => {
    const [tasks, setTasks] = useState<TaskInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });

    useEffect(() => {
        setTasks(data)
    }, [data])

    useEffect(() => {
        const data = sortBy(tasks, sortStatus.columnAccessor) as TaskInfo[];
        setTasks(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);


    return (<>
        <DataTable
            minHeight={tasks.length === 0 ? 150 : 0}
            withBorder
            borderRadius={5}
            verticalAlignment="center"
            fontSize="md"
            sortStatus={sortStatus}
            fetching={isLoading}
            onSortStatusChange={setSortStatus}
            sortIcons={{
                sorted: <IconChevronUp size={14} />,
                unsorted: <IconSelector size={14} />,
            }}
            columns={[
                {
                    accessor: 'id',
                    title: 'Task No',
                    sortable: true,
                    render: ({ id }) =>
                        <Anchor href={`${location.pathname}/${id}`} target="_blank">
                            {id}
                        </Anchor>

                },
                {
                    accessor: 'name',
                    title: 'Name',
                    sortable: true,

                },
                {
                    accessor: 'startTime',
                    sortable: true,
                    render: ({ startTime }) => (
                        <Group position="left">
                            {moment(startTime).format('DD/MM/yyyy HH:mm')}
                        </Group>
                    )
                },
                {
                    accessor: 'endTime',
                    sortable: true,
                    render: ({ endTime }) => (
                        <Group position="left">
                            {moment(endTime).format('DD/MM/yyyy HH:mm')}
                            {(new Date(endTime) < new Date()) && <Tooltip label="Delayed" color="orange"><IconAlertTriangle color="orange" /></Tooltip>}
                        </Group>
                    )
                },
                {
                    accessor: 'company',
                    sortable: true,
                    render: ({ company }) =>
                    <Anchor href={`/company/${company}`} target="_blank">
                        {company}
                    </Anchor>
                },
                {
                    accessor: 'status',
                    sortable: true,
                    render: ({ status }) => <Text color={taskStatusColor(status)}>{status}</Text>
                }
            ]}

            records={tasks}
        />
    </>)
}

export default Tasks