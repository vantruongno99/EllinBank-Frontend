import { useEffect, useState, useRef } from "react";
import { TaskForm } from "../../Ultils/type"
import { showErorNotification } from "../../Ultils/notification";
import taskService from "../../Services/task.service";
import { Box, Checkbox, Space, Select } from "@mantine/core";
import { Log } from "../../Ultils/type";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as HC_exporting from 'highcharts/modules/exporting';
import * as HC_exportdata from 'highcharts/modules/export-data';

// Add Menu to the chart 
// @ts-ignore
HC_exporting(Highcharts)
// @ts-ignore
HC_exportdata(Highcharts)



const TaskLog = ({ task }: { task: TaskForm | undefined }) => {
    const [data, setData] = useState<Log[]>([])
    const [progress, setProgress] = useState<number>(0)
    const [select, setSelect] = useState<string | null>(null);
    const timeout = useRef<any>(null);


    const getLog = async () => {
        if (task?.id) {
            try {
                const res = await taskService.getLogs(task?.id)
                if(!res){
                    showErorNotification("No data")
                    return
                }
                setData(res)
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



    const options = {
        chart: {
            zoomType: 'x',
            backgroundColor: "transparent"
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
            }
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

        series: [{
            data: data.map(a => ([
                a.timestampUTC * 1000, a.logValue
            ])),
            lineWidth: 0.5,
            name : "Sensor"
        }]
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
                        { value: 'react', label: 'React' },
                        { value: 'ng', label: 'Angular' },
                        { value: 'svelte', label: 'Svelte' },
                        { value: 'vue', label: 'Vue' },
                    ]}
                />
                <Space h="sm" />
                <Checkbox
                    onChange={(event) => handleOkBtnClick(event.currentTarget.checked)}
                    label="Auto Refresh"
                />
            </Box>

           {data.length > 0 && <HighchartsReact
                highcharts={Highcharts}
                options={options}
            /> } 
        </>
    )
}

export default TaskLog
