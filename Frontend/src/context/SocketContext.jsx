
import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

const socket = io(`http://localhost:4000`, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('✅ Connected to server with socket ID:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
        });

        socket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });

        // Test notification listener
        socket.on('test-notification', (data) => {
            console.log('🧪 Test notification received:', data);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('error');
            socket.off('test-notification');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;