import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the WebSocket context type
type WebSocketContextType = WebSocket | null;

// Create a WebSocket context
const WebSocketContext = createContext<WebSocketContextType>(null);

interface WebSocketProviderProps {
  url: string;
  token: string;
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, token, children }) => {
  const [ws, setWs] = useState<WebSocketContextType>(null);

  useEffect(() => {
    const webSocket = new WebSocket(url+"?token="+token);
    
    webSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    
    webSocket.onmessage = (event) => {
      console.log('Message received from server: ', event.data);
    };
    
    webSocket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };
    
    webSocket.onclose = (event) => {
      console.log('WebSocket connection closed: ', event);
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, [url, token]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  return useContext(WebSocketContext);
};


export function webSocketManager(url : string , token : string){

    const ws = new WebSocket(url+'?token='+token);



    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    
    
    
      // Send a ping message
      ws.send(JSON.stringify({ type: 'ping' }));
    
      // Send a general message
      ws.send(JSON.stringify({ type: 'message', content: 'Hello, server!' }));
    };
    
    ws.onmessage = (event) => {
      console.log('Received message from server:', event.data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

}
