import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, sortBy, sortOrder, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        sortBy,
        order: sortOrder,
        ...filters,
      };
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      ADMIN: 'badge badge-red',
      NORMAL_USER: 'badge badge-blue',
      STORE_OWNER: 'badge badge-emerald',
    };
    return classes[role] || 'badge';
  };

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: 'Admin',
      NORMAL_USER: 'Normal User',
      STORE_OWNER: 'Store Owner',
    };
    return labels[role] || role;
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: false, render: (val) => val || '—' },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => (
        <span className={getRoleBadgeClass(val)}>{getRoleLabel(val)}</span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (val) => (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(`/admin/users/${val}`)}
          id={`view-user-${val}`}
        >
          View
        </button>
      ),
    },
  ];

  const filterConfig = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Filter by name...' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'Filter by email...' },
    { key: 'address', label: 'Address', type: 'text', placeholder: 'Filter by address...' },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'All Roles',
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'NORMAL_USER', label: 'Normal User' },
        { value: 'STORE_OWNER', label: 'Store Owner' },
      ],
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title" id="user-list-heading">Users</h1>
          <p className="page-subtitle">{pagination.total} total users</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/add-user')}
          id="add-user-btn"
        >
          <HiPlus /> Add User
        </button>
      </div>

      <div className="content-card">
        <FilterBar
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onClear={() => handleFilterChange({})}
        />
        <DataTable
          columns={columns}
          data={users}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          loading={loading}
          emptyMessage="No users found."
        />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
        />
      </div>
    </div>
  );
};

export default UserList;
