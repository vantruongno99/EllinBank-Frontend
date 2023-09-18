import { useState, useEffect } from "react"
import deviceService from "../../Services/device.service"
import { DeviceInfo } from "../../Ultils/type"
import { ActionIcon, Anchor, Button, Group, Space, Text, Tooltip, Title } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom';
import { deviceStatusColor } from "../../Ultils/colors"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import handleFunctionError from "../../Ultils/handleFunctionError";
import { IconCirclePlus } from '@tabler/icons-react';


const Devices = () => {

    const navigate = useNavigate()

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['device'],
        initialData: [],
        queryFn: async () => {
            const res: DeviceInfo[] | undefined = await deviceService.getAllDevices()
            if (!res) {
                throw new Error()
            }
            return res
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <>

            <Title order={3} color="blue">DEVICE LIST</Title>
            <Space h="xl" />
            <DeviceTable data={data} isLoading={isLoading} />

        </>
    )
}


const PAGE_SIZE = 20;


const DeviceTable = ({ data, isLoading }: { data: DeviceInfo[], isLoading: boolean }) => {
    const [devices, setDevices] = useState<DeviceInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(devices.slice(0, PAGE_SIZE));

    useEffect(() => {
        setDevices(data)
        setRecords(data.slice(0, PAGE_SIZE))
    }, [data])


    useEffect(() => {
        const data = sortBy(devices, sortStatus.columnAccessor) as DeviceInfo[];
        setDevices(sortStatus.direction === 'desc' ? data.reverse() : data);
        setRecords(data.slice(0, PAGE_SIZE))
        setPage(1)
    }, [sortStatus]);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(devices.slice(from, to));
    }, [page]);



    return (
        <>
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
                totalRecords={devices.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                records={records}
                columns={[
                    {
                        accessor: 'id',
                        title: 'Id',
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
            />
        </>
    )
}


export default Devices