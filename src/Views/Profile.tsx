import { useEffect } from "react"
import userService from "../Services/user.service";
import { useForm, matchesField } from '@mantine/form';
import { Space, Input, Box, Button, Text, PasswordInput, Tabs, Select, Loader } from "@mantine/core"
import { ChangePasswordForm } from "../Ultils/type";
import authservice from "../Services/auth.service";
import { useError } from "../Hook"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showErorNotification, showSuccessNotification } from "../Ultils/notification";
const Device = () => {
    const form = useForm<any>({
        initialValues: {
            id: "",
            username: "",
            email: ""
        },
        validate: {
            username: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        },
        // functions will be used to validate values at corresponding key
    });

    const errorMessage = useError()


    const form2 = useForm({
        initialValues: {
            password: "",
            newPassword: "",
            confirmPassword: ""
        },
        validate: {
            password: (value) => (value.length < 8 ? 'Name must have at least 5 letters' : null),
            newPassword: (value) => (value.length < 8 ? 'Name must have at least 5 letters' : null),
            confirmPassword: matchesField('newPassword', 'Passwords are not the same')
        },
    });


    const { isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await userService.getCurrentUser()
            if (!res) {
                throw new Error()
            }
            return res
        },
        onSuccess: (data) => {
            form.setValues(data)
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


    const changePassword = useMutation({
        mutationFn: async (data: ChangePasswordForm) => {
            const input = { ...data, username: form.values.username }

            const { confirmPassword, ...input1 } = input

            return await authservice.changePassword(input1)

        },
        onSuccess: () => {
            form2.reset()
            showSuccessNotification(`Password has been changed`)
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



    if (isLoading) {
        return <Loader />
    }


    return (
        <>

            <Tabs defaultValue="detail">
                <Tabs.List position="center">
                    <Tabs.Tab value="detail">DETAILS</Tabs.Tab>
                    <Tabs.Tab value="security">SECURITY</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="security">
                    <form onSubmit={form2.onSubmit(data => changePassword.mutate(data))}>
                        <Box maw={300} >
                            <Input.Wrapper
                                mt="1rem"
                                label="Password :"
                            >
                                <PasswordInput   {...form2.getInputProps('password')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Box maw={300} >
                            <Input.Wrapper
                                mt="1rem"
                                label="New Passowrd :"
                            >
                                <PasswordInput   {...form2.getInputProps('newPassword')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Box maw={300} >
                            <Input.Wrapper
                                mt="1rem"
                                label="Confirm Passowrd :"
                            >
                                <PasswordInput   {...form2.getInputProps('confirmPassword')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        {errorMessage.value && <>
                            <Text color="red">
                                {errorMessage.value}</Text>
                            <Space h="xl" />
                        </>}
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="detail">
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

export default Device