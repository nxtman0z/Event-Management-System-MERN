import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck, HiOutlinePhoto } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import { eventsAPI } from '../utils/api';
import { CATEGORIES, getCategoryEmoji } from '../utils/helpers';

const steps = [
  { id: 1, title: 'Basic Info', desc: 'Title, description & category' },
  { id: 2, title: 'Date & Location', desc: 'When and where' },
  { id: 3, title: 'Capacity & Pricing', desc: 'Tickets and tags' },
  { id: 4, title: 'Banner & Review', desc: 'Upload image and submit' },
];

const CreateEventPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      title: '', description: '', category: 'Other', date: '', time: '',
      location: '', venue: '', capacity: 100, ticketPrice: 0, tags: '', status: 'upcoming',
    },
  });

  const formData = watch();

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'description', 'category'];
    if (currentStep === 2) fieldsToValidate = ['date'];

    const valid = await trigger(fieldsToValidate);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '' && value !== undefined) fd.append(key, value);
      });
      if (bannerFile) fd.append('bannerImage', bannerFile);

      const response = await eventsAPI.create(fd);
      if (response.data.success) {
        toast.success('Event created successfully! 🎉');
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } catch (e) { /* optional */ }
        setTimeout(() => navigate(`/events/${response.data.data.event._id}`), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Event</h1>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Fill in the details to create your event</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${i < steps.length - 1 ? 'mr-4' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isDark ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <HiOutlineCheck className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-semibold ${currentStep >= step.id ? (isDark ? 'text-white' : 'text-gray-900') : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-primary-500' : isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Event Title *</label>
                        <input {...register('title', { required: 'Title is required' })} placeholder="e.g. React Workshop 2025"
                          className={isDark ? 'input-field' : 'input-field-light'} />
                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                        <textarea {...register('description')} rows={5} placeholder="Describe your event..."
                          className={isDark ? 'input-field' : 'input-field-light'} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {categories.map((cat) => (
                            <label key={cat} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition-all ${
                              formData.category === cat
                                ? 'border-primary-500 bg-primary-500/10'
                                : isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <input type="radio" value={cat} {...register('category')} className="hidden" />
                              <span>{getCategoryEmoji(cat)}</span>
                              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Date & Location */}
                  {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date *</label>
                          <input type="date" {...register('date', { required: 'Date is required' })} className={isDark ? 'input-field' : 'input-field-light'} />
                          {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
                          <input type="time" {...register('time')} className={isDark ? 'input-field' : 'input-field-light'} />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                        <input {...register('location')} placeholder="e.g. New Delhi, India" className={isDark ? 'input-field' : 'input-field-light'} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Venue</label>
                        <input {...register('venue')} placeholder="e.g. Convention Center, Hall A" className={isDark ? 'input-field' : 'input-field-light'} />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Capacity & Pricing */}
                  {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Capacity</label>
                          <input type="number" {...register('capacity', { min: 1 })} min="1" className={isDark ? 'input-field' : 'input-field-light'} />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Ticket Price (₹)</label>
                          <input type="number" {...register('ticketPrice', { min: 0 })} min="0" placeholder="0 for free" className={isDark ? 'input-field' : 'input-field-light'} />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tags (comma separated)</label>
                        <input {...register('tags')} placeholder="e.g. react, javascript, frontend" className={isDark ? 'input-field' : 'input-field-light'} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                        <select {...register('status')} className={isDark ? 'input-field' : 'input-field-light'}>
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Banner & Review */}
                  {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Banner Image</label>
                        <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                          isDark ? 'border-white/10 hover:border-primary-500/50' : 'border-gray-200 hover:border-primary-400'
                        }`} onClick={() => document.getElementById('banner-upload').click()}>
                          {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                          ) : (
                            <>
                              <HiOutlinePhoto className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload banner image</p>
                              <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>JPEG, PNG, WebP up to 5MB</p>
                            </>
                          )}
                        </div>
                        <input id="banner-upload" type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                      </div>

                      {/* Review Summary */}
                      <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                        <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>📋 Review</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Title:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.title || '-'}</span></p>
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Category:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.category}</span></p>
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Date:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.date || '-'}</span></p>
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Location:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.location || '-'}</span></p>
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Capacity:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.capacity}</span></p>
                          <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Price:</span> <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.ticketPrice > 0 ? `₹${formData.ticketPrice}` : 'Free'}</span></p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <button type="button" onClick={prevStep} disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      currentStep === 1 ? 'opacity-30 cursor-not-allowed' : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back
                  </button>

                  {currentStep < 4 ? (
                    <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 text-sm">
                      Next <HiOutlineArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 text-sm">
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                      ) : (
                        <><HiOutlineCheck className="w-4 h-4" /> Create Event</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className={`sticky top-24 rounded-2xl overflow-hidden ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="p-4">
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>📱 Live Preview</h3>
              </div>
              <div className="relative h-40 overflow-hidden">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-bg flex items-center justify-center">
                    <span className="text-4xl">{getCategoryEmoji(formData.category)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className={`badge bg-white/10 backdrop-blur-sm text-white border-white/20 text-xs`}>
                    {getCategoryEmoji(formData.category)} {formData.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`badge ${(!formData.ticketPrice || formData.ticketPrice <= 0) ? 'badge-free' : 'badge-paid'} text-xs`}>
                    {(!formData.ticketPrice || formData.ticketPrice <= 0) ? 'Free' : `₹${formData.ticketPrice}`}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className={`font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formData.title || 'Event Title'}
                </h3>
                <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.description || 'Event description will appear here...'}
                </p>
                {formData.date && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📅 {formData.date} {formData.time && `• ${formData.time}`}</p>}
                {formData.location && <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📍 {formData.location}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
