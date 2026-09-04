import { useState, useEffect } from 'react';
import { ownerAPI } from '../../api/endpoints';
import RatingStars from '../../components/RatingStars';
import DataTable from '../../components/DataTable';
import toast from 'react-hot-toast';
import { HiStar, HiUsers } from 'react-icons/hi';

const OwnerDashboard = () => {
  const [data, setData] = useState({ store: null, raters: [], averageRating: null, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await ownerAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'userName', label: 'User Name', sortable: false },
    { key: 'userEmail', label: 'Email', sortable: false },
    {
      key: 'rating',
      label: 'Rating',
      sortable: false,
      render: (val) => <RatingStars rating={val} readonly size="sm" />,
    },
    {
      key: 'ratedAt',
      label: 'Date',
      sortable: false,
      render: (val) => new Date(val).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      }),
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-screen"><div className="loading-spinner"></div><p>Loading...</p></div>
      </div>
    );
  }

  if (!data.store) {
    return (
      <div className="page-container">
        <div className="content-card empty-state">
          <h1 className="page-title">Store Owner Dashboard</h1>
          <p>No store has been assigned to your account yet. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title" id="owner-dashboard-heading">{data.store.name}</h1>
          <p className="page-subtitle">Store Owner Dashboard</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card stat-amber" id="owner-avg-rating">
          <div className="stat-icon"><HiStar /></div>
          <div className="stat-info">
            <span className="stat-value">
              {data.averageRating ? data.averageRating.toFixed(1) : '—'}
            </span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
        <div className="stat-card stat-blue" id="owner-total-ratings">
          <div className="stat-icon"><HiUsers /></div>
          <div className="stat-info">
            <span className="stat-value">{data.totalRatings}</span>
            <span className="stat-label">Total Ratings</span>
          </div>
        </div>
      </div>

      {data.averageRating && (
        <div className="content-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <RatingStars rating={data.averageRating} readonly size="lg" />
        </div>
      )}

      {/* Raters Table */}
      <div className="content-card">
        <h2 style={{ marginBottom: '1rem' }}>Ratings from Users</h2>
        <DataTable
          columns={columns}
          data={data.raters}
          loading={false}
          emptyMessage="No ratings received yet."
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;
