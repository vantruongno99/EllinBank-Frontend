import { MantineProvider } from '@mantine/core';
import { Layout } from './Layout';
import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { innerRoutes, outerRoutes } from './Routes';
import { Notifications } from '@mantine/notifications';
import { Loader } from '@mantine/core';
import authservice from './Services/auth.service';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ModalsProvider } from '@mantine/modals';


export default function App() {




  // check if token from cookie is still valid
  const isAuthenticated = async () => {
    try {
      await authservice.tokenAuth()
    }
    catch (e) {
      return false
    }
    return true

  }



  // from above , if unvalid delete cookie and the redirect
  const loader = async () => {
    const valid = await isAuthenticated()
    if (!valid) {
      authservice.logout()
      return redirect("/login");
    }
    return null;
  };



  // outerRoutes does not require cookie (token)
  // innterRoute does
  const routes = [...outerRoutes, {
    path: "/", element: <Layout />,
    loader: loader,
    children: [
      ...innerRoutes
    ]
  }
  ]
  const router = createBrowserRouter(routes)

  const queryClient = new QueryClient()


  return (
    <MantineProvider withGlobalStyles withNormalizeCSS
      theme={{
        components: {
          Input: {
            // Subscribe to theme and component params
            styles: (theme) => ({
              input: {
                '&:disabled':
                {
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                  opacity: 1
                },
              }
            }),
          },
        },
      }}
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}