import { useEffect } from "react"
import deviceService from "../../Services/device.service"
import { useNavigate } from "react-router-dom"
import { DeviceForm } from "../../Ultils/type"
import { Space, Input, Grid, Box, Title, Button, Group, ActionIcon, Tooltip, Text, Menu, Badge } from "@mantine/core"
import { IconPlayerPlay, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { deviceStatusColor } from "../../Ultils/colors"
import { showSuccessNotification, showErorNotification } from "../../Ultils/notification"
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { modals } from '@mantine/modals';

const DeviceDetail = ({ device }: { device: DeviceForm }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const form = useForm<DeviceForm>({
        initialValues: {
            id: "",
            name: "",
            updateUTC: "",
            lastCheck: "",
            CH4_SN: "",
            PUMP_SN: "",
            CO2_SN: "",
            O2_SN: "",
            assigned: false,
            status: ""
        },
        validate: {
            name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        },
        // functions will be used to validate values at corresponding key
    });

    const updateDevice = useMutation({
        mutationFn: async (data: DeviceForm) => {
            const { updateUTC, ...detail } = data
            return await deviceService.editDevice(detail)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device', device.id] })
            showSuccessNotification(`Device ${form.values.name} has been updated`)
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

    const deleteDevice = useMutation({
        mutationFn: async () => {
            return await deviceService.deleteDevice(device.id)

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device'] })
            navigate('/device')

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


    const pauseDevice = useMutation({
        mutationFn: async () => {
            return await deviceService.pauseDevice(device.id)

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device', device.id] })
            queryClient.invalidateQueries({ queryKey: ['device'] })
            showSuccessNotification(`Device ${form.values.name} has been paused`)

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


    const resumeDevice = useMutation({
        mutationFn: async () => {
            return await deviceService.resumeDevice(device.id)

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['device', device.id] })
            queryClient.invalidateQueries({ queryKey: ['device'] })
            showSuccessNotification(`Device ${form.values.name} has been resumed`)
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


    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete this device',
            centered: true,
            children: (
                <p>
                    Are you sure you want to delete this device

                </p>
            ),
            labels: { confirm: 'Delete device', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteDevice.mutate(),
        });






    const menuOptions = () => {

        if (form.values.status === "READY") {
            return <></>
        }
        return (
            <Menu.Dropdown>
                {
                    form.values.status === "RUNNING" && <Menu.Item color="orange" onClick={() => pauseDevice.mutate()} icon={<IconPlayerPause size="1rem" stroke={1} />}>
                        Pause
                    </Menu.Item>
                }
                {
                    form.values.status === "PAUSED" && <Menu.Item color="blue" onClick={() => resumeDevice.mutate()} icon={<IconPlayerPlay size="1rem" stroke={1} />}>
                        Resume
                    </Menu.Item>
                }
            </Menu.Dropdown>
        )
    }

    useEffect(() => {
        if (device) form.setValues(device)
    }, [device])


    return (<>
        <form onSubmit={form.onSubmit(data => updateDevice.mutate(data))}>
            <Group position="right">
                <Tooltip
                    label="Remove this Device"
                    color="red"
                >
                    <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={openDeleteModal}>
                        <IconTrash />
                    </ActionIcon >
                </Tooltip>
            </Group>
            <Title order={3} color="blue">INFORMATION</Title>
            <Space h="xl" />
            <Grid gutter='xl' >
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
                            <Input  {...form.getInputProps('name')} size="md" />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Last Update :"
                        >
                            <Input  {...form.getInputProps('updateUTC')} disabled size="md" />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                <Box maw={440} >
                        <Input.Wrapper

                            label="Last Check :"
                        >
                            <Input  {...form.getInputProps('lastCheck')} disabled size="md" />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Group noWrap spacing="xl">
                        <Text fw={500}>Status : </Text>
                        <Menu trigger="hover" openDelay={100} closeDelay={400}>
                            <Menu.Target>
                                <Badge size="lg" variant="light" color={deviceStatusColor(form.values.status)}>{form.values.status}</Badge >
                            </Menu.Target>
                            {menuOptions()}
                        </Menu>
                    </Group>
                </Grid.Col>


            </Grid>
            <Space h="xl" />
            <Space h="xl" />

            <Space h="xl" />


            <Title order={3} color="blue">DETAILS</Title>
            <Space h="xl" />

            <Grid gutter='xl' >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="CH4 SN :"
                        >
                            <Input size="md" {...form.getInputProps("CH4_SN")} />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper

                            label="O2 SN :"
                        >
                            <Input size="md" {...form.getInputProps("O2_SN")} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            id="CO2_SN"
                            label="CO2 SN :"
                        >
                            <Input size="md" {...form.getInputProps("CO2_SN")} />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper
                            id="PUMP_SN"
                            label="PUMP SN :"
                        >
                            <Input size="md" {...form.getInputProps("PUMP_SN")} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>

            </Grid>
            <Space h="xl" />
            <Button disabled={updateDevice.isLoading} type="submit" mt="sm">
                Save Changes
            </Button>
        </form>

    </>)
}

export default DeviceDetail