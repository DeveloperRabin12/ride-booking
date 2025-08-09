
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`http://localhost:4000`); // Replace with your server URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('✅ Socket connected to server with ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected from server');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });

        // return () => {
        //     socket.disconnect();
        // }

    }, []);






    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;