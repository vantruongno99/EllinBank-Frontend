import React from "react"
import { useForm } from '@mantine/form';
import { NumberInput, TextInput, Button, Box, Space , Input } from '@mantine/core';
import deviceService from "../../Services/device.service";
import { DeviceInput } from "../../Ultils/type";
import { useError } from "../../Hook";
import { useNavigate } from "react-router-dom";
import { useMutation , useQueryClient } from "@tanstack/react-query";
import { showErorNotification } from "../../Ultils/notification";

const CreateDevice = () => {
    const errorMessage = useError()
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { id: '', name: '' },
        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
            id: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        },
    });

    const createDevice = useMutation({
        mutationFn: async (input: DeviceInput) => {
            return await deviceService.createDevice(input)
        },
        onSuccess: () => {
            navigate("/device")
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
                <form onSubmit={form.onSubmit(data => createDevice.mutate(data))}>
                    <Input.Wrapper
                        
                        label="ID :" placeholder="ID"
                    >
                        <TextInput  {...form.getInputProps('id')} />
                    </Input.Wrapper>
                    <Space h="xs" />
                    <Input.Wrapper
                        
                        label="Name :" placeholder="Name"
                    >
                    <TextInput {...form.getInputProps('name')} />
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

export default CreateDevice