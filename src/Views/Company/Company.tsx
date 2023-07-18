import { useState, useEffect } from "react"
import { Anchor, Button, Group, Space, Loader, Tooltip, ActionIcon, Title, Box, Input, Grid } from '@mantine/core'
import { CompanyInfo, CompanyInfoExtended, UserInfo } from "../../Ultils/type"
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import { IconCirclePlus } from '@tabler/icons-react';
import companyService from "../../Services/company.service";
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from '@mantine/form';

const Company = () => {
    const params = useParams();

    const name = params.name

    if (!name) {
        return <>
            404
        </>
    }

    const { isLoading, error, isError, data, isSuccess } = useQuery({
        queryKey: ['company', name],
        queryFn: async () => {
            const res = await companyService.getCompany(name)
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
            {isSuccess && data && <CompanyDetail data={data} isLoading={isLoading} />}
        </>
    )


}


const CompanyDetail = ({ data, isLoading }: { data: CompanyInfoExtended, isLoading: boolean }) => {

    const [users, setUsers] = useState<UserInfo[]>(data.Users)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });

    const form = useForm<CompanyInfo>({
        initialValues: {
            name: "",
        },
        validate: {
            name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        },
        // functions will be used to validate values at corresponding key
    });

    useEffect(() => {
        data.Users && setUsers(data.Users)
        const { Users, ...input } = data
        form.setValues(input)
    }, [data])


    useEffect(() => {
        const data = sortBy(users, sortStatus.columnAccessor) as UserInfo[];
        setUsers(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);





  


    return (
        <>
            <Title order={3} color="blue">INFORMATION</Title>
            <Space h="xl" />

            <Grid gutter='xl' >
                <Grid.Col span={4}>
                    <Box maw={440} >
                        <Input.Wrapper

                            label="Name :"
                        >
                            <Input   {...form.getInputProps('name')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>
                </Grid.Col>
            </Grid>
            <Space h="xl" />
            <p>User List :</p>
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
                        render: ({ username }) => (<Anchor href={`/user/${username}`} target="_blank">
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

export default Company