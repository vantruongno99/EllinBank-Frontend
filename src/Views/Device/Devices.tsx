import { useState, useEffect } from "react"
import deviceService from "../../Services/device.service"
import { DeviceInfo } from "../../Ultils/type"
import { Anchor, Button, Group, Space, Text } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom';
import { deviceStatusColor } from "../../Ultils/colors"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";


const Devices = () => {

    const navigate = useNavigate()

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['device'],
        initialData: [],
        queryFn: async () => {
            const res: DeviceInfo[] | undefined = await deviceService.getAllDevices()
            if(!res){
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

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <>
            <Group position="right">
                <Button onClick={() => navigate(`${location.pathname}/new`)}>
                    New Device
                </Button>
            </Group>
            <Space h="xl" />
            <DeviceTable data={data} isLoading={isLoading} />

        </>
    )
}

const DeviceTable = ({ data, isLoading }: { data: DeviceInfo[], isLoading: boolean }) => {
    const [devices, setDevices] = useState<DeviceInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });

    useEffect(() => {
        setDevices(data)
    }, [data])


    useEffect(() => {
        const data = sortBy(devices, sortStatus.columnAccessor) as DeviceInfo[];
        setDevices(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    return (<>
        <DataTable
            minHeight={devices.length === 0 ? 150 : 0}
            fetching={isLoading}
            withBorder
            borderRadius={5}
            verticalAlignment="center"
            fontSize="md"
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            sortIcons={{
                sorted: <IconChevronUp size={14} />,
                unsorted: <IconSelector size={14} />,
            }}
            columns={[
                {
                    accessor: 'id',
                    title: 'Task No',
                    sortable: true,
                    render: ({ id }) =>
                        <Anchor href={`${location.pathname}/${id}`} target="_blank">
                            {id}
                        </Anchor>

                },
                {
                    accessor: 'name',
                    title: 'Name',
                    sortable: true,

                },
                {
                    accessor: 'CH4_SN',
                    title: 'CH4_SN',
                },
                {
                    accessor: 'CO2_SN',
                    title: 'CO2_SN',
                },
                {
                    accessor: 'O2_SN',
                    title: 'O2_SN',
                },
                {
                    accessor: 'PUMP_SN',
                    title: 'PUMP_SN',
                },
                {
                    accessor: 'Status',
                    render: ({ status }) => (<Text color={deviceStatusColor(status)}>{status}</Text>),
                    sortable: true,

                }
            ]}

            records={devices}
        />
    </>)
}


export default Devices