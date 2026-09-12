import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, MapPin, Calendar, Link2, FileText } from 'lucide-react';
import { JOB_TYPES, APPLICATION_STATUSES } from '../constants/jobConstants.js';

export default function ApplicationFormModal({ isOpen, onClose, onSave, initialData }) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    location: '',
    jobType: 'Full Time',
    applicationDate: new Date().toISOString().slice(0, 10),
    applicationUrl: '',
    status: 'Applied',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        location: initialData.location || '',
        jobType: initialData.jobType || 'Full Time',
        applicationDate: initialData.applicationDate || new Date().toISOString().slice(0, 10),
        applicationUrl: initialData.applicationUrl || '',
        status: initialData.status || 'Applied',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        company: '',
        jobTitle: '',
        location: '',
        jobType: 'Full Time',
        applicationDate: new Date().toISOString().slice(0, 10),
        applicationUrl: '',
        status: 'Applied',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    }
    if (formData.applicationUrl.trim()) {
      // Basic URL check if provided
      try {
        const urlToCheck = formData.applicationUrl.startsWith('http://') || formData.applicationUrl.startsWith('https://')
          ? formData.applicationUrl
          : `https://${formData.applicationUrl}`;
        new URL(urlToCheck);
      } catch {
        newErrors.applicationUrl = 'Please enter a valid URL';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let cleanUrl = formData.applicationUrl.trim();
    if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    onSave({
      ...formData,
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
      location: formData.location.trim(),
      applicationUrl: cleanUrl,
      notes: formData.notes.trim(),
    });
  };

  return (
    <div
      id="application-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="application-form-modal"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 id="modal-headline" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update company details, interview stage, or application notes.'
                : 'Log a new opportunity to monitor your pipeline effectively.'}
            </p>
          </div>
          <button
            id="close-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-company" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="form-company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google, Stripe, Airbnb"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.company
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-blue-500 bg-white'
                  }`}
                />
              </div>
              {errors.company && (
                <p className="text-rose-600 text-xs mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="form-jobTitle" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="form-jobTitle"
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Frontend Engineer"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.jobTitle
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-blue-500 bg-white'
                  }`}
                />
              </div>
              {errors.jobTitle && (
                <p className="text-rose-600 text-xs mt-1">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          {/* Row 2: Location & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-location" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="form-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote, Austin TX, London"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="form-jobType" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Type *
              </label>
              <select
                id="form-jobType"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Application Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-applicationDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="form-applicationDate"
                  type="date"
                  required
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              {errors.applicationDate && (
                <p className="text-rose-600 text-xs mt-1">{errors.applicationDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="form-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status *
              </label>
              <select
                id="form-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer font-medium"
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Application URL */}
          <div>
            <label htmlFor="form-applicationUrl" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Application URL / Posting Link
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="form-applicationUrl"
                type="text"
                value={formData.applicationUrl}
                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                placeholder="https://company.com/careers/job-id"
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.applicationUrl
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-blue-500 bg-white'
                }`}
              />
            </div>
            {errors.applicationUrl && (
              <p className="text-rose-600 text-xs mt-1">{errors.applicationUrl}</p>
            )}
          </div>

          {/* Row 5: Notes */}
          <div>
            <label htmlFor="form-notes" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Next Steps
            </label>
            <div className="relative">
              <textarea
                id="form-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Recruiter contact, interview dates, key talking points, salary expectations..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              id="cancel-form-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-form-btn"
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
