import React from 'react'
import { useState,useContext,createContext } from 'react'

export const RiderDataContext = createContext()

const RiderContext = ({children}) => {

    const [rider, setRider] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRider = (riderData) => {
        setRider(riderData);
    };

    const value = {
        rider,
        setRider,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateRider
    }
  return (
    <RiderDataContext.Provider value={value}>
        {children}
    </RiderDataContext.Provider>
  )
}

export default RiderContext