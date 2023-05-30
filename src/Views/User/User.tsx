import  { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { useParams } from "react-router-dom"
import { UserInfo } from "../../Ultils/type"
import moment from "moment"
import { useForm } from '@mantine/form';
import { Space, Input, Box, Button, Select, PasswordInput, Tabs } from "@mantine/core"




const User = () => {
    const [user, setUser] = useState<UserInfo | null>(null)
    const params = useParams();

    const form = useForm<UserInfo>({
        initialValues: {
            id: 0,
            username: "",
            email: "",
            role :''
        },
       
        // functions will be used to validate values at corresponding key
    });

    const form2 = useForm<{password : string , confirmPassword : string}>({

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
                    <form onSubmit={form.onSubmit((a)=>console.log(a))}>
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