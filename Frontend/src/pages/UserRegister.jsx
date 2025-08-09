
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'
import { useContext } from 'react'
import userimg from '/src/assets/images/user.png';


const UserRegister = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [userData, setUserData] = useState({})

  const navigate = useNavigate()
  const {user, setUser} = useContext(UserDataContext)


  const submitHandler = async (e) =>{
    e.preventDefault()
    const newUser ={
      email: email,
      password: password, 
      fullname:{
        firstname: firstName,
        lastname: lastName
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)
    if(response.status === 201){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/login')
    }
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
     
      <div>
      <img className=' w-20 ' src={`${userimg}`} alt="" />
            <form onSubmit={(e)=>{
              submitHandler(e)
            }} action="" className='mt-10'>

              <h3 className='text-lg font-medium mb-2'>Enter your Name</h3>
              <div className='flex gap-4'>
              <input   className='bg-[#c5c2c2] text-lg mb-5 w-1/2  rounded px-4 py-2 border'
                required 
                value={firstName}
                onChange={(e)=>{
                  setFirstName(e.target.value)
                }}
                type="text"
                placeholder='First Name'/>

                <input   className='bg-[#c5c2c2] text-lg mb-5 w-1/2  rounded px-4 py-2 border'
                required
                value={lastName}
                onChange={(e)=>{
                  setLastName(e.target.value)
                }} 
                type="text"
                placeholder='Last Name'/>
              </div>
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
                >Register</button>
 
                <p className='mt-2 text-center font-semibold'>Already have an account<Link to='/login' className='text-center text-blue-800 text-lg mt-4'> Login </Link></p>
            </form>
      </div>

      <div>

        {/* <Link to='/riderLogin' className = ' w-full flex justify-center items-center bg-blue-600 text-white  py-3 rounded-lg'>Log In Driver</Link> */}
      </div>
    
   </div>
  )
}

export default UserRegister