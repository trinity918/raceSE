import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in, redirect if not
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <p className="text-xl">Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;