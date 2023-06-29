import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { useNavigate } from "react-router-dom"

const useStyles = createStyles((theme) => ({
    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`
        },
    paper: {
        '&:hover': {
            backgroundColor: theme.colors.gray[0],
            color:  theme.black,
        }
    }
}));

interface StatsGridIconsProps {
    data: { name: string; value: number; icon: React.FC, link: string }[];
}

export function StatsGridIcons({ data }: StatsGridIconsProps) {
    const navigate = useNavigate();
    const { classes } = useStyles();
    const stats = data.map((stat) => {

        return (
            <Paper withBorder p="md" radius="md" key={stat.name} className={classes.paper} onClick={() => navigate(stat.link)}>
                <Group position="apart">
                    <div>
                        <Text c="dimmed" tt="uppercase" fw={500} fz="xs" className={classes.label}>
                            {stat.name}
                        </Text>
                        <Text fw={500} fz="xl">
                            {stat.value}
                        </Text>
                    </div>
                    <ThemeIcon
                        color='blue'
                        variant="light"
                        size={38}
                        radius="md"
                    >
                        <stat.icon />
                    </ThemeIcon>
                </Group>
            </Paper>
        );
    });

    return (
        <div >
            <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                {stats}
            </SimpleGrid>
        </div>
    );
}