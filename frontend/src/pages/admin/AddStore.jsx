import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import { validateEmail, validateAddress, validateStoreName } from '../../utils/validators';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiShoppingBag, HiMail, HiLocationMarker, HiUser } from 'react-icons/hi';

const AddStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available store owners (STORE_OWNER role users)
    const fetchOwners = async () => {
      try {
        const response = await adminAPI.getUsers({ role: 'STORE_OWNER', limit: 100 });
        setStoreOwners(response.data.data.users);
      } catch (error) {
        console.error('Failed to fetch store owners');
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateStoreName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (addressErr) newErrors.address = addressErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = { ...form };
      if (!data.ownerId) delete data.ownerId;
      await adminAPI.createStore(data);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length > 0) {
        const fieldErrors = {};
        data.errors.forEach((err) => { fieldErrors[err.field] = err.message; });
        setErrors(fieldErrors);
      }
      toast.error(data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/admin/stores')} id="back-to-stores" style={{ marginBottom: '1rem' }}>
        <HiArrowLeft /> Back to Stores
      </button>

      <div className="content-card" style={{ maxWidth: '600px' }}>
        <h1 className="page-title" id="add-store-heading">Add New Store</h1>

        <form onSubmit={handleSubmit} className="form" id="add-store-form">
          <div className="form-group">
            <label htmlFor="add-store-name">Store Name</label>
            <div className="input-wrapper">
              <HiShoppingBag className="input-icon" />
              <input type="text" id="add-store-name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter store name" className={errors.name ? 'error' : ''} />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-store-email">Store Email</label>
            <div className="input-wrapper">
              <HiMail className="input-icon" />
              <input type="email" id="add-store-email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Enter store email" className={errors.email ? 'error' : ''} />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-store-address">Address <span className="optional">(optional)</span></label>
            <div className="input-wrapper">
              <HiLocationMarker className="input-icon" />
              <textarea id="add-store-address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter store address" className={errors.address ? 'error' : ''} rows={2} />
            </div>
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-store-owner">Store Owner <span className="optional">(optional)</span></label>
            <div className="input-wrapper">
              <HiUser className="input-icon" />
              <select id="add-store-owner" value={form.ownerId} onChange={(e) => handleChange('ownerId', e.target.value)}>
                <option value="">No owner (assign later)</option>
                {storeOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/stores')} id="add-store-cancel">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="add-store-submit">
              {loading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
