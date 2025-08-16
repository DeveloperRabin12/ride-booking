import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiderDataContext } from '../context/RiderContext'
import axios from 'axios'

const RiderProtectedLogin = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { rider, setRider } = useContext(RiderDataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/riderLogin')
            return
        }

        // Fetch rider profile
        const fetchRiderProfile = async () => {
            try {
                console.log('🔍 Fetching rider profile...');
                const response = await axios.get(`http://localhost:4000/riders/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log('📊 Rider profile response:', response);
                console.log('📊 Response data:', response.data);
                console.log('📊 Response status:', response.status);

                if (response.status === 200) {
                    console.log('✅ Setting rider data:', response.data);
                    // Extract rider data from the wrapped response
                    const riderData = response.data.rider || response.data;
                    console.log('📊 Extracted rider data:', riderData);
                    setRider(riderData)
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('❌ Error fetching rider profile:', error)
                console.error('❌ Error details:', error.response?.data)
                localStorage.removeItem('token')
                navigate('/riderLogin')
            }
        }

        fetchRiderProfile()
    }, [token, navigate, setRider])

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading rider profile...</p>
                </div>
            </div>
        )
    }

    return children
}

export default RiderProtectedLogin