import React from "react"
import { useForm ,isNotEmpty} from '@mantine/form';
import { NumberInput, TextInput, Button, Box, Space , Input } from '@mantine/core';
import companyService from "../../Services/company.service";
import { CompanyInput } from "../../Ultils/type";
import { useError } from "../../Hook";
import { useNavigate } from "react-router-dom";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";

const CreateCompany = () => {
    const errorMessage = useError()
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { name: '' },
        // functions will be used to validate values at corresponding key
        validate: {
            name: isNotEmpty("name is required"),
        },
    });

    const createCompany = useMutation({
        mutationFn: async (input: CompanyInput) => {
            return await companyService.createCompany(input)
        },
        onSuccess: () => {
            navigate("/company")
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


    return (
        <>
            <Box maw={320}>
                <form onSubmit={form.onSubmit(data => createCompany.mutate(data))}>
                    <Input.Wrapper
                        
                        label="Name :" placeholder="Name"
                    >
                    <TextInput {...form.getInputProps('name')} />
                    </Input.Wrapper>

                    <Space h="md" />
                    <Button type="submit" disabled={createCompany.isLoading} mt="sm">
                        Save
                    </Button>
                    <Space h="md" />
                    {errorMessage.value}
                </form>
            </Box>
        </>
    )
}

export default CreateCompany