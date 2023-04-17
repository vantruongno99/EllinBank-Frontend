import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
    Space,
} from '@mantine/core';
import { LoginDetail } from '../Ultils/type';
import authservice from '../Services/auth.service';
import { useNavigate } from "react-router-dom";
import { useError } from '../Hook';
import '../App.css'


const useStyles = createStyles((theme) => ({

      form: {
        minHeight: rem(2000),
        maxWidth: rem(1000),
        paddingTop: rem(80),
    
        [theme.fn.smallerThan('sm')]: {
          maxWidth: '100%',
        },
      },
    
      title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      },
    }));

export function Login() {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const errorMessage = useError()




    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },

        validate: {
            username: (val) => (val.length <= 3 ? 'Password should include at least 6 characters' : null),
            password: (val) => (val.length <= 3 ? 'Password should include at least 6 characters' : null),
        },
    });

    const handleLogin = async (detail: LoginDetail) => {
        try {
            await authservice.loging(detail)
             navigate("/");

        }
        catch (error: any) {
            errorMessage.set(error.message)
            console.log(error)
        }
    }


    return (
        <div>
            <form onSubmit={form.onSubmit(handleLogin)}>
                <Paper className={classes.form} radius={0} p={40} >
                    <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                        Welcome back 
                    </Title>
                    <TextInput label="Username" placeholder="Username :" {...form.getInputProps('username')} size="md" />
                    <PasswordInput label="Password :" placeholder="Your password" mt="md" size="md" {...form.getInputProps('password')} />
                    <Space h="md" />
                    <Button fullWidth mt="xl" size="md" type='submit'>
                        Login
                    </Button>
                    <Text size='sm' color='red'>{errorMessage.value}</Text>
                </Paper>
            </form>

        </div>

    );
}

export default Login