import React, { useState } from 'react';

declare global {
  interface Window {
    _env_?: {
      REACT_APP_API_ROOT: string;
    }
  }
}

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('Click the button to call the backend');
  const [count, setCount] = useState<number>(0);

  const handleClick = async () => {
    let data;
    // Use local env if defined (runs with npm run start) else use runtime injection
    const apiRoot = process.env.REACT_APP_API_ROOT || window._env_?.REACT_APP_API_ROOT || '/api';

    try {
      console.log("Process env API ROOT:", process.env.REACT_APP_API_ROOT);
      console.log("Window env API ROOT:", window._env_?.REACT_APP_API_ROOT);
      console.log("API ROOT:", apiRoot);
      const response = await fetch(`${apiRoot}/click`);
      data = await response.json();
      setMessage(data.message);
      setCount(data.count);
    } catch (error) {
      console.error('Failed to fetch from backend. Data:', data, 'Error:', error);
      setMessage('Error connecting to backend');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      <p className="mb-4">Count: {count}</p>
      <button 
        onClick={handleClick} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click Me
      </button>
    </div>
  );
}

export default App;