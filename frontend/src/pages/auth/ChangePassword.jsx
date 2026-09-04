import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/endpoints';
import { validatePassword } from '../../utils/validators';
import toast from 'react-hot-toast';
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required.';
    
    const passwordErr = validatePassword(newPassword);
    if (passwordErr) newErrors.newPassword = passwordErr;
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully!');
      navigate(-1);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password.';
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div className="page-container">
      <div className="content-card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h1 className="page-title" id="change-password-heading">Change Password</h1>

        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="form" id="change-password-form">
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <div className="input-wrapper">
              <HiLockClosed className="input-icon" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={errors.currentPassword ? 'error' : ''}
              />
              <button type="button" className="password-toggle" onClick={() => toggleVisibility('current')}>
                {showPasswords.current ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="input-wrapper">
              <HiLockClosed className="input-icon" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8-16 chars, 1 uppercase, 1 special"
                className={errors.newPassword ? 'error' : ''}
              />
              <button type="button" className="password-toggle" onClick={() => toggleVisibility('new')}>
                {showPasswords.new ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="input-wrapper">
              <HiLockClosed className="input-icon" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button type="button" className="password-toggle" onClick={() => toggleVisibility('confirm')}>
                {showPasswords.confirm ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} id="change-password-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="change-password-submit">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
