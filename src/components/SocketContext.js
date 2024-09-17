// SocketContext.js
import React, { createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io("https://scaleupapp.club");


export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
