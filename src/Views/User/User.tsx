import { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { useNavigate, useParams } from "react-router-dom"
import { UserInfo } from "../../Ultils/type"
import moment from "moment"
import { Space, Input, Box, Button, Select, PasswordInput, Tabs, Tooltip, Group, ActionIcon } from "@mantine/core"
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { showSuccessNotification } from "../../Ultils/notification"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modals } from '@mantine/modals';
import handleFunctionError from "../../Ultils/handleFunctionError";


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

    const form = useForm<UserInfo>({
        initialValues: {
            id: 0,
            username: "",
            email: "",
            role: '',
            company : ''
        },
    });
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
            data && form.setValues(data)
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })

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
                </Tabs.List>
                <Tabs.Panel value="security">
                    <form onSubmit={form.onSubmit((a) => console.log(a))}>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="Password :"
                            >
                                <PasswordInput   {...form.getInputProps('password')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="New Passowrd :"
                            >
                                <PasswordInput   {...form.getInputProps('newPassword')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="detail">
                    <Group position="right">
                        <Tooltip
                            label="Delete this user"
                            color="red"
                        >
                            <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={openDeleteModal}>
                                <IconTrash />R
                            </ActionIcon >
                        </Tooltip>
                    </Group>
                    <Space h="xl" />
                    <Box maw={300} >
                        <Input.Wrapper
                            label="ID :"
                        >
                            <Input   {...form.getInputProps('id')} size="md" disabled />
                        </Input.Wrapper>
                        <Input.Wrapper
                            label="Username :"
                            mt="1rem"

                        >
                            <Input   {...form.getInputProps('username')} size="md" disabled />
                        </Input.Wrapper>
                        <Input.Wrapper
                            label="Email :"
                            mt="1rem"

                        >
                            <Input   {...form.getInputProps('email')} size="md" disabled />
                        </Input.Wrapper>

                        <Input.Wrapper
                            mt="1rem"
                            label="Role :" placeholder="role"
                        >
                            <Select
                                disabled
                                data={[
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'user', label: 'User' },
                                ]}
                                {...form.getInputProps('role')} size="md" />
                        </Input.Wrapper>

                        <Input.Wrapper
                            label="Company :"
                            mt="1rem"

                        >
                            <Input   {...form.getInputProps('company')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>
                </Tabs.Panel>

            </Tabs>

        </>
    )
}

export default User