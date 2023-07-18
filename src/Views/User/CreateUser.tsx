import { useForm, isEmail, matchesField, isNotEmpty } from '@mantine/form';
import { TextInput, Button, Box, Space, Input, PasswordInput, Select } from '@mantine/core';
import { useError } from "../../Hook";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";
import { CompanyInfo } from '../../Ultils/type';
import companyService from '../../Services/company.service';
import userService from '../../Services/user.service';

interface UserRe {
    confirmPassword: string,
    username: string,
    password: string,
    email: string,
    role: string,
    company: string
}


const CreateUser = () => {
    const errorMessage = useError()
    const navigate = useNavigate();
    const queryClient = useQueryClient()


    const form = useForm({
        initialValues: { username: '', password: '', email: '', confirmPassword: '', role: '', company: '' },
        // functions will be used to validate values at corresponding key
        validate: {
            username: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
            password: (value) => (value.length < 8 ? 'Password must have at least 5 letters' : null),
            confirmPassword: matchesField('password', 'Passwords are not the same'),
            email: isEmail('Invalid email'),
            role: isNotEmpty('Select role'),
            company: isNotEmpty('Select company')


        },
    });

    const { isSuccess, data } = useQuery({
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
            if (e instanceof Error) {
                showErorNotification(e.message)
            }
            else {
                showErorNotification("Unknown Error")
            }
        },
    })


    const createUser = useMutation({
        mutationFn: async (input: UserRe) => {
            const { confirmPassword, ...info } = input
            return await userService.createUser(info)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            navigate('/user')

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

    if (!isSuccess) {
        return <>404</>
    }


    const companyOption = data.map(a => ({
        value: a.name,
        label: a.name
    })
    )

    const roleOption = [
        {
            value: "admin",
            label: "Admin"
        },
        {
            value: "user",
            label: "User"
        }
    ]
    




    return (
        <>
            <Box maw={320}>
                <form onSubmit={form.onSubmit(data => createUser.mutate(data))}>
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
                        <Select data={roleOption}
                            {...form.getInputProps('role')} size="md" />
                    </Input.Wrapper>
                    <Input.Wrapper
                        mt="1rem"
                        label="Company :" placeholder="Company"
                    >
                        <Select data={companyOption}
                            {...form.getInputProps('company')} size="md" />
                    </Input.Wrapper>
                    <Space h="md" />
                    <Button type="submit" mt="sm" disabled={createUser.isLoading}>
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