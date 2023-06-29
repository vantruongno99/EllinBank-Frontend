import { useState, useEffect } from "react"
import taskService from "../../Services/task.service"
import { DeviceInfo, TaskForm } from "../../Ultils/type"
import { Space, Box, Anchor, Text, Button, Group, } from "@mantine/core"
import TaskDevicesAssign from "./TaskDevicesAssign"
import { deviceStatusColor } from "../../Ultils/colors"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import sortBy from 'lodash/sortBy';



const TaskDevices = ({ devices, task }: { devices: DeviceInfo[], task: TaskForm }) => {
    const [table, setTable] = useState<DeviceInfo[]>([])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [selection, setSelection] = useState<DeviceInfo[]>([]);
    const queryClient = useQueryClient()


    useEffect(() => {
        const data = sortBy(table, sortStatus.columnAccessor) as DeviceInfo[];
        setTable(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    useEffect(() => {
        setTable(devices)
    }, [devices])



    const unAssignTask = useMutation({
        mutationFn: async () => {
            for (const device of selection) {
                await taskService.unassignTask(task.id, device.id)
            }
            return
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            setSelection([])
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

  

    const tableProp = task?.status !== "COMPLETED" ? {
        selectedRecords: selection,
        onSelectedRecordsChange: setSelection
    } : {}



    return (<>
        <Box pt={20} >
            <Group position="apart">
                <Text fz="lg">Assigned Devices :</Text>
               {task.status !== "COMPLETED" && <TaskDevicesAssign task={task}/>}

            </Group>
            <Space h="xl" />

            <DataTable
                minHeight={table.length === 0 ? 150 : 0}
                verticalAlignment="center"
                withBorder
                borderRadius={5}
                {...tableProp}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                sortIcons={{
                    sorted: <IconChevronUp size={14} />,
                    unsorted: <IconSelector size={14} />,
                }}
                columns={[
                    {
                        accessor: 'id',
                        title: 'Device No',
                        sortable: true,
                        render: ({ id }) =>
                            <Anchor href={`/device/${id}`} target="_blank">
                                {id}
                            </Anchor>

                    },
                    {
                        accessor: 'name',
                        sortable: true,
                    },
                    {
                        accessor: 'status',
                        sortable: true,
                        render: ({ status }) => <Text color={deviceStatusColor(status)}>{status}</Text>
                    },

                ]}
                records={table}
            />
            <Space h="xl" />
            {
                selection.length !== 0 && <Button color="red" onClick={() => unAssignTask.mutate()}>
                    Remove
                </Button>
            }
        </Box>

    </>)
}

export default TaskDevices