import { useEffect } from "react"
import deviceService from "../../Services/device.service"
import { useNavigate } from "react-router-dom"
import { DeviceForm } from "../../Ultils/type"
import { Space, Input, Grid, Box, Title, Button, Group, ActionIcon, Tooltip } from "@mantine/core"
import {
    IconTrash
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const DeviceDetail = ({ device, getDevice }: { device: DeviceForm | null, getDevice: () => Promise<void> }) => {
    const navigate = useNavigate();

    const form = useForm<DeviceForm>({
        initialValues: {
            id: "",
            name: "",
            updateUTC: "",
            CH4_SN: "",
            PUMP_SN: "",
            CO2_SN: "",
            O2_SN: "",
        },
        validate: {
            name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        },
        // functions will be used to validate values at corresponding key
    });


    const updateDevice = async (data: DeviceForm) => {
        try {
            const { updateUTC, ...detail } = data
            await deviceService.editDevice(detail)
            await getDevice()
        }
        catch (error) {
            console.log(error)
        }
    }

    const deleteDevice = async () => {
        const id = device?.id
        if (id !== undefined) {
            try {
                await deviceService.deleteDevice(id)
                navigate('/device')
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    useEffect(() => {
        if (device) form.setValues(device)
    }, [device])


    return (<>
        <form onSubmit={form.onSubmit(updateDevice)}>
            <Group position="right">
                <Tooltip
                    label="Remove this Device"
                    color="red"
                >
                    <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={() => deleteDevice()}>
                        <IconTrash />
                    </ActionIcon >
                </Tooltip>
            </Group>
            <Title order={4} color="blue">INFORMATION</Title>
            <Space h="xl" />
            <Grid gutter='md' >
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
            </Grid>
            <Space h="xl" />
            <Space h="xl" />

            <Space h="xl" />


            <Title order={4} color="blue">DETAILS</Title>
            <Space h="xl" />

            <Grid gutter='md' >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper
                            
                            label="CH4 SN :"
                        >
                            <Input  size="md" {...form.getInputProps("CH4_SN")} />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper
                            
                            label="O2 SN :"
                        >
                            <Input  size="md" {...form.getInputProps("O2_SN")} />
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
                            <Input  size="md" {...form.getInputProps("CO2_SN")} />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box maw={440} >

                        <Input.Wrapper
                            id="PUMP_SN"
                            label="PUMP SN :"
                        >
                            <Input  size="md" {...form.getInputProps("PUMP_SN")} />
                        </Input.Wrapper>
                    </Box>

                </Grid.Col>
                <Grid.Col span={4}>
                </Grid.Col>

            </Grid>
            <Space h="xl" />
            <Button type="submit" mt="sm">
                Save Changes
            </Button>
        </form>

    </>)
}

export default DeviceDetail