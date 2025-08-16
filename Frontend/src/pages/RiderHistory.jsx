import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiderDataContext } from '../context/RiderContext'
import axios from 'axios'

const RiderHistory = () => {
    const { rider } = useContext(RiderDataContext)
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchRideHistory()
    }, [])

    const fetchRideHistory = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            if (!token) {
                setError('Authentication required')
                return
            }

            const response = await axios.get('http://localhost:4000/riders/rides', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setRides(response.data.rides || [])
            setError(null)
        } catch (error) {
            console.error('Error fetching ride history:', error)
            setError('Failed to load ride history')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'RS 0'
        return `RS ${Number(amount).toLocaleString()}`
    }

    const formatDistance = (km) => {
        if (km === undefined || km === null) return '0.0 km'
        return `${Number(km).toFixed(1)} km`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'ongoing':
                return 'bg-blue-100 text-blue-800'
            case 'accepted':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (!rider) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/riderHome"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <i className="ri-arrow-left-line text-xl text-gray-600"></i>
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Ride History</h1>
                            <p className="text-sm text-gray-500">View your completed rides</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-4">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-center text-red-500">
                            <i className="ri-error-warning-line text-4xl mb-4"></i>
                            <p className="text-lg">{error}</p>
                            <button
                                onClick={fetchRideHistory}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : rides.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-center text-gray-500">
                            <i className="ri-route-line text-4xl mb-4"></i>
                            <p className="text-lg">No rides completed yet</p>
                            <p className="text-sm">Complete your first ride to see it here</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Your Rides</h2>
                            <button
                                onClick={fetchRideHistory}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <i className="ri-refresh-line"></i>
                                Refresh
                            </button>
                        </div>

                        <div className="space-y-4">
                            {rides.map((ride) => (
                                <div key={ride._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i className="ri-route-line text-blue-500"></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {ride.pickup} → {ride.destination}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(ride.completedAt || ride.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                                            {ride.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="text-center">
                                            <p className="text-gray-500">Distance</p>
                                            <p className="font-medium text-gray-800">{formatDistance(ride.distance)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500">Earnings</p>
                                            <p className="font-medium text-green-600">{formatCurrency(ride.riderEarnings)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500">Fare</p>
                                            <p className="font-medium text-gray-800">{formatCurrency(ride.fare)}</p>
                                        </div>
                                    </div>

                                    {ride.otp && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">OTP: <span className="font-mono font-medium">{ride.otp}</span></p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RiderHistory
