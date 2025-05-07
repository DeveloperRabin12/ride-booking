import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom' 

const RiderLogin = () => {
   const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    const [userData, setUserData] = useState({})
  
    const submitHandler = (e) =>{
      e.preventDefault()
      setUserData({
        email: email,
        password: password})
  
      console.log(userData)
      setEmail('')
      setPassword('')
    }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
    <div>
    <img className=' w-20 ' src="https://imgs.search.brave.com/yfhjvPmbpij5DnmuCDlZMi4F2HgTGPqGRKLV3SCp3LM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NDExMDE0MjcvZmls/ZS9vcmlnaW5hbC0y/YTY2NmQxMzUzOWRh/MzdkNzg1ZmVmODAy/ZWIyOTk2Ni5qcGc_/cmVzaXplPTQwMHgw" alt="" />
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

      <Link to='/login' className = ' w-full flex justify-center items-center bg-blue-600 text-white  py-3 rounded-lg'>Looking for Ride?</Link>
    </div>
  
 </div>
  )
}

export default RiderLogin