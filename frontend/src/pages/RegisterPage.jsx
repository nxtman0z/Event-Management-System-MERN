import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineUser, HiOutlineCalendarDays } from 'react-icons/hi2';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { role: 'attendee' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const result = await registerUser(formData);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const roles = [
    { value: 'attendee', label: 'Attendee', desc: 'Join and discover events', icon: '🎫' },
    { value: 'organizer', label: 'Organizer', desc: 'Create and manage events', icon: '🎯' },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <HiOutlineCalendarDays className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Join EventFlow</h2>
            <p className="text-lg text-white/80 max-w-md">
              Create your account and start discovering amazing events or become an organizer.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { label: 'Events', value: '500+', icon: '📅' },
                { label: 'Users', value: '10K+', icon: '👥' },
                { label: 'Cities', value: '50+', icon: '🌍' },
                { label: 'Rating', value: '4.9★', icon: '⭐' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
                >
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <HiOutlineCalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">EventFlow</span>
            </Link>
          </div>

          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Start your journey with EventFlow
          </p>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              isDark ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}>
              <FaGoogle className="w-4 h-4" /> Google
            </button>
            <button className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              isDark ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}>
              <FaGithub className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`} />
            </div>
            <div className="relative flex justify-center">
              <span className={`px-4 text-sm ${isDark ? 'bg-dark-900 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer border transition-all duration-300 ${
                      selectedRole === role.value
                        ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                        : isDark
                        ? 'border-white/10 hover:border-white/20 bg-white/5'
                        : 'border-gray-200 hover:border-primary-300 bg-white'
                    }`}
                  >
                    <input type="radio" value={role.value} {...register('role')} className="hidden" />
                    <span className="text-xl mb-1">{role.icon}</span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{role.label}</span>
                    <span className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{role.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <div className="relative">
                <HiOutlineUser className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  placeholder="John Doe"
                  className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <div className="relative">
                <HiOutlineEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  placeholder="you@example.com"
                  className={`${isDark ? 'input-field' : 'input-field-light'} pl-12`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <div className="relative">
                <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  placeholder="••••••••"
                  className={`${isDark ? 'input-field' : 'input-field-light'} pl-12 pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5 text-base mt-2">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
