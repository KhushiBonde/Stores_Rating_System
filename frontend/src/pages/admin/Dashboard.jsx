import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/endpoints';
import { HiUsers, HiShoppingBag, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <HiUsers />,
      color: 'blue',
      id: 'stat-users',
    },
    {
      title: 'Total Stores',
      value: stats.totalStores,
      icon: <HiShoppingBag />,
      color: 'emerald',
      id: 'stat-stores',
    },
    {
      title: 'Total Ratings',
      value: stats.totalRatings,
      icon: <HiStar />,
      color: 'amber',
      id: 'stat-ratings',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" id="admin-dashboard-heading">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your platform</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.id} className={`stat-card stat-${card.color}`} id={card.id}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <span className="stat-value">
                {loading ? '...' : card.value.toLocaleString()}
              </span>
              <span className="stat-label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
