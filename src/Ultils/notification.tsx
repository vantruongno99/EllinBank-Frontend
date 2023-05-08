import { notifications } from '@mantine/notifications';

const showSuccessNotification = (message: string) => {
    notifications.show({
        title : "Success",
        message: message,
    })
}

const showErorNotification = (message: string) => {
    notifications.show({
        title : "Error",
        message: message,
        color: 'red',
        styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],

              '&::before': { backgroundColor: theme.white },
            },

            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] },
            },
          }),
    })
}

export {showSuccessNotification ,showErorNotification}