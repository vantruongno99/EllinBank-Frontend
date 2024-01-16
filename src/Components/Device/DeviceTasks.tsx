
import React, { useState, useEffect } from "react"
import { TaskInfo } from "../../Ultils/type"
import { Box, Anchor, Text, Group, Tooltip } from "@mantine/core"
import moment from "moment"
import { taskStatusColor } from "../../Ultils/colors"
import { IconChevronUp, IconSelector, IconAlertTriangle } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy'


const DeviceTasks = ({ tasks }: { tasks: TaskInfo[] }) => {
    const [table, setTable] = useState<TaskInfo[]>([])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });


    useEffect(() => {
        const data = sortBy(table, sortStatus.columnAccessor) as TaskInfo[];
        setTable(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    useEffect(() => {
        setTable(tasks)
    }, [tasks])

    return (<>
        <Box p={20} >
            <DataTable
                height={600}
                minHeight={table.length === 0 ? 150 : 0}
                withBorder
                borderRadius={5}
                verticalAlignment="center"
                fontSize="md"
                sortStatus={sortStatus}
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
                            <Anchor href={`/task/${id}`} target="_blank">
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
                        accessor: 'createUser',
                        sortable: true,
                    },
                    {
                        accessor: 'status',
                        sortable: true,
                        render: ({ status }) => <Text color={taskStatusColor(status)}>{status}</Text>
                    }
                ]}
                records={table}
            />
        </Box>
    </>)

}

export default DeviceTasks
