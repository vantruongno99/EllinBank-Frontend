import { useEffect } from "react"
import taskService from "../../Services/task.service"
import { useNavigate } from "react-router-dom"
import { EditTaskInput, TaskInfo, TaskForm } from "../../Ultils/type"
import { Space, Input, Grid, Box, Title, NumberInput, Text, Button, Menu, Group, ActionIcon, Badge, Tooltip } from "@mantine/core"
import { IconCircleCheck, IconPlayerPlay, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { taskStatusColor } from "../../Ultils/colors"
import { showErorNotification, showSuccessNotification } from "../../Ultils/notification"

const TaskDetail = ({ getTask, task }: { getTask: () => Promise<void>, task: TaskForm | undefined }) => {
    const navigate = useNavigate();
    const form = useForm<TaskForm>(
        {
            initialValues: task,
            validate: {
                name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
                logPeriod: (value) => (value < 0 ? 'You must be at least 18 to register' : null),
                endTime: (value, values) => (new Date(value) < new Date(values.startTime) ? "End Date must greater than Start Date" : null),
            },
        }
    );

    useEffect(() => {
        if (task) form.setValues(task)
    }, [task])



    const handleUpdate = async (data: TaskForm) => {
        const id = task?.id
        if (id !== undefined) {
            try {
                const input: EditTaskInput = {
                    endTime: new Date(data.endTime),
                    id: data.id,
                    name: data.name,
                    logPeriod: data.logPeriod
                }
                const res: TaskInfo | undefined = await taskService.updateTask(input)
                await getTask()
                showSuccessNotification(`Task ${form.values.name} has been updated`)
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


    const handleComplete = async () => {
        const id = task?.id
        if (id !== undefined) {
            try {
                await taskService.completeTask(id)
                getTask()
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

    const handleDelete = async () => {
        const id = task?.id
        if (id !== undefined) {
            try {
                await taskService.deleteTask(id)
                navigate('/task')
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

    const handleResume = async () => {
        const id = task?.id
        if (id !== undefined) {
            try {
                await taskService.resumeTask(id)
                getTask()
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
    const handlePause = async () => {
        const id = task?.id
        if (id !== undefined) {
            try {
                await taskService.pauseTask(id)
                getTask()
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



    const menuOptions = () => {

        if (form.values.status === "COMPLETED") {
            return <></>
        }
        return (
            <Menu.Dropdown>
                {
                    form.values.status === "ONGOING" && <Menu.Item color="orange" onClick={() => handlePause()} icon={<IconPlayerPause size="2rem" stroke={1} />}>
                        Pause
                    </Menu.Item>
                }
                {
                    form.values.status === "PAUSED" && <Menu.Item color="blue" onClick={() => handleResume()} icon={<IconPlayerPlay size="2rem" stroke={1} />}>
                        Resume
                    </Menu.Item>
                }
                <Menu.Item color="green" onClick={() => handleComplete()} icon={<IconCircleCheck size="2rem" stroke={1.5} />}>
                    Complete
                </Menu.Item>
            </Menu.Dropdown>
        )
    }

    return (
        <form onSubmit={form.onSubmit(handleUpdate)} >
            <Group position="right">
                <Tooltip
                    label="Delete this task"
                    color="red"
                >
                    <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={() => handleDelete()}>
                        <IconTrash />
                    </ActionIcon >
                </Tooltip>
            </Group>
            <Title order={3} color="blue">INFORMATION</Title>
            <Space h="xl" />
            <Grid gutter="xl" >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            label="ID :"
                        >
                            <Input   {...form.getInputProps('id')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper

                            label="Name :"
                        >
                            <Input  {...form.getInputProps('name')} size="md" disabled={form.values.status === "COMPLETED"} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Start Date :"
                        >
                            <DateTimePicker
                                placeholder="Start Date"
                                disabled
                                {...form.getInputProps('startTime')}
                                size="md"

                            />
                        </Input.Wrapper>

                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="End Date :"
                        >
                            <DateTimePicker
                                placeholder="End Date"
                                {...form.getInputProps('endTime')}
                                size="md"
                                disabled={form.values.status === "COMPLETED"}
                            />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Group noWrap spacing="xl">
                        <Text fw={500}>Status : </Text>
                        <Menu trigger="hover" position="right-start" openDelay={100} closeDelay={400}>
                            <Menu.Target>
                                <Badge size="lg" variant="dot" color={taskStatusColor(form.values.status)}>{form.values.status}</Badge >
                            </Menu.Target>
                            {menuOptions()}
                        </Menu>
                    </Group>
                </Grid.Col>
            </Grid>
            <Space h="xl" />
            <Space h="xl" />
            <Title order={3} color="blue">DETAIL</Title>
            <Space h="xl" />

            <Grid gutter="xl" >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            id="PUMP_SN"
                            label="Created At :"                        >
                            <DateTimePicker
                                placeholder="createdUTC"
                                disabled
                                {...form.getInputProps('createdUTC')}
                                size="md"
                            />
                        </Input.Wrapper>

                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper

                            label="Created By :"
                        >
                            <Input disabled size="md" {...form.getInputProps("createUser")} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            id="PUMP_SN"
                            label="Completed At :"                        >
                            <DateTimePicker
                                {...form.getInputProps('completedUTC')}
                                disabled
                                size="md"
                            />
                        </Input.Wrapper>

                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper
                            id="PUMP_SN"
                            label="Completed By :"
                        >
                            <Input disabled size="md" {...form.getInputProps("completeUser")} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>

            </Grid>
            <Space h="xl" />
            <Space h="xl" />
            <Title order={3} color="blue">PROFILE</Title>
            <Space h="xl" />

            <Grid gutter='md' >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Period :"
                        >
                            <NumberInput

                                size="md" {...form.getInputProps("logPeriod")}
                                max={5}
                                min={0}
                                disabled={form.values.status === "COMPLETED"}
                            />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>

            </Grid>
            <Space h="xl" />
            {form.values.status !== "COMPLETED" &&
                <Button type="submit" mt="sm">
                    Save Changes
                </Button>
            }
        </form>)
}

export default TaskDetail