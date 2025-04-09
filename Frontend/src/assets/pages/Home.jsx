import React from 'react'
import { Link } from 'react-router-dom'
import image1 from '../images/image1.jpeg'


const Home = () => {
  return (
    <div> 
        <div   style={{ backgroundImage: `url(${image1})` }}  className='bg-cover bg-center pt-5 h-screen w-full flex justify-between flex-col bg-[#33a852]' >
           <img className=' w-20 ml-8' src="https://imgs.search.brave.com/yfhjvPmbpij5DnmuCDlZMi4F2HgTGPqGRKLV3SCp3LM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NDExMDE0MjcvZmls/ZS9vcmlnaW5hbC0y/YTY2NmQxMzUzOWRh/MzdkNzg1ZmVmODAy/ZWIyOTk2Ni5qcGc_/cmVzaXplPTQwMHgw" alt="" />
            <div className='bg-white pb-5 py-5 px-5'>
                <h2 className='text-3xl font-bold'>Lets start the Ride</h2>
                <Link to='/login' className=' flex items-center justify-center w-full bg-black text-white mt-4 py-3 rounded-lg' >Start</Link>
            </div>
        </div>
    </div>
  )
}

export default Home;