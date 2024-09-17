// SocketContext.js
import React, { createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io("https://ec2-54-211-127-150.compute-1.amazonaws.com");


export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
