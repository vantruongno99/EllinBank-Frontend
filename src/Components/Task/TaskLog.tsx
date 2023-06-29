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
import LogChart from "./LogChart";
//@ts-ignore
Boost(Highcharts);


const TaskLog = ({ task }: { task: TaskForm }) => {
    const [checked, setChecked] = useState<boolean>(false)
    const [select, setSelect] = useState<string | null>(null);



    const { isLoading, data , isSuccess } = useQuery({
        queryKey: ['task', select],
        queryFn: async () => {
            const res = await taskService.getLogsByType(task?.id, select as string)
            if (!res) {
                throw new Error()
            }
            return res
        },
        enabled: !!select,
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
            {isSuccess && <LogChart data={data} />}
        </>
    )
}

export default TaskLog
