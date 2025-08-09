import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom' 
import { RiderDataContext } from '../context/RiderContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import riderimg from '/src/assets/images/rider.png';

const RiderLogin = () => {
   const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {rider, setRider} = useContext(RiderDataContext)
    const navigate = useNavigate()

  
    const submitHandler = async (e) =>{
      e.preventDefault()
      const rider =  {
        email: email,
        password: password
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/riders/login`,rider)
      if(response.status === 200){
        const data = response.data
        setRider(data.rider)
        localStorage.setItem('token', data.token)
        navigate('/riderHome')
      }
     
      setEmail('')
      setPassword('')
    }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>

    <div>
    <img className=' w-20 ' src={`${riderimg}`} alt="" />
          <form onSubmit={(e)=>{
            submitHandler(e)
          }} action="" className='mt-10'>
              <h3 className='text-xl font-medium mb-2'>Enter the email</h3>
              <input   className='bg-[#c5c2c2] text-lg mb-5  rounded px-4 py-2 border w-full'
              required 
              value={email}
              onChange={(e)=>{
               
                setEmail(e.target.value)
              }}
              type="email"
              placeholder='something@example.com'/>
              <h3 className='text-xl font-medium mb-2'>Enter password</h3>
              <input className='bg-[#c5c2c2] mb-5 text-lg  rounded px-4 py-2 border w-full'
              required 
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
              type="password" 
              placeholder='********'/>
              <button className = ' w-full bg-black text-white mt-4 py-3 rounded-lg'
              >Log In</button>

              <p className='mt-2 text-center font-semibold'>Want to be a Rider?<Link to='/riderRegister' className='text-center text-lg text-blue-800 mt-4'> Register Here</Link></p>
          </form>
    </div>

    <div>

      <Link to='/login' className = ' w-full flex justify-center items-center bg-green-600 text-white  py-3 rounded-lg'>Passenger Mode</Link>
    </div>
  
 </div>
  )
}

export default RiderLogin