import { useEffect, useState, useRef } from "react";
import { TaskForm } from "../../Ultils/type"
import { showErorNotification } from "../../Ultils/notification";
import taskService from "../../Services/task.service";
import deviceService from "../../Services/device.service";
import { Box, Checkbox, Space, Select, Loader, Group, Tooltip, ActionIcon } from "@mantine/core";
import { Log } from "../../Ultils/type";
import { CSVLink, CSVDownload } from "react-csv";
import {
    IconFileDownload
} from '@tabler/icons-react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Boost from 'highcharts/modules/boost';
import { useQuery } from "@tanstack/react-query";
//@ts-ignore

interface DeviceIdName {
    id: string,
    name: string
}


Boost(Highcharts);


const TaskLog = ({ task }: { task: TaskForm }) => {
    const [checked, setChecked] = useState<boolean>(false)
    const [select, setSelect] = useState<string | null>(null);


    const { data: devices ,isSuccess : isSuccessDevices} = useQuery({
        queryKey: ['device'],
        queryFn: async () => {
            const res = await deviceService.getAllDevices()
            if (!res) {
                throw new Error()
            }
            const list = res.map(a => ({
               id :  a.id,
                name : a.name
            }))
            return list
        },
        onError: (e) => {
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
        ...(checked && { refetchInterval: 5 * 60 * 1000 })
    })



    const { isLoading, data, isSuccess } = useQuery({
        queryKey: ['task', select],
        queryFn: async () => {
            const res = await taskService.getLogsByType(task?.id, select as string)
            if (!res) {
                throw new Error()
            }
            if (res.length === 0) {
                throw new Error("No data recorded")
            }
            return res
        },
        enabled: !!select && !!devices,
        onError: (e) => {
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
        ...(checked && { refetchInterval: 5 * 60 * 1000 })
    })



    return (
        <>
            <Space h="sm" />
            <Group position="apart" spacing="xs" mx="1rem">
                <Box maw={300} >
                    <Select
                        label="Select a type"
                        placeholder="Pick one"
                        value={select} onChange={setSelect}
                        data={[
                            { value: 'test', label: 'Test' },
                            { value: 'CO2', label: 'CO2' },
                            { value: 'CH4', label: 'CH4' },
                            { value: 'O2', label: 'O2' },
                        ]}
                    />
                    <Space h="sm" />
                    {task?.status !== "COMPLETED" && <Checkbox
                        checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}
                        label="Auto Refresh"
                    />}
                </Box>

                {isSuccess && data.length > 0 &&
                    <CSVLink
                        data={data}
                        filename={`${task?.id}-${select}.csv`}
                    >
                        <Tooltip label="Download as CSV">
                            <ActionIcon color="blue" size="xl" radius="lg" variant="filled">
                                <IconFileDownload
                                    size="2rem"
                                    strokeWidth={1}
                                />
                            </ActionIcon>
                        </Tooltip>
                    </CSVLink>}
            </Group>
            <Space h="sm" />

            {isLoading && select && <> <Loader mt="1rem" /></>}
            {isSuccess && isSuccessDevices && <LogChart data={data} devices={devices} />}
        </>
    )
}

const LogChart = ({ data, devices }: { data: Log[], devices: DeviceIdName[] }) => {

    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const data1 = groupBy(data, i => i.deviceId)

    const input = Object.keys(data1).map((deviceId) => {
        return {
            type: "line",
            name: devices.find(a => a.id = deviceId)?.name,
            lineWidth: 1,
            data: data1[deviceId].map(a => ([
                a.timestampUTC * 1000, a.logValue
            ])),
        }
    })


    const options = {
        chart: {
            height: 500,
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
            scrollablePlotArea: {
                minWidth: 1000,
                scrollPositionX: 1
            }
        },
        boost: {

        },
        plotOptions: {
            series: {
                pointPlacement: 'on',
            }
        },
        time: {
            useUTC: false,
            timezone: 'Asia/Calcutta',
        },
        title: {
            text: 'Chart'
        },

        tooltip: {
            valueDecimals: 2
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            lineWidth: 1,
            tickWidth: 1,
        },

        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date time'
            }
        },
        credits: {
            enabled: false
        },

        series: input,
    }



    return (
        <>
            <Box
                sx={(theme) => ({
                    borderRadius: theme.radius.md,
                })}
            >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </Box>
        </>
    )
}

export default TaskLog
