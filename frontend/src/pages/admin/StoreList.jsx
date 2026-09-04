import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';
import RatingStars from '../../components/RatingStars';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, [pagination.page, sortBy, sortOrder, filters]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        sortBy,
        order: sortOrder,
        ...filters,
      };
      const response = await adminAPI.getStores(params);
      setStores(response.data.data.stores);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load stores.');
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

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: false, render: (val) => val || '—' },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (val) => val ? <RatingStars rating={val} readonly size="sm" /> : <span className="text-muted">No ratings</span>,
    },
    {
      key: 'owner',
      label: 'Owner',
      sortable: false,
      render: (val) => val ? val.name : <span className="text-muted">Unassigned</span>,
    },
  ];

  const filterConfig = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Filter by store name...' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'Filter by email...' },
    { key: 'address', label: 'Address', type: 'text', placeholder: 'Filter by address...' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title" id="admin-store-list-heading">Stores</h1>
          <p className="page-subtitle">{pagination.total} total stores</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/add-store')}
          id="add-store-btn"
        >
          <HiPlus /> Add Store
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
          data={stores}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          loading={loading}
          emptyMessage="No stores found."
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

export default StoreList;
