import { useEffect } from "react"
import { useParams } from "react-router-dom"
import userService from "../Services/user.service";
import { useForm } from '@mantine/form';
import { Space, Input, Box, Button, Text, PasswordInput, Tabs } from "@mantine/core"
import { ChangePasswordForm } from "../Ultils/type";
import authservice from "../Services/auth.service";
import { useError } from "../Hook";

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


    const form2 = useForm<ChangePasswordForm>({
        initialValues: {
            password: "",
            newPassword: ""
        },
        validate: {
            password: (value) => (value.length < 8 ? 'Name must have at least 5 letters' : null),
            newPassword: (value) => (value.length < 8 ? 'Name must have at least 5 letters' : null),

        },
    });


    const params = useParams();
    const getUser = async () => {
        const id = params.id
        if (id !== undefined) {
            try {
                const res = await userService.getUser(id)
                if (res) {
                    form.setValues(res)

                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    const handleChangePassword = async (data: ChangePasswordForm) => {

        const input = { ...data, username: form.values.username }

        try {
            await authservice.changePassword(input)
            form2.reset()
        }

        catch (e) {
            if (e instanceof Error) {
                errorMessage.set(e.message)
            }
            else {
                console.log("Unknown Error")
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
                    <Tabs.Tab value="security">SECURITY</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="security">
                    <form onSubmit={form2.onSubmit(handleChangePassword)}>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="Password :"
                            >
                                <PasswordInput   {...form2.getInputProps('password')} size="md" />
                            </Input.Wrapper>
                        </Box>
                        <Space h="xl" />
                        <Box maw={300} >
                            <Input.Wrapper

                                label="New Passowrd :"
                            >
                                <PasswordInput   {...form2.getInputProps('newPassword')} size="md" />
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
                    </Box>
                    <Space h="xl" />
                    <Box maw={300} >
                        <Input.Wrapper
                            label="Username :"
                        >
                            <Input   {...form.getInputProps('username')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>
                    <Space h="xl" />
                    <Box maw={300} >
                        <Input.Wrapper
                            label="Email :"
                        >
                            <Input   {...form.getInputProps('email')} size="md" disabled />
                        </Input.Wrapper>
                    </Box>
                </Tabs.Panel>

            </Tabs>


        </>
    )
}

export default Device