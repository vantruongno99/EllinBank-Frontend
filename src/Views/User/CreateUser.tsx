import React from "react"
import { useForm, isEmail, matchesField, isNotEmpty } from '@mantine/form';
import { NumberInput, TextInput, Button, Box, Space, Input, PasswordInput ,Select} from '@mantine/core';
import userService from "../../Services/user.service";
import { UserInput } from "../../Ultils/type";
import { useError } from "../../Hook";
import { useNavigate } from "react-router-dom";


interface UserRe {
    confirmPassword: string,
    username: string,
    password: string,
    email: string,
    role: string
}


const CreateUser = () => {
    const errorMessage = useError()
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { username: '', password: '', email: '', confirmPassword: '', role: '' },
        // functions will be used to validate values at corresponding key
        validate: {
            username: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
            password: (value) => (value.length < 8 ? 'Password must have at least 5 letters' : null),
            confirmPassword: matchesField('password', 'Passwords are not the same'),
            email: isEmail('Invalid email'),
            role: isNotEmpty('Select role')

        },
    });


    const createUser = async (input: UserRe) => {
        try {
            const { confirmPassword, ...info } = input
            await userService.createUser(info)
            navigate("/user")
        }

        catch (e) {
            if (e instanceof Error) {
                errorMessage.set(e.message)
            }
            else {
                errorMessage.set("Unknown Error")
            }
        }
    }




    return (
        <>
            <Box maw={320}>
                <form onSubmit={form.onSubmit(createUser)}>
                    <Input.Wrapper
                        label="Username :" placeholder="Username"
                    >
                        <TextInput  {...form.getInputProps('username')} />
                    </Input.Wrapper>
                    <Input.Wrapper
                        mt="1rem"
                        label="Password :" placeholder="Password"
                    >
                        <PasswordInput  {...form.getInputProps('password')} />
                    </Input.Wrapper>
                    <Input.Wrapper
                        mt="1rem"
                        label="Confirm Passowrd :" placeholder="Confirm Password"
                    >
                        <PasswordInput  {...form.getInputProps('confirmPassword')} />
                    </Input.Wrapper>
                    <Input.Wrapper
                        mt="1rem"
                        label="Email :" placeholder="Email"
                    >
                        <TextInput {...form.getInputProps('email')} />
                    </Input.Wrapper>
                    <Input.Wrapper
                        mt="1rem"
                        label="Role :" placeholder="role"
                    >
                        <Select data={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'user', label: 'User' },
                            ]}
                                 {...form.getInputProps('role')} size="md" />
                    </Input.Wrapper>
                    <Space h="md" />
                    <Button type="submit" mt="sm">
                        Save
                    </Button>
                    <Space h="md" />
                    {errorMessage.value}
                </form>
            </Box>
        </>
    )
}

export default CreateUser