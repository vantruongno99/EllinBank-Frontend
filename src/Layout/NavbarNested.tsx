import { useState, useEffect } from "react"
import { Navbar, Group, Code, ScrollArea, createStyles, rem } from '@mantine/core';
import {
  IconUsers,
  IconHome,
  IconDevices,
  IconBook2,
  IconDatabaseExport,
  IconBrandCoinbase
} from '@tabler/icons-react';
import Cookies from 'js-cookie';
import { LinksGroup } from './LinksGroup';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },
  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
  },
}));

export function NavbarNested() {
  const { classes } = useStyles();

  const data = [
    { label: 'Dashboard', icon: IconHome, link: '/' },
    {
      label: 'Devices',
      icon: IconDevices,
      links: [
        { label: 'List', link: '/device' },
        { label: 'Create', link: '/device/new' },
      ],
    },
    {
      label: 'Tasks',
      icon: IconBook2,
      links: [
        { label: 'List', link: '/task' },
        { label: 'Create', link: '/task/new' }
          ],
    },
    
  
  ];
  
  const isAdmin = Cookies.get('role') !== "user"
  
  
  isAdmin && data.push({
    label: 'Managemenet',
    icon: IconUsers,
    links: [
      { label: 'Users', link: '/user' },
      { label: 'Companies', link: '/company' }
        ],
  },)
  
  data.push(  { label: 'Data Export', icon: IconDatabaseExport, link: '/export' }
  )
  

  const links = data.map((item) => <LinksGroup {...item} key={item.label} />);
  
  return (
    <Navbar height='auto' p='lg' width={{
      sm: 200,
      lg: 250,
      base: 125,
    }}
      className={classes.navbar}>
      <Navbar.Section grow className={classes.links}>
        {links}
      </Navbar.Section>

    </Navbar>
  );
}