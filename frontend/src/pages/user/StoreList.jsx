import { useState, useEffect, useCallback } from 'react';
import { storeAPI } from '../../api/endpoints';
import RatingStars from '../../components/RatingStars';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';
import { HiSearch, HiX, HiLocationMarker } from 'react-icons/hi';

const UserStoreList = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [activeSearch, setActiveSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState({});

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        name: activeSearch.name || undefined,
        address: activeSearch.address || undefined,
      };
      const response = await storeAPI.getStores(params);
      setStores(response.data.data.stores);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, activeSearch]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch({ name: searchName, address: searchAddress });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchAddress('');
    setActiveSearch({ name: '', address: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRate = async (storeId, rating) => {
    setRatingLoading(prev => ({ ...prev, [storeId]: true }));
    try {
      const store = stores.find(s => s.id === storeId);
      const apiCall = store.userRating
        ? storeAPI.modifyRating(storeId, { rating })
        : storeAPI.submitRating(storeId, { rating });
      
      const response = await apiCall;
      const { storeAverageRating, totalRatings } = response.data.data;

      // Update store in list
      setStores(prev => prev.map(s => 
        s.id === storeId
          ? { ...s, userRating: rating, averageRating: storeAverageRating, totalRatings }
          : s
      ));

      toast.success(store.userRating ? 'Rating updated!' : 'Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating.');
    } finally {
      setRatingLoading(prev => ({ ...prev, [storeId]: false }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title" id="user-stores-heading">Browse Stores</h1>
          <p className="page-subtitle">Find and rate stores</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <form className="search-bar" onSubmit={handleSearch} id="store-search-form">
          <div className="search-inputs">
            <div className="input-wrapper">
              <HiSearch className="input-icon" />
              <input
                type="text"
                placeholder="Search by store name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                id="search-name"
              />
            </div>
            <div className="input-wrapper">
              <HiLocationMarker className="input-icon" />
              <input
                type="text"
                placeholder="Search by address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                id="search-address"
              />
            </div>
          </div>
          <div className="search-actions">
            <button type="submit" className="btn btn-primary" id="search-submit">
              <HiSearch /> Search
            </button>
            {(activeSearch.name || activeSearch.address) && (
              <button type="button" className="btn btn-ghost" onClick={handleClearSearch} id="search-clear">
                <HiX /> Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Store Cards */}
      {loading ? (
        <div className="loading-screen"><div className="loading-spinner"></div><p>Loading stores...</p></div>
      ) : stores.length === 0 ? (
        <div className="content-card empty-state">
          <p>No stores found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card" id={`store-card-${store.id}`}>
              <div className="store-card-header">
                <h3 className="store-name">{store.name}</h3>
                <span className="store-email">{store.email}</span>
              </div>
              
              {store.address && (
                <div className="store-address">
                  <HiLocationMarker />
                  <span>{store.address}</span>
                </div>
              )}

              <div className="store-rating-section">
                <div className="overall-rating">
                  <span className="rating-label">Overall Rating</span>
                  {store.averageRating ? (
                    <RatingStars rating={store.averageRating} readonly size="sm" />
                  ) : (
                    <span className="text-muted">No ratings yet</span>
                  )}
                  <span className="rating-count">({store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''})</span>
                </div>
                
                <div className="user-rating">
                  <span className="rating-label">Your Rating</span>
                  <RatingStars
                    rating={store.userRating || 0}
                    onRate={(r) => handleRate(store.id, r)}
                    size="md"
                  />
                  {ratingLoading[store.id] && <span className="text-muted">Saving...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
      />
    </div>
  );
};

export default UserStoreList;
