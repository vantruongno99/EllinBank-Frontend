import { useState, useEffect } from "react"
import { Anchor, Group, Space, Loader, Tooltip, ActionIcon, Title } from '@mantine/core'
import { CompanyInfo, UserInfo } from "../../Ultils/type"
import { useLocation, useNavigate } from 'react-router-dom';
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useQuery } from "@tanstack/react-query";
import { IconCirclePlus } from '@tabler/icons-react';
import companyService from "../../Services/company.service";
import handleFunctionError from "../../Ultils/handleFunctionError";



const Companies = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['company'],
        initialData: [],
        queryFn: async () => {
            const res: CompanyInfo[] | undefined = await companyService.getAllCompany()
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
                <Title order={3} color="blue">COMPANY LIST</Title>
                <Tooltip
                    label="Create new Company"
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
            <CompanyTable data={data} isLoading={isLoading} />
        </>
    )
}

const CompanyTable = ({ data, isLoading }: { data: CompanyInfo[], isLoading: boolean }) => {

    const [company, setCompany] = useState<CompanyInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });

    useEffect(() => {
        setCompany(data)
    }, [data])


    useEffect(() => {
        const data = sortBy(company, sortStatus.columnAccessor) as CompanyInfo[];
        setCompany(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);


    return (
        <>
            <DataTable
                minHeight={company.length === 0 ? 150 : 0}
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
                        accessor: 'name',
                        title: 'Name',
                        sortable: true,
                        render: ({ name }) => (<Anchor href={`${location.pathname}/${name}`} target="_blank">
                            {name}
                        </Anchor>)


                    },
                ]}

                records={company}
            />
        </>
    )
}





export default Companies