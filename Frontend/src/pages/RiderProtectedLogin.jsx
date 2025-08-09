import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useContext } from 'react'
import { RiderDataContext } from '../context/RiderContext'
import axios from 'axios'


const RiderProtectedLogin = ({children}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { rider, setRider } = useContext(RiderDataContext)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (!token) {
            navigate('/riderLogin');
        }
    }, [token, navigate]);
    axios.get(`${import.meta.env.VITE_BASE_URL}/riders/profile`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response =>{
        if (response.status === 200) {
            setRider(response.data)
            setIsLoading(false)
        }
    }).catch(error => {
      
        localStorage.removeItem('token')
        navigate('/riderLogin')
    })
    
  return (
    <div>loading....</div>
  )
}

export default RiderProtectedLogin