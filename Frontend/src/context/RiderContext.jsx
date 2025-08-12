import React from 'react'
import { useState, useContext, createContext } from 'react'

export const RiderDataContext = createContext()

// Custom hook to use rider context
export const useRider = () => {
    const context = useContext(RiderDataContext);
    if (!context) {
        throw new Error('useRider must be used within a RiderContext');
    }
    return context;
};

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