// SocketContext.js
import React, { createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io("https://ec2-44-220-156-213.compute-1.amazonaws.com");


export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
