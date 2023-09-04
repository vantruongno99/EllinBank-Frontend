import { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { useNavigate, useParams } from "react-router-dom"
import { CompanyInfo, UserInfo } from "../../Ultils/type"
import moment from "moment"
import { Space, Input, Box, Button, Select, PasswordInput, Tabs, Tooltip, Group, ActionIcon } from "@mantine/core"
import { matchesField, useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { showSuccessNotification } from "../../Ultils/notification"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modals } from '@mantine/modals';
import handleFunctionError from "../../Ultils/handleFunctionError";
import companyService from "../../Services/company.service"
import authservice from "../../Services/auth.service"


const User = () => {

    const openDeleteModal = () =>
        modals.open({
            title: 'Delete this user',
            centered: true,
            children: (<>
                <p>
                    Are you sure you want to delete this user

                </p>
                <Group position="right">
                    <Button color="red" onClick={async () => {
                        await deleteUser.mutateAsync()
                        modals.closeAll()
                    }
                    } mt="md">
                        Yes
                    </Button>
                </Group>

            </>
            )
        })

    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const params = useParams();

    const detailForm = useForm<UserInfo>({
        initialValues: {
            id: 0,
            username: "",
            email: "",
            role: '',
            company: ''
        },
    });




    const securityForm = useForm({
        initialValues: {
            newPassword: "",
            repeatPassword: ""
        },
        validate: {
            newPassword: (value) => (value.length < 7 ? 'Password must have at least 8 letters' : null),
            repeatPassword :  matchesField('newPassword', 'Passwords are not the same'),
        },
    })

    const username = params.username

    if (!username) {
        return <>
            404
        </>
    }

    const deleteUser = useMutation({
        mutationFn: async () => {
            return await userService.deleteUser(username)
        },
        onSuccess: () => {
            navigate('/user')
            showSuccessNotification(`User ${username} has been deleted`)

        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['user', username],
        queryFn: async () => {
            const res = await userService.getUser(username)
            return res
        },
        onSuccess: (data) => {
            data && detailForm.setValues(data)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

    const updateUser = useMutation({
        mutationFn: async (data: UserInfo) => {
            return await userService.editUser(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', username] })
            showSuccessNotification(`Task ${detailForm.values.username} has been updated`)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })


    const resetPassword = useMutation({
        mutationFn: async (data : {
            repeatPassword : string,
            newPassword : string
        }) => {
            const input ={
                username,
                newPassword : data.newPassword
            }
            return await authservice.adminResetPassword(input)
        },
        onSuccess : () => {
            securityForm.reset()
            showSuccessNotification(`passoword hase been reseted`)

        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })



    const companyQuery = useQuery({
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

    const companyOption = companyQuery.data.map(a => ({
        value: a.name,
        label: a.name
    })
    )

    if (isError) {
        return <>
            404
        </>
    }



    return (
        <>
            <Tabs defaultValue="detail">
                <Tabs.List position="center">
                    <Tabs.Tab value="detail">DETAILS</Tabs.Tab>
                    <Tabs.Tab value="security">SECURITY</Tabs.Tab>

                </Tabs.List>
                <Tabs.Panel value="security">
                    <form onSubmit={securityForm.onSubmit((a) => resetPassword.mutate(a))}>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="New Password :"
                            >
                                <PasswordInput   {...securityForm.getInputProps('newPassword')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="Repeat Passowrd :"
                            >
                                <PasswordInput   {...securityForm.getInputProps('repeatPassword')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="detail">
                    <form onSubmit={detailForm.onSubmit((data: UserInfo) => updateUser.mutate(data))} >
                        <Group position="right">
                            <Tooltip
                                label="Delete this user"
                                color="red"
                            >
                                <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={openDeleteModal}>
                                    <IconTrash />
                                </ActionIcon >
                            </Tooltip>
                        </Group>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper
                                label="ID :"
                            >
                                <Input   {...detailForm.getInputProps('id')} size="md" disabled />
                            </Input.Wrapper>
                            <Input.Wrapper
                                label="Username :"
                                mt="1rem"

                            >
                                <Input   {...detailForm.getInputProps('username')} size="md" disabled />
                            </Input.Wrapper>
                            <Input.Wrapper
                                label="Email :"
                                mt="1rem"

                            >
                                <Input   {...detailForm.getInputProps('email')} size="md" />
                            </Input.Wrapper>

                            <Input.Wrapper
                                mt="1rem"
                                label="Role :" placeholder="role"
                            >
                                <Select

                                    data={[
                                        { value: 'admin', label: 'Admin' },
                                        { value: 'user', label: 'User' },
                                    ]}
                                    {...detailForm.getInputProps('role')} size="md" />
                            </Input.Wrapper>

                            <Input.Wrapper
                                mt="1rem"
                                label="Company :" placeholder="Company"
                            >
                                <Select data={companyOption}
                                    {...detailForm.getInputProps('company')} size="md" />
                            </Input.Wrapper>
                        </Box>

                        <Button type="submit" mt="2rem" disabled={updateUser.isLoading}>
                            Save Changes
                        </Button>
                    </form>
                </Tabs.Panel>

            </Tabs>

        </>
    )
}

export default User