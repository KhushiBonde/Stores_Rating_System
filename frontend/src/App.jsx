import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute, PublicRoute } from './guards/PrivateRoute';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ChangePassword from './pages/auth/ChangePassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import AdminStoreList from './pages/admin/StoreList';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';

// Normal User Pages
import UserStoreList from './pages/user/StoreList';

// Store Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Shared Authenticated Route */}
              <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
              <Route path="/admin/users" element={<RoleRoute allowedRoles={['ADMIN']}><UserList /></RoleRoute>} />
              <Route path="/admin/users/:id" element={<RoleRoute allowedRoles={['ADMIN']}><UserDetail /></RoleRoute>} />
              <Route path="/admin/stores" element={<RoleRoute allowedRoles={['ADMIN']}><AdminStoreList /></RoleRoute>} />
              <Route path="/admin/add-user" element={<RoleRoute allowedRoles={['ADMIN']}><AddUser /></RoleRoute>} />
              <Route path="/admin/add-store" element={<RoleRoute allowedRoles={['ADMIN']}><AddStore /></RoleRoute>} />

              {/* Normal User Routes */}
              <Route path="/user/stores" element={<RoleRoute allowedRoles={['NORMAL_USER']}><UserStoreList /></RoleRoute>} />

              {/* Store Owner Routes */}
              <Route path="/owner/dashboard" element={<RoleRoute allowedRoles={['STORE_OWNER']}><OwnerDashboard /></RoleRoute>} />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
