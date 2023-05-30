import React, { useState, useEffect } from "react"
import userService from "../../Services/user.service"
import { Table, Anchor, Button, Group, Space, Text } from '@mantine/core'
import { UserInfo } from "../../Ultils/type"
import { useLocation ,useNavigate} from 'react-router-dom';




const Users = () => {
    const [users, setUsers] = useState<UserInfo[]>([])
    const navigate = useNavigate()

    const getUsers = async () => {
        try {
            const res: any[] | undefined = await userService.getAllUsers()
            if (res && res?.length > 0) {
                console.log(res)
                setUsers(res)
            }
        }

        catch {

        }
    }

    const location = useLocation();


    const rows = users.map((element) => (
        <tr key={element.id}>
               <td> <Anchor href={`${location.pathname}/${element.username}`} target="_blank">
                {element.username}
            </Anchor></td>
            <td>{element.email}</td>
            <td>{element.role}</td>
        </tr>
    ))



    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <Group position="right">
                <Button onClick={() => navigate(`${location.pathname}/new`)}>
                    New User
                </Button>
            </Group>
            <Space h="xl" />
            <Table fontSize="md">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default Users
