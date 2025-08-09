import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiderDataContext } from '../context/RiderContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import riderimg from '/src/assets/images/rider.png';


const RiderRegister = () => {

  const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    
     const [ vehicleColor, setVehicleColor ] = useState('')
     const [ vehiclePlate, setVehiclePlate ] = useState('')
     const [ vehicleType, setVehicleType ] = useState('')

     const {rider, setRider} = useContext(RiderDataContext)
  
    const submitHandler = async (e) =>{
      e.preventDefault()
      const newRider ={
        email: email,
        password: password,
       fullname:{
          firstname: firstName,
          lastname: lastName
        },
        vehicle: {
          color: vehicleColor,
          numberPlate: vehiclePlate,
          vehicleType: vehicleType
        }
      }
      const response = await axios.post(`http://localhost:4000/riders/register`,newRider)
      if(response.status === 201){
        const data = response.data
        setRider(data.rider)
        localStorage.setItem('token', data.token)
        navigate('/riderLogin')
      }
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setVehicleColor('')
      setVehiclePlate('')
      setVehicleType('')
    }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      
      <div>
      <img className=' w-20 ' src={`${riderimg}`} alt="" />
            <form onSubmit={(e)=>{
              submitHandler(e)
            }}  className='mt-10'>

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

                 <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>

            </select>
          </div>
                <button className = ' w-full bg-black text-white mt-4 py-3 rounded-lg'
                >Register</button>
 
                <p className='mt-2 text-center font-semibold'>Already a rider?<Link to='/riderLogin' className='text-center text-blue-800 text-lg mt-4'>Log in</Link></p>
            </form>
      </div>

      <div>

        {/* <Link to='/riderLogin' className = ' w-full flex justify-center items-center border-2 bg-green-600 text-white py-3 rounded-lg'>Log In as Passenger</Link> */}
      </div>
    
   </div>
  )
}

export default RiderRegister