import deviceService from "../../Services/device.service"
import { CalibrateSensorForm, DeviceForm } from "../../Ultils/type"
import { Space, Input, Grid, Box, Title, Button, NumberInput, Select, Text, Paper } from "@mantine/core"
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import { Loader } from '@mantine/core';

const DeviceSensors = ({ device }: { device: DeviceForm }) => {
    const form2 = useForm<CalibrateSensorForm>({
        initialValues: {
            calType: "",
            gasType: "",
            calValue: 1,
        },
        validate: {
            calType: (value) => (value.length < 1 ? 'Gas Type Sensor Type must be selected' : null),
            gasType: (value) => (value.length < 1 ? 'Cal Type Sensor Type must be selected' : null),
        },
    })

    const form3 = useForm<{ sensorType: string }>({
        initialValues: {
            sensorType: ""
        },
        validate: {
            sensorType: (value) => (value.length < 1 ? 'Sensor Type must be selected' : null),
        },
    })


    const calibrateSensor = useMutation({
        mutationFn: async (data: CalibrateSensorForm) => {
            const res = await deviceService.calibrateSensor(device.id, data)
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


    const readSensor = useMutation({
        mutationFn: async (data: { sensorType: string }) => {
            const res = await deviceService.readSensor(device.id, data.sensorType)
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


    return (<>
        <Grid gutter='md' >
            <Grid.Col span={4}>
                <form onSubmit={form3.onSubmit(data => readSensor.mutate(data))}>
                    <Space h="md" />
                    <Title color="blue" order={4}>READ</Title>
                    <Space h="md" />
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Sensor Type:"
                        >
                            <Select data={[
                                { value: 'CO2', label: 'CO2' },
                                { value: 'CH4', label: 'CH4' },
                                { value: 'O2', label: 'O2' },
                                { value: 'TEMP', label: 'TEMP' },
                                { value: 'RH', label: 'RH' },
                                { value: 'BAR', label: 'BAR' },
                            ]}
                                {...form3.getInputProps('sensorType')} size="md" />
                        </Input.Wrapper>
                    </Box>
                    <Space h="xl" />
                    <Button type="submit" disabled={readSensor.isLoading || calibrateSensor.isLoading}>Get</Button>
                </form>
            </Grid.Col>
            <Grid.Col span={2}>
            </Grid.Col>
            <Grid.Col span={4}>
                <Space h="xl" />
                <Space h="xl" />
                <Space h="xl" />
                {readSensor.isLoading && <Loader />}
                {readSensor.isSuccess &&
                    <Paper shadow="xs" p="md">
                        <Text>{readSensor.data}
                        </Text>
                    </Paper>

                }
            </Grid.Col>
        </Grid>
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
        <Grid gutter='md' >
            <Grid.Col span={4}>
                <form onSubmit={form2.onSubmit(data => calibrateSensor.mutate(data))}>
                    <Space h="md" />
                    <Title order={4} color="blue">CALIBRATE</Title>
                    <Space h="md" />
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Gas Type :"
                        >
                            <Select data={[
                                { value: 'CO2', label: 'CO2' },
                                { value: 'CH4', label: 'CH4' },
                            ]}
                                {...form2.getInputProps('gasType')} size="md" />
                        </Input.Wrapper>
                    </Box>
                    <Space h="xl" />

                    <Box maw={440} >

                        <Input.Wrapper

                            label="Cal Type :"
                        >
                            <Select data={[
                                { value: 'ZERO', label: 'ZERO' },
                                { value: 'SPAN', label: 'SPAN' },
                            ]}
                                {...form2.getInputProps('calType')} size="md" />
                        </Input.Wrapper>
                    </Box>
                    <Space h="xl" />
                    <Box maw={440} >

                        <Input.Wrapper

                            label="Cal Value :"
                        >
                            <NumberInput
                                precision={2}
                                step={0.05}
                                min={0}

                                {...form2.getInputProps('calValue')}
                                size="md" />
                        </Input.Wrapper>
                    </Box>
                    <Space h="xl" />

                    <Button type="submit" disabled={readSensor.isLoading || calibrateSensor.isLoading} >CALIBRATE</Button>
                </form>
            </Grid.Col>
            <Grid.Col span={2}>
            </Grid.Col>
            <Grid.Col span={4}>
                <Space h="xl" />
                <Space h="xl" />
                <Space h="xl" />
                {calibrateSensor.isLoading && <Loader />}
                {calibrateSensor.isSuccess &&
                    <Paper shadow="xs" p="md">
                        <Text>{calibrateSensor.data}</Text>
                    </Paper>

                }
            </Grid.Col>
        </Grid>
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
        <Space h="xl" />
    </>)
}

export default DeviceSensors
