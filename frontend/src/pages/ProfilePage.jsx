import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineCamera, HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import { usersAPI } from '../utils/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: pwdErrors }, reset: resetPwd } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      if (avatarFile) fd.append('avatar', avatarFile);

      const response = await usersAPI.updateProfile(fd);
      if (response.data.success) {
        updateUser(response.data.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setChangingPassword(true);
      const response = await usersAPI.changePassword(data);
      if (response.data.success) {
        toast.success('Password changed!');
        resetPwd();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h1>
        </motion.div>

        {/* Avatar & Profile Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 sm:p-8 mb-6 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>

          <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden">
                  {avatarPreview || user?.avatar ? (
                    <img src={avatarPreview || `http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-bg flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <HiOutlineCamera className="w-4 h-4" />
                </button>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                <span className="badge badge-upcoming mt-1 text-[10px]">{user?.role}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <div className="relative">
                <HiOutlineUser className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input {...regProfile('name', { required: 'Name is required' })} className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`} />
              </div>
              {profileErrors.name && <p className="mt-1 text-sm text-red-400">{profileErrors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <div className="relative">
                <HiOutlineEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="email" {...regProfile('email', { required: 'Email is required' })} className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`} />
              </div>
              {profileErrors.email && <p className="mt-1 text-sm text-red-400">{profileErrors.email.message}</p>}
            </div>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Change Password</h2>

          <form onSubmit={handlePwd(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
              <div className="relative">
                <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="password" {...regPwd('currentPassword', { required: 'Required' })} placeholder="••••••••"
                  className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`} />
              </div>
              {pwdErrors.currentPassword && <p className="mt-1 text-sm text-red-400">{pwdErrors.currentPassword.message}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
              <div className="relative">
                <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="password" {...regPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} placeholder="••••••••"
                  className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`} />
              </div>
              {pwdErrors.newPassword && <p className="mt-1 text-sm text-red-400">{pwdErrors.newPassword.message}</p>}
            </div>

            <button type="submit" disabled={changingPassword} className="btn-secondary">
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
