import React from 'react'
import { UserDataContext } from '../context/UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

const SecureLogin = ({children}) => {

    const token =localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
     const [ isLoading, setIsLoading ] = useState(true)
useEffect(() => {
    if (!token) {
      navigate('/login');
    }

    axios.get('http://localhost:4000/users/profile/',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 200) {
        setUser(response.data)
         setIsLoading(false)
      }
    })
    .catch(error => {
      console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
    })
    
  }, [token, navigate]);
  return (
    <div>
        {children}
    </div>
  )
}

export default SecureLogin