import { useEffect, useState, useRef } from "react";
import { TaskForm } from "../../Ultils/type"
import { showErorNotification } from "../../Ultils/notification";
import taskService from "../../Services/task.service";
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
Boost(Highcharts);


const LogChart = ({ data }: { data: Log[]}) => {
    
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

export default LogChart
