import React, { useState } from 'react';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('Click the button to call the backend');
  const [count, setCount] = useState<number>(0);

  const handleClick = async () => {
    try {
      // Calling the FastAPI endpoint
      console.log(process.env.REACT_APP_API_ROOT);
      const response = await fetch(`${process.env.REACT_APP_API_ROOT}/api/click`);
      const data = await response.json();
      setMessage(data.message);
      setCount(data.count);
    } catch (error) {
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