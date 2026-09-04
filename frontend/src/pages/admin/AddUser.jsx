import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiUser, HiMail, HiLockClosed, HiLocationMarker, HiShieldCheck, HiEye, HiEyeOff } from 'react-icons/hi';

const AddUser = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', address: '', role: 'NORMAL_USER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const passwordErr = validatePassword(form.password);
    const addressErr = validateAddress(form.address);
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passwordErr) newErrors.password = passwordErr;
    if (addressErr) newErrors.address = addressErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminAPI.createUser(form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length > 0) {
        const fieldErrors = {};
        data.errors.forEach((err) => { fieldErrors[err.field] = err.message; });
        setErrors(fieldErrors);
      }
      toast.error(data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/admin/users')} id="back-to-users" style={{ marginBottom: '1rem' }}>
        <HiArrowLeft /> Back to Users
      </button>

      <div className="content-card" style={{ maxWidth: '600px' }}>
        <h1 className="page-title" id="add-user-heading">Add New User</h1>

        <form onSubmit={handleSubmit} className="form" id="add-user-form">
          <div className="form-group">
            <label htmlFor="add-user-name">Full Name</label>
            <div className="input-wrapper">
              <HiUser className="input-icon" />
              <input type="text" id="add-user-name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Min 20, max 60 characters" className={errors.name ? 'error' : ''} />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
            <span className="char-count">{form.name.length}/60</span>
          </div>

          <div className="form-group">
            <label htmlFor="add-user-email">Email</label>
            <div className="input-wrapper">
              <HiMail className="input-icon" />
              <input type="email" id="add-user-email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Enter email address" className={errors.email ? 'error' : ''} />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-user-password">Password</label>
            <div className="input-wrapper">
              <HiLockClosed className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} id="add-user-password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="8-16 chars, 1 uppercase, 1 special" className={errors.password ? 'error' : ''} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-user-address">Address <span className="optional">(optional)</span></label>
            <div className="input-wrapper">
              <HiLocationMarker className="input-icon" />
              <textarea id="add-user-address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter address" className={errors.address ? 'error' : ''} rows={2} />
            </div>
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-user-role">Role</label>
            <div className="input-wrapper">
              <HiShieldCheck className="input-icon" />
              <select id="add-user-role" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/users')} id="add-user-cancel">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="add-user-submit">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
