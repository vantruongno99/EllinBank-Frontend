import React, { useState, useEffect } from "react"
import taskService from "../../Services/task.service";
import { TaskInfo } from "../../Ultils/type"
import { Anchor, Button, Group, Space, Tooltip, Text, Loader, ActionIcon, Title } from '@mantine/core'
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
import handleFunctionError from "../../Ultils/handleFunctionError";




const Tasks = () => {

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
            handleFunctionError(e)
        },
    })
    if (isLoading) return <Loader />

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <>
            <Title order={3} color="blue">TASK LIST</Title>
            <Space h="xl" />
            <TaskTable data={data} isLoading={isLoading} />

        </>
    )
}

const PAGE_SIZE = 20;


const TaskTable = ({ data, isLoading }: { data: TaskInfo[], isLoading: boolean }) => {
    const [tasks, setTasks] = useState<TaskInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(tasks.slice(0, PAGE_SIZE));

    useEffect(() => {
        setTasks(data)
        setRecords(data.slice(0, PAGE_SIZE))
    }, [data])


    useEffect(() => {
        const data = sortBy(tasks, sortStatus.columnAccessor) as TaskInfo[];
        setTasks(sortStatus.direction === 'desc' ? data.reverse() : data);
        setRecords(data.slice(0, PAGE_SIZE))
        setPage(1)
    }, [sortStatus]);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(tasks.slice(from, to));
    }, [page]);



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
            records={records}
            totalRecords={tasks.length}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
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
                    render: ({ id , name }) =>
                    <Anchor href={`${location.pathname}/${id}`} target="_blank">
                        {name}
                    </Anchor>


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
                    render: ({ endTime, status }) => (
                        <Group position="left">
                            {moment(endTime).format('DD/MM/yyyy HH:mm')}
                            {status !== "COMPLETED" && (new Date(endTime) < new Date()) && <Tooltip label="Delayed" color="orange"><IconAlertTriangle color="orange" /></Tooltip>}
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

        />
    </>)
}

export default Tasks