import { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { Anchor, Button, Group, Space, Loader } from '@mantine/core'
import { UserInfo } from "../../Ultils/type"
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";




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
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
    })




    if (isLoading) return <Loader />

    if (isError) return <>'An error has occurred: ' + {JSON.stringify(error)}</>

    return (
        <>
            <Group position="right">
                <Button onClick={() => navigate(`${location.pathname}/new`)}>
                    New User
                </Button>
            </Group>
            <Space h="xl" />
            <UserTable data={data} isLoading={isLoading} />
        </>
    )
}

const UserTable = ({ data, isLoading }: { data: UserInfo[], isLoading: boolean }) => {

    const [users, setUsers] = useState<UserInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });

    useEffect(() => {
        setUsers(data)
    }, [data])


    useEffect(() => {
        const data = sortBy(users, sortStatus.columnAccessor) as UserInfo[];
        setUsers(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);


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

                records={users}
            />
        </>
    )
}



export default Users