import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiLogout, HiKey, HiHome } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', id: 'nav-admin-dashboard' },
          { to: '/admin/users', label: 'Users', id: 'nav-admin-users' },
          { to: '/admin/stores', label: 'Stores', id: 'nav-admin-stores' },
        ];
      case 'NORMAL_USER':
        return [
          { to: '/user/stores', label: 'Browse Stores', id: 'nav-user-stores' },
        ];
      case 'STORE_OWNER':
        return [
          { to: '/owner/dashboard', label: 'Dashboard', id: 'nav-owner-dashboard' },
        ];
      default:
        return [];
    }
  };

  const getRoleBadge = () => {
    const roleLabels = {
      ADMIN: 'Admin',
      NORMAL_USER: 'User',
      STORE_OWNER: 'Owner',
    };
    return roleLabels[role] || role;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="nav-brand">
          <span className="brand-icon">⭐</span>
          <span className="brand-text">StoreRate</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              id={link.id}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">{user?.name?.split(' ')[0]}</span>
            <span className="role-badge">{getRoleBadge()}</span>
          </div>
          <Link to="/change-password" className="nav-icon-btn" id="nav-change-password" title="Change Password">
            <HiKey />
          </Link>
          <button onClick={handleLogout} className="nav-icon-btn logout-btn" id="nav-logout" title="Logout">
            <HiLogout />
          </button>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
