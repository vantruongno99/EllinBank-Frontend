import { useState } from 'react';
import {
  AppShell,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Box
} from '@mantine/core';
import Nav from './Navbar';
import { NavbarNested } from './NavbarNested';
import CustomHeader from './Header';
import { Outlet } from 'react-router-dom';

export default function AppShellDemo() {
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <NavbarNested />
      }
      footer={
        <Footer height={60} p="md">
          CTI 2023
        </Footer>
      }
      header={
            <CustomHeader />
      }
    >
      <Box p={20}>
        <Outlet />
      </Box>
    </AppShell>
  );
} 
