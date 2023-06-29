import React, { useState, useEffect } from "react"
import {  IconDevices, IconBook2 } from '@tabler/icons-react';
import statService from "../Services/stat.service";
import { StatsGridIcons } from "../Components/Group";

interface StatDetail {
    name: string,
    value: number,
    icon: React.FC,
    link : string
}


const Home = () => {
    const [data, setData] = useState<StatDetail[]>([])


    const getStat = async () => {
        try {
            const res = await statService.getStat()
            if (res) {
                setData(
                    [
                        { name: "Total Devices", value: res.numberOfDevices, icon: IconDevices , link :'/device' },
                        { name: "Total Tasks", value: res.numberOfTasks, icon: IconBook2 ,link :'/task'},
                        { name: "Ongoing Tasks", value: res.numberOfOngoingTasks, icon: IconBook2 ,link :'/task'}
                    ]
                )
            }

        }
        catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getStat()
    }, [])



    return (
        <>
            <StatsGridIcons data={data} />
        </>
    )
}

export default Home