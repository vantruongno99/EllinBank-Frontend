import React, { useState, useEffect } from "react"
import userService from "../Services/user.service";
import companyService from "../Services/company.service";
import { useForm, matchesField, isNotEmpty } from '@mantine/form';
import { Space, Input, Box, Button, Text, PasswordInput, Tooltip, Loader, Select, Grid, Title, Anchor, Group, Stack, createStyles } from "@mantine/core"
import { ChangePasswordForm, CompanyInfo, DeviceInfo, Log, TaskInfo } from "../Ultils/type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import handleFunctionError from "../Ultils/handleFunctionError";
import { DateTimePicker } from "@mantine/dates";
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { taskStatusColor } from "../Ultils/colors";
import taskService from "../Services/task.service";
import { Parser } from '@json2csv/plainjs';
import JSZip from "jszip";
import { saveAs } from 'file-saver';



interface submitOption {
    from: Date | null,
    to: Date | null,
    company: string
}

interface DataOutput {
    Task: TaskInfo,
    Log: Log[]
}

const Export = () => {
    const [input, setInput] = useState<TaskInfo[]>([])
    const [data, setData] = useState<TaskInfo[]>([])

    const exportForm = useForm({
        validateInputOnChange: true,
        initialValues: { from: null, to: null, company: "" },
        // functions will be used to validate values at corresponding key
        validate: {
            company: isNotEmpty("Company is required"),
            to: (value, values) => (value && values.from && new Date(value) < new Date(values.from)) ? "To Date must be later than From Date" : null,

        },
    });

    const handleDownload = async (data: DataOutput[]) => {
        try {
            let zip = new JSZip
            for (const d of data) {
                // Ignore the task without registerd devices 
                if (d.Log.length !== 0) {
                    const opts = {};
                    const parser = new Parser(opts);
                    const csv = parser.parse(d.Log);
                    const blob = new Blob([csv], { type: "text/plain" });
                    zip.file(`${d.Task.id}-${d.Task.name}.csv`, blob);
                }
            }

            zip.generateAsync({ type: "blob" })
                .then((content) => {
                    saveAs(content, `${exportForm.values.company}.zip`);
                });
        }
        catch (e) {
            handleFunctionError(e)
        }
    }


    const userQuery = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await userService.getCurrentUser()
            if (!res) {
                throw new Error()
            }
            return res
        },
        onSuccess(data) {
            if (data.role !== "admin") {
                exportForm.setFieldValue("company", data.company)
            }
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })


    const companyQuery = useQuery({
        queryKey: ['company'],
        initialData: [],
        queryFn: async () => {
            const res: CompanyInfo[] | undefined = await companyService.getAllCompany()
            if (!res) {
                throw new Error()
            }
            return res
        },
        onError: (e) => {
            handleFunctionError(e)
        }
    })

    const taskQuery = useQuery({
        queryKey: ['data', exportForm.values.company, exportForm.values.from, exportForm.values.to],
        queryFn: async () => {
            const from = exportForm.values.from as string | null
            const to = exportForm.values.to as string | null
            const option = {
                ...(from && { from: from }),
                ...(to && { to: to }),
            }
            const output = await companyService.getCompanyInfo(exportForm.values.company, option)
            return output
        },
        onSuccess(data) {
            setInput(data.Tasks)
            setData(data.Tasks)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
        enabled: !!exportForm.values.company
    })

    const companyOption = companyQuery.data.map(a => ({
        value: a.name,
        label: a.name
    })
    )




    const saveData = useMutation({
        mutationFn: async () => {
            const output: DataOutput[] = []
            for (const task of input) {
                let option : {deviceList? : string} = {}
                const allDevices = data.find(a => a.id === task.id)?.Device.map(a => a.Device.id) 
                const selectedDevices = task.Device.map(a => a.Device.id)
                if(allDevices && allDevices?.length !== selectedDevices.length){
                        option.deviceList = JSON.stringify(selectedDevices)
                }
                const log = await taskService.getLogs(task.id, option)
                output.push({
                    Task: task,
                    Log: log ? log : []
                })
            }

            return output
        },
        onSuccess: (data) => {
            handleDownload(data)
        }
        ,
        onError: (e) => {
            handleFunctionError(e)
        },
        retry: false
    })


    return (
        <>
            <form >

                <Grid gutter="lg">
                    <Grid.Col span={4}>
                        <Title order={3} color='blue'>EXPORT DATA</Title>
                        <Space h="xl" />
                        <Box maw={320}>
                            <Input.Wrapper
                                label="Company :" placeholder="Company" withAsterisk
                            >
                                <Select data={companyOption}
                                    disabled={userQuery?.data?.role !== "admin"}
                                    {...exportForm.getInputProps('company')} size="sm" />
                            </Input.Wrapper>
                            <Space h="xs" />
                            <DateTimePicker
                                clearable
                                label="From :"
                                {...exportForm.getInputProps('from')}
                            />
                            <Space h="xs" />
                            <DateTimePicker
                                clearable
                                label="To :"
                                {...exportForm.getInputProps('to')}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
                <Box >
                    {taskQuery.isSuccess && <TaskTable data={taskQuery.data.Tasks} isLoading={false} setInput={setInput} />}
                </Box>
                <Space h="xl" />
                <Button onClick={() => saveData.mutateAsync()} disabled={saveData.isLoading} mt="sm">
                    Submit  {saveData.isLoading && <>&nbsp; <Loader size="sm" /> </>}
                </Button>
            </form >
        </>
    )
}



