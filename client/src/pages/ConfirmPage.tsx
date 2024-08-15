import { Button } from '@nextui-org/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ConfirmPage = () => {
    const [data, setData] = useState<any>(null);
    const params = new URLSearchParams(window.location.search);

    const navigate = useNavigate()

    useEffect(() => {
        const payload = jwtDecode(params.get("token") as string);

        if (!payload) {
            navigate("/")
            return
        };

        if (params.get("from")) {
            Cookies.set("access_token", params.get("from") as string)
        }

        setData(payload);
    }, [])

    const handleConfirm = async () => {
        try {
            await axios.get("http://localhost:8080/verify/set", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("access_token")}`
                }
            })
            navigate("/")
        } catch (err: unknown) {
            console.log(err);

        }
    }

    return (
        data ? (
            <div className='p-16 flex flex-col justify-center items-center gap-5'>
                <h1 className='text-2xl font-extrabold'>Confirm your email ({data.user.email})</h1>
                <p className='max-w-[1000px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi velit esse rerum quod vitae aliquam, at corrupti blanditiis error deleniti, voluptatem illum. Qui corrupti officiis omnis corporis eum porro blanditiis molestias libero illo aperiam, odio laudantium enim? Veniam tempore, hic atque, voluptas dignissimos totam, quos aliquam et debitis dolores optio blanditiis alias recusandae fuga consectetur? Doloremque deserunt aliquam praesentium dolor quod neque sed delectus sapiente labore, nulla dignissimos eveniet voluptatem non laborum odit. Sapiente porro pariatur atque, voluptas magnam numquam a iure ipsum maxime odio hic nostrum temporibus corrupti, iste nobis nam repellat illo, iusto delectus tenetur voluptatum perspiciatis rerum error explicabo! Recusandae consectetur quas sed aperiam aliquam, repellat sit assumenda veniam amet unde est harum sapiente, explicabo maxime architecto, error id asperiores. Molestiae dolores dolor consequatur vero nam, omnis autem asperiores corporis non hic possimus ducimus vitae quibusdam voluptas quis quisquam rem fuga quas ab alias a temporibus illo eligendi. Deserunt consectetur culpa, quas id soluta deleniti eos iste nesciunt consequatur beatae eligendi distinctio, perferendis praesentium laudantium corrupti facilis debitis sapiente iure doloribus quasi officiis aperiam aliquid! Perspiciatis maiores accusantium ratione tempora ullam hic numquam consectetur molestias delectus saepe excepturi voluptates eius iure voluptatem unde consequuntur, maxime libero recusandae impedit sequi. Perferendis libero maxime labore enim fugit qui similique dolorem praesentium excepturi id nesciunt autem doloremque itaque magni minima, dignissimos consectetur consequuntur corporis cum iste nobis. Facilis, consectetur rem ad quis sed ex adipisci excepturi accusamus cum, et quam dolor eius recusandae explicabo commodi nemo. Doloremque quod quo placeat! Nobis nostrum quod similique facilis tempore. Optio iure placeat voluptatibus animi quo tempore architecto. Architecto, ullam voluptatem? Suscipit laborum explicabo veritatis. Nemo veritatis, consequatur quidem soluta consectetur ea molestias quam? Expedita molestias accusantium harum cupiditate eligendi est dolores impedit illo dolor, quas maxime totam earum debitis eius vero deserunt praesentium, deleniti commodi et, consectetur iste! Sint eaque tempore beatae tempora iste provident, quam commodi in eos tenetur numquam dolores dolore autem blanditiis rerum officiis quisquam odit magnam earum unde quasi debitis ullam at!</p>
                <Button onClick={handleConfirm} size='lg' color='success' variant='flat'>Confirm Account</Button>
            </div>
        ) : <>token not valid</>
    )
}

export default ConfirmPage