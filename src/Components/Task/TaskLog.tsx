import { useEffect, useState, useRef } from "react";
import { TaskForm } from "../../Ultils/type"
import { showErorNotification } from "../../Ultils/notification";
import taskService from "../../Services/task.service";
import { Box, Checkbox, Space, Select, Loader } from "@mantine/core";
import { Log } from "../../Ultils/type";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as Boost from 'highcharts/modules/boost';
//@ts-ignore
Boost(Highcharts);


const TaskLog = ({ task }: { task: TaskForm | undefined }) => {
    const [data, setData] = useState<Log[]>([])
    const [progress, setProgress] = useState<number>(0)
    const [select, setSelect] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const timeout = useRef<any>(null);


    const getLog = async () => {
        if (task?.id) {
            try {
                setLoading(true)
                const res = await taskService.getLogs(task?.id)
                if (!res) {
                    showErorNotification("No data")
                    return
                }
                setData(res)
                console.log(res.length)
            }
            catch (e) {
                if (e instanceof Error) {
                    showErorNotification(e.message)
                }
                else {
                    showErorNotification("Unknown Error")
                }
            }
            finally {
                setLoading(false)
            }
        }
    }

    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const data1 = groupBy(data, i => i.deviceId)

    const input = Object.keys(data1).map((deviceId) => {
        return {
            type: "line",
            name: deviceId,
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
            backgroundColor: "transparent",
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
            tickInterval: 60 * 60 * 24 * 5,
            title: {
                text: 'Date time'
            }
        },
        credits: {
            enabled: false
        },

        series: input,
    }

    useEffect(() => {
        select && getLog()
    }, [progress, select])

    const handleOkBtnClick = (event: boolean): void => {
        if (event) {
            timeout.current = window.setInterval(() => setProgress(progress => progress + 1), 1000 * 60 * 15);
        } else {
            clearInterval(timeout.current);
        }
    }


    return (
        <>
            <Space h="xl" />
            <Box maw={300} >
                <Select
                    label="Select a type"
                    placeholder="Pick one"
                    value={select} onChange={setSelect}
                    data={[
                        { value: 'CO2', label: 'CO2' },
                        { value: 'CH4', label: 'CH4' },
                        { value: 'O2', label: 'O2' },
                    ]}
                />
                <Space h="sm" />
                <Checkbox
                    onChange={(event) => handleOkBtnClick(event.currentTarget.checked)}
                    label="Auto Refresh"
                />
            </Box>

            {loading && <> <Loader mt="1rem" /></>}

            {data.length > 0 && !loading && <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />}
        </>
    )
}

export default TaskLog
