import React, { useEffect, useState } from 'react'
import * as jwt from "jwt-decode"
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@nextui-org/react'

const HomePage = () => {
    const [data, setData] = useState<any | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (Cookies.get("access_token")) {
            const payload = jwt.jwtDecode(Cookies.get("access_token") as string);

            if (!payload) navigate("/auth/sign-in");

            const fetchData = async () => {
                const response = await axios.get("http://localhost:8080/users/me", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("access_token")}`
                    }
                });

                setData(response.data);
            }

            fetchData()
        } else {
            navigate("/auth/sign-in");
        }

    }, [Cookies.get("access_token")])

    const handleLogOut = () => {
        Cookies.remove("access_token")
        navigate("/")
    }

    const handleVerify = async () => {
        await axios.get("http://localhost:8080/verify/confirm", {
            headers: {
                Authorization: `Bearer ${Cookies.get("access_token")}`
            }
        })
    }

    return (
        data ? (
            <div className='max-w-[1200px] mx-auto p-5'>
                <header className='bg-slate-100 shadow-2xl border border-solid border-slate-200 items-center rounded-3xl flex justify-between p-5'>
                    <p className='text-lg text-black font-bold'>{data.email}</p>
                    <button onClick={handleLogOut} className='px-5 py-3 bg-red-500 cursor-pointer text-lg text-white rounded-2xl'>Log out</button>
                </header>
                <div className="flex mt-20 gap-10 items-center">    
                    <h1 className='text-3xl font-extrabold'>Is Verified: <span style={{ color: data.verified ? "#0f0" : "#f00" }}>{data.verified.toString()}</span></h1>
                    {
                        !data.verified ? (
                            <Button onClick={handleVerify} color='success' variant='flat'>Verify</Button>
                        ) : ""
                    }
                </div>
            </div>
        ) : <div></div>
    )
}

export default HomePage