const TaskTable = ({ data, isLoading, setInput }: { data: TaskInfo[], isLoading: boolean, setInput: React.Dispatch<React.SetStateAction<TaskInfo[]>> }) => {
    const [tasks, setTasks] = useState<TaskInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [selection, setSelection] = useState<TaskInfo[]>([]);

    useEffect(() => {
        const data = sortBy(tasks, sortStatus.columnAccessor) as TaskInfo[];
        setTasks(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    const handleSelection = (data: TaskInfo[]) => {
        setSelection(data)
        setInput(data)
    }

    useEffect(() => {
        setTasks(data)
    }, [data])

    const handleDeviceSelection = (task: TaskInfo, devices: DeviceInfo[]) => {
        const selected = {
            ...task,
            Device: devices.map(a => ({
                Device: a
            }))

        }
        const newList = selection.map(a => a.id == selected.id ? selected : a)
        if (selected.Device.length === 0) {
            setSelection(selection => selection.filter(a => a.id !== selected.id))
        }
        setInput(newList)
    }


    return (
        <>
            <Space h="xl" />
            <Space h="xl" />
            <DataTable
                isRecordSelectable={(record) => record.Device.length > 0}
                minHeight={tasks.length === 0 ? 150 : 0}
                withBorder
                borderRadius={5}
                selectedRecords={selection}
                onSelectedRecordsChange={handleSelection}
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
                    },
                    {
                        accessor: 'name',
                        title: 'Name',
                        sortable: true,

                    },
                    {
                        accessor: 'status',
                        sortable: true,
                        render: ({ status }) => <Text color={taskStatusColor(status)}>{status}</Text>
                    }
                ]}

                records={tasks}

                rowExpansion={{
                    allowMultiple: true,
                    content: ({ record }) => {
                        return (<>
                            <DeviceTable selected={selection.some(a => a.id === record.id)} task={record} selectedTask={selection} handleDeviceSelection={handleDeviceSelection} />
                        </>

                        )
                    },
                }}
            />
        </>


    )
}

const useStyles = createStyles((theme) => ({
    table: {
        marginLeft: 20
    },
}));


const DeviceTable = ({ task, selectedTask, handleDeviceSelection, selected }: { task: TaskInfo, selectedTask: TaskInfo[], handleDeviceSelection: (task: TaskInfo, devices: DeviceInfo[]) => void, selected: boolean }) => {
    const devices = task.Device.map(a => a.Device)
    const [selection, setSelection] = useState<DeviceInfo[]>(devices);
    const { classes } = useStyles();


    useEffect(() => {
        if (selectedTask.some(select => select.id === task.id)) {
            setSelection(devices)
        }
        else {
            setSelection([])
        }
    }, [selectedTask])

    const onRowSelect = (data: DeviceInfo[]) => {
        handleDeviceSelection(task, data)
        setSelection(data)
    }


    return (
        <>
            <DataTable
                minHeight={devices.length === 0 ? 150 : 0}
                noHeader
                className={classes.table}
                verticalAlignment="center"
                fontSize="md"
                selectedRecords={selection}
                onSelectedRecordsChange={onRowSelect}
                columns={[
                    { accessor: 'name' },
                    { accessor: 'name1' },
                    { accessor: 'name2' },
                    { accessor: 'name3' },
                    { accessor: 'name4' },
                    { accessor: 'name5' },

                ]}
                records={devices}
                isRecordSelectable={(record) => selected}

            />
        </>


    )
}

export default Export