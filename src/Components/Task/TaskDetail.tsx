import { useEffect } from "react"
import taskService from "../../Services/task.service"
import { useNavigate } from "react-router-dom"
import { EditTaskInput, TaskInfo, TaskForm } from "../../Ultils/type"
import { Space, Input, Grid, Box, Title, NumberInput, Text, Button, Menu, Group, ActionIcon, Badge, Tooltip, Textarea } from "@mantine/core"
import { IconCircleCheck, IconPlayerPlay, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { taskStatusColor } from "../../Ultils/colors"
import { showSuccessNotification } from "../../Ultils/notification"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { modals } from '@mantine/modals';
import handleFunctionError from "../../Ultils/handleFunctionError"

const TaskDetail = ({ task }: { task: TaskForm }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const form = useForm<TaskForm>(
        {
            initialValues: task,
            validate: {
                name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
                logPeriod: (value) => (value < 0 ? 'value must be more than 0' : null),
                flowRate: (value) => (value < 0 ? 'value must be more than 0' : null),
                endTime: (value, values) => (new Date(value) < new Date(values.startTime) ? "End Date must greater than Start Date" : null),
            },
        }
    );

    useEffect(() => {
        if (task) form.setValues({ ...task, flowRate: Number(task.flowRate) })
    }, [task])

    if (!task) {
        return <>404</>
    }


    const updateTask = useMutation({
        mutationFn: async (data: TaskForm) => {
            const input: EditTaskInput = {
                endTime: new Date(data.endTime),
                id: data.id,
                name: data.name,
                logPeriod: data.logPeriod,
                comment: data.comment,
                flowRate: data.flowRate
            }
            return await taskService.updateTask(input)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            showSuccessNotification(`Task ${form.values.name} has been updated`)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })


    const completeTask = useMutation({
        mutationFn: async () => {
            return await taskService.completeTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            showSuccessNotification(`Task ${form.values.name} has been completed`)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const deleteTask = useMutation({
        mutationFn: async () => {
            return await taskService.deleteTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task'] })
            queryClient.removeQueries({ queryKey: ['task', task.id] })
            showSuccessNotification(`Task ${form.values.name} has been deleted`)
            navigate('/task')
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const resumeTask = useMutation({
        mutationFn: async () => {
            return await taskService.resumeTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            showSuccessNotification(`Task ${form.values.name} has been resumed`)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })


    const pauseTask = useMutation({
        mutationFn: async () => {
            return await taskService.pauseTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', task.id] })
            showSuccessNotification(`Task ${form.values.name} has been paused`)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const openDeleteModal = () =>
        modals.open({
            title: 'Delete this task',
            centered: true,
            children: (<>
                <p>
                    Are you sure you want to delete this task

                </p>
                <Group position="right">
                    <Button color="red" onClick={async () => {
                        await deleteTask.mutateAsync()
                        modals.closeAll()
                    }
                    } mt="md">
                        Yes
                    </Button>
                </Group>

            </>
            )
        })



    const menuOptions = () => {

        if (form.values.status === "COMPLETED") {
            return <></>
        }
        return (
            <Menu.Dropdown>
                {
                    form.values.status === "ONGOING" && <Menu.Item color="orange" onClick={() => pauseTask.mutate()} icon={<IconPlayerPause size="2rem" stroke={1} />}>
                        Pause
                    </Menu.Item>
                }
                {
                    form.values.status === "PAUSED" && <Menu.Item color="blue" onClick={() => resumeTask.mutate()} icon={<IconPlayerPlay size="2rem" stroke={1} />}>
                        Resume
                    </Menu.Item>
                }
                <Menu.Item color="green" onClick={() => completeTask.mutate()} icon={<IconCircleCheck size="2rem" stroke={1.5} />}>
                    Complete
                </Menu.Item>
            </Menu.Dropdown>
        )
    }

    return (
        <form onSubmit={form.onSubmit(data => updateTask.mutate(data))} >
            <Group position="right">
                <Tooltip
                    label="Delete this task"
                    color="red"
                >
                    <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={openDeleteModal}>
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
                            label="Company :"
                        >
                            <Input  {...form.getInputProps('company')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={8}>
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
                                <Badge size="lg" variant="light" color={taskStatusColor(form.values.status)}>{form.values.status}</Badge >
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
                                placeholder={""}
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
            <Title order={3} color="blue">CONFIG</Title>
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
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            label="Flow rate :"
                        >
                            <NumberInput
                                size="md"
                                {...form.getInputProps("flowRate")}
                                precision={1}
                                min={0}
                                step={0.5}
                                max={4}
                                disabled={form.values.status === "COMPLETED"}
                            />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>

            </Grid>


            <Space h="xl" />
            <Space h="xl" />
            <Title order={3} color="blue">COMMENT</Title>
            <Space h="xl" />

            <Grid gutter='md' >
                <Grid.Col span={8}>
                    <Input.Wrapper

                    >
                        <Textarea

                            size="md"
                            {...form.getInputProps("comment")}
                            disabled={form.values.status === "COMPLETED"}
                            autosize
                            minRows={3}
                        />
                    </Input.Wrapper>
                </Grid.Col>

            </Grid>
            <Space h="xl" />
            {form.values.status !== "COMPLETED" &&
                <Button type="submit" mt="sm" disabled={updateTask.isLoading}>
                    Save Changes
                </Button>
            }
        </form>)
}

export default TaskDetail