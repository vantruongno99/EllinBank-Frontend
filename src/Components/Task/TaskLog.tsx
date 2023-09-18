import { useEffect, useState, useRef } from "react";
import { TaskForm } from "../../Ultils/type"
import taskService from "../../Services/task.service";
import deviceService from "../../Services/device.service";
import { Box, Checkbox, Space, Select, Loader, Group, Tooltip, ActionIcon, Autocomplete } from "@mantine/core";
import { Log } from "../../Ultils/type";
import { CSVLink, CSVDownload } from "react-csv";
import {
    IconFileDownload,
    IconDownload
} from '@tabler/icons-react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Boost from 'highcharts/modules/boost';
import { useQuery } from "@tanstack/react-query";
import handleFunctionError from "../../Ultils/handleFunctionError";
//@ts-ignore

interface DeviceIdName {
    id: string,
    name: string
}


Boost(Highcharts);


const TaskLog = ({ task }: { task: TaskForm }) => {
    const [checked, setChecked] = useState<boolean>(false)
    const [select, setSelect] = useState<string | null>(null);



    const selectData = [
        { value: 'test', label: 'Test' },
        { value: 'CO2', label: 'CO2' },
        { value: 'CH4', label: 'CH4' },
        { value: 'O2', label: 'O2' },
        { value: 'BAR', label: 'BAR' },
        { value: 'RH', label: 'RH' },
        { value: 'TEMP', label: 'TEMP' },


    ]



    const { data: devices, isSuccess: isSuccessDevices } = useQuery({
        queryKey: ['device'],
        queryFn: async () => {
            const res = await deviceService.getAllDevices()
            if (!res) {
                throw new Error()
            }
            const list = res.map(a => ({
                id: a.id,
                name: a.name
            }))

            return list
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })



    const { isLoading, data, isSuccess } = useQuery({
        queryKey: ['task', select , checked],
        queryFn: async () => {
            const option = {
                type: select as string,
                ...checked && {
                    from : Date.now() - 1000 * 60 * 15
                }
                

            }
            const res = await taskService.getLogs(task?.id, option)
            if (!res) {
                throw new Error()
            }
            if (res.length === 0) {
                throw new Error("No data recorded")
            }
            return res
        },
        enabled: !!select && !!devices && !!selectData.some(a => a.value === select),
        onError: (e) => {
            handleFunctionError(e)
        },
        ...(checked &&
             { 
                refetchInterval: 1000 * 30, 
                refetchIntervalInBackground : true,
            })
    })


    return (
        <>
            <Space h="sm" />
            <Group position="apart" spacing="xs" mx="1rem">
                <Box maw={300} >
                    <Select
                        label="Select data type"
                        placeholder="Pick one"
                        value={select}
                        onChange={setSelect}
                        data={selectData}
                        limit={7}
                        searchable
                    />
                    <Space h="lg" />
                    {task?.status !== "COMPLETED" &&
                        <Checkbox
                            mb={"1rem"}
                            checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}
                            label="Live Chart"
                            disabled={!select}
                        />
                    }
                </Box>

                {isSuccess && data.length > 0 &&
                    <CSVLink
                        data={data}
                        filename={`${task?.id}-${select}.csv`}
                    >
                        <Tooltip label="Download as CSV">
                            <ActionIcon color="blue" size="xl" radius="lg" variant='light'>
                                <IconDownload
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
            name: devices.find(a => a.id === deviceId)?.name,
            lineWidth: 1,
            data: data1[deviceId].map(a => ([
                a.timestampUTC, a.logValue
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
                text: 'Timestamp'
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
