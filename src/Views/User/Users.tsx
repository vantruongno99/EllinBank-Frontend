import { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { Anchor, Button, Group, Space, Loader, Tooltip, ActionIcon, Title } from '@mantine/core'
import { UserInfo } from "../../Ultils/type"
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import handleFunctionError from "../../Ultils/handleFunctionError";
import { IconCirclePlus } from '@tabler/icons-react';




const Users = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['user'],
        initialData: [],
        queryFn: async () => {
            const res: UserInfo[] | undefined = await userService.getAllUsers()
            if (!res) {
                throw new Error()
            }
            return res
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })




    if (isLoading) return <Loader />

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <>
            <Group position="apart">
                <Title order={3} color="blue">USER LIST</Title>
                <Tooltip
                    label="Create new User"
                    color="blue"
                    position="left"
                >
                    <ActionIcon color="blue" size="lg" radius="xl" variant="light" onClick={() => {
                        navigate(`${location.pathname}/new`)
                    }}>
                        <IconCirclePlus />
                    </ActionIcon >
                </Tooltip>
            </Group>
            <Space h="xl" />
            <UserTable data={data} isLoading={isLoading} />
        </>
    )
}


const PAGE_SIZE = 20;

const UserTable = ({ data, isLoading }: { data: UserInfo[], isLoading: boolean }) => {

    const [users, setUsers] = useState<UserInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(users.slice(0, PAGE_SIZE));

    useEffect(() => {
        setUsers(data)
        setRecords(data.slice(0, PAGE_SIZE))
    }, [data])


    useEffect(() => {
        const data = sortBy(users, sortStatus.columnAccessor) as UserInfo[];
        setUsers(sortStatus.direction === 'desc' ? data.reverse() : data);
        setRecords(data.slice(0, PAGE_SIZE))
        setPage(1)
    }, [sortStatus]);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(users.slice(from, to));
    }, [page]);


    return (
        <>
            <DataTable
                minHeight={users.length === 0 ? 150 : 0}
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
                records={records}
                totalRecords={users.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                columns={[
                    {
                        accessor: 'username',
                        title: 'Username',
                        sortable: true,
                        render: ({ username }) => (<Anchor href={`${location.pathname}/${username}`} target="_blank">
                            {username}
                        </Anchor>)

                    },
                    {
                        accessor: 'company',
                        sortable: true,
                        render: ({ company }) => (<Anchor href={`/company/${company}`} target="_blank">
                            {company}
                        </Anchor>)

                    },
                    {
                        accessor: 'email',
                        title: 'Email',
                        sortable: true,

                    },
                    {
                        accessor: 'role',
                        title: 'Role',
                        sortable: true,

                    },

                ]}

            />
        </>
    )
}



export default Users