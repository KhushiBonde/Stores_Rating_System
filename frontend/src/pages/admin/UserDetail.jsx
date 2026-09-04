import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import RatingStars from '../../components/RatingStars';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiUser, HiMail, HiLocationMarker, HiShieldCheck } from 'react-icons/hi';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await adminAPI.getUserById(id);
      setUser(response.data.data);
    } catch (error) {
      toast.error('Failed to load user details.');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = { ADMIN: 'Admin', NORMAL_USER: 'Normal User', STORE_OWNER: 'Store Owner' };
    return labels[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const classes = { ADMIN: 'badge badge-red', NORMAL_USER: 'badge badge-blue', STORE_OWNER: 'badge badge-emerald' };
    return classes[role] || 'badge';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-screen"><div className="loading-spinner"></div><p>Loading...</p></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/admin/users')} id="back-to-users" style={{ marginBottom: '1rem' }}>
        <HiArrowLeft /> Back to Users
      </button>

      <div className="content-card">
        <h1 className="page-title" id="user-detail-heading">User Details</h1>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-icon"><HiUser /></div>
            <div>
              <span className="detail-label">Name</span>
              <span className="detail-value" id="user-detail-name">{user.name}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><HiMail /></div>
            <div>
              <span className="detail-label">Email</span>
              <span className="detail-value" id="user-detail-email">{user.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><HiLocationMarker /></div>
            <div>
              <span className="detail-label">Address</span>
              <span className="detail-value" id="user-detail-address">{user.address || '—'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><HiShieldCheck /></div>
            <div>
              <span className="detail-label">Role</span>
              <span className={getRoleBadgeClass(user.role)} id="user-detail-role">{getRoleLabel(user.role)}</span>
            </div>
          </div>
        </div>

        {user.role === 'STORE_OWNER' && user.store && (
          <div className="store-info-section">
            <h2>Store Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <div>
                  <span className="detail-label">Store Name</span>
                  <span className="detail-value" id="store-detail-name">{user.store.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <span className="detail-label">Store Email</span>
                  <span className="detail-value" id="store-detail-email">{user.store.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <span className="detail-label">Average Rating</span>
                  <div id="store-detail-rating">
                    {user.store.averageRating ? (
                      <RatingStars rating={user.store.averageRating} readonly size="md" />
                    ) : (
                      <span className="detail-value">No ratings yet</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <span className="detail-label">Total Ratings</span>
                  <span className="detail-value" id="store-detail-total-ratings">{user.store.totalRatings}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
