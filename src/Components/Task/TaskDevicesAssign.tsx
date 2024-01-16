import { useState, useEffect } from "react"
import { DeviceInfo, TaskForm } from "../../Ultils/type"
import { Space, Box, Tooltip, Text, Button, Group, ActionIcon, Modal } from "@mantine/core"
import { IconCirclePlus } from '@tabler/icons-react';
import deviceService from "../../Services/device.service"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import taskService from "../../Services/task.service";
import handleFunctionError from "../../Ultils/handleFunctionError";
const TaskDevicesAssign = ({ task }: { task: TaskForm }) => {
    const [table, setTable] = useState<DeviceInfo[]>([])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [selection, setSelection] = useState<DeviceInfo[]>([]);
    const [opened, setOpened] = useState<boolean>(false)
    const queryClient = useQueryClient()


    useEffect(() => {
        const data = sortBy(table, sortStatus.columnAccessor) as DeviceInfo[];
        setTable(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);


    const assignTask = useMutation({
        mutationFn: async () => {
            if (selection.length > 0) {
                for (const device of selection) {
                    await taskService.assignTask(task.id, device.id)
                }
            }

            return
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            setSelection([])
            setOpened(false)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['device', 'availble', task.id],
        initialData: [],
        queryFn: async () => {
            const res: DeviceInfo[] | undefined = await deviceService.getAvaibleDeviceByTime()
            if (!res) {
                throw new Error()
            }
            return res
        },
        enabled: opened,
        onSuccess: (data) => {
            setTable(data)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })


    return (<>
        <Box p={20} >
            <Tooltip
                label="Assign sensors to this task"
                color="dark"
            >
                <ActionIcon color="blue" size="lg" radius="xl" variant="light" onClick={() => {
                    setOpened(true)
                    setSelection([])
                }}>
                    <IconCirclePlus />
                </ActionIcon >
            </Tooltip>

            <Modal title="Available Sensors" opened={opened} onClose={() => setOpened(false)} withCloseButton={false} centered>
                {table.length !== 0 ? <DataTable
                    height={600}
                    minHeight={table.length === 0 ? 150 : 0}
                    verticalAlignment="center"
                    selectedRecords={selection}
                    onSelectedRecordsChange={setSelection}
                    withBorder
                    borderRadius={5}
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
                            sortable: true
                        },
                        {
                            accessor: 'name',
                            sortable: true,
                        },


                    ]}
                    records={table}
                /> : <Text color="red">
                    No Device Avaiavle
                </Text>
                }
                <Space h="xl" />
                <Group position="right">
                    <Button disabled={selection.length === 0} onClick={() => assignTask.mutate()}>
                        Assign
                    </Button>
                </Group>
            </Modal>
        </Box>

    </>)
}

export default TaskDevicesAssign