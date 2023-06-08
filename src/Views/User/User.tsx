import { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { useNavigate, useParams } from "react-router-dom"
import { UserInfo } from "../../Ultils/type"
import moment from "moment"
import { Space, Input, Box, Button, Select, PasswordInput, Tabs, Tooltip, Group, ActionIcon } from "@mantine/core"
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCircleCheck, IconPlayerPlay, IconPlayerPause, IconTrash } from '@tabler/icons-react';
import { showErorNotification, showSuccessNotification } from "../../Ultils/notification"




const User = () => {
    const [user, setUser] = useState<UserInfo | null>(null)
    const navigate = useNavigate();

    const params = useParams();

    const form = useForm<UserInfo>({
        initialValues: {
            id: 0,
            username: "",
            email: "",
            role: ''
        },

        // functions will be used to validate values at corresponding key
    });

    const form2 = useForm<{ password: string, confirmPassword: string }>({

    });

    const getUser = async () => {
        const username = params.username
        if (username !== undefined) {
            try {
                const res = await userService.getUser(username)
                if (res) {
                    form.setValues(res)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    const handleDelete = async () => {
        const username = params.username
        if (username !== undefined) {
            try {
                await userService.deleteUser(username)
                navigate('/user')
            }
            catch (e) {
                if (e instanceof Error) {
                    showErorNotification(e.message)
                }
                else {
                    showErorNotification("Unknown Error")
                }
            }
        }
    }


    useEffect(() => {
        getUser()
    }, [])
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
                            <ActionIcon color="red" size="lg" radius="xs" variant="light" onClick={() => handleDelete()}>
                                <IconTrash />
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
                    </Box>
                </Tabs.Panel>

            </Tabs>

        </>
    )
}

export default User