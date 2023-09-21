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

const PAGE_SIZE = 20;


const CompanyTable = ({ data, isLoading }: { data: CompanyInfo[], isLoading: boolean }) => {

    const [companies, setCompanies] = useState<CompanyInfo[]>(data)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(companies.slice(0, PAGE_SIZE));

    useEffect(() => {
        setCompanies(data)
        setRecords(data.slice(0, PAGE_SIZE))
    }, [data])


    useEffect(() => {
        const data = sortBy(companies, sortStatus.columnAccessor) as CompanyInfo[];
        setCompanies(sortStatus.direction === 'desc' ? data.reverse() : data);
        setRecords(companies.slice(0, PAGE_SIZE))
        setPage(1)
    }, [sortStatus]);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(companies.slice(from, to));
    }, [page]);


    return (
        <>
            <DataTable
                minHeight={companies.length === 0 ? 150 : 0}
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
                totalRecords={companies.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
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

            />
        </>
    )
}





export default Companies