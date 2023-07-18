import React, { useState, useEffect } from "react"
import { useForm, isNotEmpty } from '@mantine/form';
import { NumberInput, TextInput, Button, Box, Space, Grid, createStyles, Table, Checkbox, Group, rem, Title, Input, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import taskService from "../../Services/task.service";
import deviceService from "../../Services/device.service";
import { useError } from "../../Hook";
import { useNavigate } from "react-router-dom";
import { CompanyInfo, TaskInfo, TaskInput } from "../../Ultils/type";
import { DeviceInfo } from "../../Ultils/type";
import { DataTable } from 'mantine-datatable';
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import companyService from "../../Services/company.service";
import Cookies from "js-cookie";
import userService from "../../Services/user.service";

const CreateTask = () => {
    const [selection, setSelection] = useState<DeviceInfo[]>([]);
    const errorMessage = useError()
    const navigate = useNavigate();
    const queryClient = useQueryClient()





    const form = useForm({
        validateInputOnChange: true,
        initialValues: { name: '', logPeriod: 1, startTime: new Date, endTime: new Date, company: "" },
        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
            logPeriod: (value) => (value < 0 ? 'You must be at least 18 to register' : null),
            startTime: (value) => (new Date(new Date(value).getTime() + 5 * 60 * 1000) < new Date ? "Date must be in future" : null),
            endTime: (value, values) => (new Date(value) < new Date(values.startTime) ? "End Date must greater than Start Date" : null),
            company: isNotEmpty("Company is required")
        },
    });


    const createTask = useMutation({
        mutationFn: async (input: TaskInput) => {
            const output = await taskService.createTask(input)
            if (!output) {
                throw new Error()
            }
            return output
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

    const assignTask = useMutation({
        mutationFn: async (input: {
            taskId: number,
            deviceId: string
        }) => {
            return await taskService.assignTask(input.taskId, input.deviceId)
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

    const newTask = async (data: TaskInput) => {
        const res = await createTask.mutateAsync(data)
        selection.length !== 0 && selection.forEach(async (a) => {
            await assignTask.mutateAsync({
                taskId: res.id,
                deviceId: a.id
            })
        })
        navigate(`/task/${res.id}`)
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
                form.setFieldValue("company", data.company)
            }
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

    const deviceQuery = useQuery({
        queryKey: ['device', 'available'],
        initialData: [],
        queryFn: async () => {
            const res: DeviceInfo[] | undefined = await deviceService.getAvaibleDeviceByTime()
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
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
    })

    const companyOption = companyQuery.data.map(a => ({
        value: a.name,
        label: a.name
    })
    )


    return (
        <>
            <Grid gutter="lg">
                <Grid.Col span={4}>
                    <Title order={3}>Details</Title>
                    <Space h="xl" />
                    <Box maw={320}>
                        <form onSubmit={form.onSubmit(newTask)}>
                            <Input.Wrapper
                                label="Name" placeholder="Name"
                            >
                                <TextInput  {...form.getInputProps('name')} />
                            </Input.Wrapper>

                            <Space h="xs" />
                            <Input.Wrapper
                                label="Company :" placeholder="Company"
                            >
                                <Select data={companyOption}
                                    disabled={userQuery?.data?.role !== "admin"}
                                    {...form.getInputProps('company')} size="md" />
                            </Input.Wrapper>
                            <Space h="xs" />

                            <Input.Wrapper
                                label="Log Period :"
                                placeholder="Log Period">
                                <NumberInput
                                    min={0}
                                    max={30}
                                    {...form.getInputProps('logPeriod')}
                                />
                            </Input.Wrapper>
                            <Space h="xs" />

                            <DateTimePicker
                                placeholder="Start Date"
                                label="Start Date "
                                withAsterisk
                                {...form.getInputProps('startTime')}
                            />
                            <Space h="xs" />

                            <DateTimePicker
                                placeholder="End Date"
                                label="End Date"
                                withAsterisk
                                {...form.getInputProps('endTime')}
                            />

                            <Space h="md" />
                            <Button type="submit" disabled={Object.keys(form.errors).length !== 0 || createTask.isLoading} mt="sm">
                                Submit
                            </Button>
                            <Space h="md" />

                            {errorMessage.value}
                        </form>
                    </Box>
                </Grid.Col>
                <Grid.Col span={1}>
                </Grid.Col>

                <Grid.Col span={7}>
                    <Box maw={400}>
                        <Title order={3}>Available Sensors</Title>
                        <Space h="xl" />
                        <Space h="lg" />
                        <DataTable
                            minHeight={deviceQuery.data.length === 0 ? 150 : 0}
                            verticalAlignment="center"
                            withBorder
                            borderRadius={5}
                            records={deviceQuery.data}
                            selectedRecords={selection}
                            onSelectedRecordsChange={setSelection}
                            columns={[
                                { accessor: 'id' },
                                { accessor: 'name' },
                            ]}
                        />
                    </Box>

                </Grid.Col>
            </Grid>

        </>
    )
}

export default CreateTask