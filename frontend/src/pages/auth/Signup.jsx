import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/endpoints';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiLocationMarker, HiEye, HiEyeOff } from 'react-icons/hi';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
      await authAPI.signup(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.length > 0) {
        const fieldErrors = {};
        data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
      toast.error(data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">⭐</span>
            <h1 id="signup-heading">Create Account</h1>
            <p>Join StoreRate and start rating stores</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-wrapper">
                <HiUser className="input-icon" />
                <input
                  type="text"
                  id="signup-name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name (min 20 characters)"
                  className={errors.name ? 'error' : ''}
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
              <span className="char-count">{form.name.length}/60</span>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <div className="input-wrapper">
                <HiMail className="input-icon" />
                <input
                  type="email"
                  id="signup-email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <HiLockClosed className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signup-password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  id="signup-password-toggle"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="signup-address">Address <span className="optional">(optional)</span></label>
              <div className="input-wrapper">
                <HiLocationMarker className="input-icon" />
                <textarea
                  id="signup-address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter your address"
                  className={errors.address ? 'error' : ''}
                  rows={2}
                />
              </div>
              {errors.address && <span className="field-error">{errors.address}</span>}
              <span className="char-count">{form.address.length}/400</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="signup-submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" id="signup-login-link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
