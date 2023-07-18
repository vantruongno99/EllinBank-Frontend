import React from "react";


const Home = React.lazy(() => import("../Views/Home"));
const Tasks = React.lazy(() => import("../Views/Task/Tasks"));
const Devices = React.lazy(() => import("../Views/Device/Devices"));
const Device = React.lazy(() => import("../Views/Device/Device"));
const CreateDevice = React.lazy(() => import("../Views/Device/CreateDevice"));
const CreateTask = React.lazy(() => import("../Views/Task/CreateTask"));
const Task = React.lazy(() => import("../Views/Task/Task"));
const Profile = React.lazy(() => import("../Views/Profile"));
const Users = React.lazy(() => import("../Views/User/Users"));
const User = React.lazy(() => import("../Views/User/User"));
const CreateUser = React.lazy(() => import("../Views/User/CreateUser"));
const Companies =  React.lazy(() => import("../Views/Company/Companies"));
const Company =  React.lazy(() => import("../Views/Company/Company"));
const CreateCompany = React.lazy(() => import("../Views/Company/CreateCompany"));



const innerRoutes = [
    { path: '/', element: <Home /> },
    { path: '/task/:id', element: <Task /> },
    { path: '/task/new', element: <CreateTask /> },
    { path: '/task', element: <Tasks /> },
    { path: '/device/:id', element: <Device /> },
    { path: '/device', element: <Devices /> },
    { path: '/device/new', element: <CreateDevice /> },
    { path: '/profile', element: <Profile /> },
    { path: '/user', element: <Users /> },
    { path: '/user/:username', element: <User /> },
    { path: '/user/new', element: <CreateUser /> },
    { path: '/company', element: <Companies /> },
    { path: '/company/:name', element: <Company /> },
    { path: '/company/new', element: <CreateCompany /> },


]

export default innerRoutes

