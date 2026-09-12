import React from 'react';
import {
  X,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  Clock,
} from 'lucide-react';
import { STATUS_CONFIG, APPLICATION_STATUSES } from '../constants/jobConstants.js';

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!isOpen || !application) return null;

  const statusStyle = STATUS_CONFIG[application.status] || {
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    description: '',
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div
      id="application-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="application-detail-modal"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-headline"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3.5">
            <span className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              {application.company.charAt(0).toUpperCase()}
            </span>
            <div>
              <h3 id="detail-headline" className="text-xl font-bold text-slate-900 leading-tight">
                {application.company}
              </h3>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {application.jobTitle}
              </p>
            </div>
          </div>
          <button
            id="close-detail-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status & Quick Change */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Status
              </span>
              <div className="relative">
                <select
                  id="detail-status-select"
                  aria-label="Update application status"
                  value={application.status}
                  onChange={(e) => onStatusChange(application.id, e.target.value)}
                  className={`text-xs font-semibold py-1.5 pl-6 pr-6 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusStyle.badgeClass}`}
                >
                  {APPLICATION_STATUSES.map((st) => (
                    <option key={st} value={st} className="text-slate-900 bg-white">
                      {st}
                    </option>
                  ))}
                </select>
                <span
                  className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.dotClass}`}
                />
              </div>
            </div>
            {statusStyle.description && (
              <p className="text-xs text-slate-500 mt-2">
                {statusStyle.description}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location
              </span>
              <p className="font-medium text-slate-800">
                {application.location || 'Not specified'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Job Type
              </span>
              <p className="font-medium text-slate-800">
                {application.jobType}
              </p>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Application Date
              </span>
              <p className="font-medium text-slate-800">
                {formatDate(application.applicationDate)}
              </p>
            </div>

            {application.applicationUrl && (
              <div className="space-y-1 col-span-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Application Link
                </span>
                <div>
                  <a
                    id="detail-application-link"
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5 break-all underline text-sm"
                  >
                    {application.applicationUrl}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes & Next Steps
            </span>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {application.notes ? application.notes : (
                <span className="text-slate-400 italic">No notes added yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <button
            id="detail-delete-btn"
            type="button"
            onClick={() => {
              onClose();
              onDelete(application);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              id="detail-edit-btn"
              type="button"
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-200/60 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              id="detail-close-btn"
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
