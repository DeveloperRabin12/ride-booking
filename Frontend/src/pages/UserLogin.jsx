import React from 'react'
import { Link } from 'react-router-dom'
import { useState , useContext} from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import userimg from '/src/assets/images/user.png';


const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState({})

  const {user, setUser} = useContext(UserDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) =>{
    e.preventDefault()
  
    const userData ={
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
    if(response.status === 200){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  return (
   <div className='p-7 h-screen flex flex-col justify-between'>
   
      <div>
      <img className=' w-20 ' src={`${userimg}`} alt="" />
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
 
                <p className='mt-2 text-center font-semibold'>Don't have an account?<Link to='/userRegister' className='text-center text-blue-800 text-lg mt-4'> Register</Link></p>
            </form>
      </div>

      <div>

        <Link to='/riderLogin' className = ' w-full flex justify-center items-center bg-blue-600 text-white  py-3 rounded-lg'>Driver Mode</Link>
      </div>
    
   </div>
  )
}

export default UserLogin