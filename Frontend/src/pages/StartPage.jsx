import React from 'react'
import { Link } from 'react-router-dom'
import image1 from '../assets/images/image1.jpeg'

const StartPage = () => {
  return (
    <div>
      <div style={{ backgroundImage: `url(${image1})` }} className='bg-cover bg-center pt-5 h-screen w-full flex justify-between flex-col bg-[#33a852]' >
        <img className=' w-20 ml-8' src="https://imgs.search.brave.com/yfhjvPmbpij5DnmuCDlZMi4F2HgTGPqGRKLV3SCp3LM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NDExMDE0MjcvZmls/ZS9vcmlnaW5hbC0y/YTY2NmQxMzUzOWRh/MzdkNzg1ZmVmODAy/ZWIyOTk2Ni5qcGc_/cmVzaXplPTQwMHgw" alt="" />
        <div className='bg-white pb-5 py-5 px-5'>
          <h2 className='text-3xl font-bold text-center mb-6'>Let's Start the Ride</h2>

          {/* User Mode */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold mb-2 text-gray-700'>Looking for a ride?</h3>
            <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors'>
              Start as Passenger
            </Link>
          </div>

          {/* Rider Mode */}
          <div className='mb-4'>
            <h3 className='text-lg font-semibold mb-2 text-gray-700'>Want to drive?</h3>
            <div className='flex gap-2'>
              <Link to='/riderLogin' className='flex-1 bg-green-600 text-white py-3 rounded-lg text-center hover:bg-green-700 transition-colors'>
                Rider Login
              </Link>
              <Link to='/riderRegister' className='flex-1 bg-blue-600 text-white py-3 rounded-lg text-center hover:bg-blue-700 transition-colors'>
                Become a Rider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPage