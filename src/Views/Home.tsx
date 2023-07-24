import React, { useState, useEffect } from "react"
import {  IconDevices, IconBook2 } from '@tabler/icons-react';
import statService from "../Services/stat.service";
import { StatsGridIcons } from "../Components/Group";
import { useQuery} from "@tanstack/react-query";
import handleFunctionError from "../Ultils/handleFunctionError";
interface StatDetail {
    name: string,
    value: number,
    icon: React.FC,
    link : string
}


const Home = () => {
    const [stat, setStat] = useState<StatDetail[]>([])


    const { isLoading, error, isError, data } = useQuery({
        queryKey: ['stat'],
        queryFn: async () => {
            const res = await statService.getStat()
            return res
        },
        onSuccess: (data) => {
            data &&  setStat(
                [
                    { name: "Total Devices", value: data.numberOfDevices, icon: IconDevices , link :'/device' },
                    { name: "Total Tasks", value: data.numberOfTasks, icon: IconBook2 ,link :'/task'},
                    { name: "Ongoing Tasks", value: data.numberOfOngoingTasks, icon: IconBook2 ,link :'/task'}
                ]
            )
        },
        onError: (e) => {
            handleFunctionError(e)
        },
    })



    return (
        <>
            <StatsGridIcons data={stat} />
        </>
    )
}

export default Home