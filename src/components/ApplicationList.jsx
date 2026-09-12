import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Briefcase,
  PlusCircle,
} from 'lucide-react';
import { STATUS_CONFIG, APPLICATION_STATUSES } from '../constants/jobConstants.js';

export default function ApplicationList({
  applications,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenAddModal,
  isFiltered,
  onResetFilters,
}) {
  if (applications.length === 0) {
    return (
      <div
        id="empty-applications-state"
        className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center my-6"
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No applications found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {isFiltered
            ? 'No applications match your current search and filter settings. Try adjusting your query or resetting filters.'
            : 'You haven’t added any job applications yet. Start tracking your job search journey now!'}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          {isFiltered ? (
            <button
              id="empty-state-reset-filters-btn"
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          ) : (
            <button
              id="empty-state-add-app-btn"
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add First Application
            </button>
          )}
        </div>
      </div>
    );
  }

  // Format dates cleanly
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div id="applications-container" className="space-y-4">
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table id="applications-table" className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Job Type</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const statusStyle = STATUS_CONFIG[app.status] || {
                    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                    dotClass: 'bg-slate-400',
                  };

                  return (
                    <tr
                      key={app.id}
                      id={`application-row-${app.id}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Company */}
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {app.company.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-semibold text-slate-900 truncate max-w-[160px]" title={app.company}>
                            {app.company}
                          </span>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="py-3.5 px-4 text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium truncate max-w-[200px]" title={app.jobTitle}>
                            {app.jobTitle}
                          </span>
                          {app.applicationUrl && (
                            <a
                              href={app.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                              title="Open job URL"
                              id={`table-link-${app.id}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]" title={app.location || 'Not specified'}>
                            {app.location || '—'}
                          </span>
                        </span>
                      </td>

                      {/* Job Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {app.jobType}
                        </span>
                      </td>

                      {/* Application Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formatDate(app.applicationDate)}
                        </span>
                      </td>

                      {/* Status + Quick Change */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            id={`status-select-${app.id}`}
                            aria-label={`Change status for ${app.jobTitle} at ${app.company}`}
                            value={app.status}
                            onChange={(e) => onStatusChange(app.id, e.target.value)}
                            className={`text-xs font-semibold py-1 pl-6 pr-6 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusStyle.badgeClass}`}
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
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            id={`view-btn-${app.id}`}
                            type="button"
                            onClick={() => onView(app)}
                            title="View details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`View details for ${app.company}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`edit-btn-${app.id}`}
                            type="button"
                            onClick={() => onEdit(app)}
                            title="Edit application"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`Edit application for ${app.company}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-btn-${app.id}`}
                            type="button"
                            onClick={() => onDelete(app)}
                            title="Delete application"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`Delete application for ${app.company}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD / GRID VIEW */
        <div id="applications-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => {
            const statusStyle = STATUS_CONFIG[app.status] || {
              badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
              dotClass: 'bg-slate-400',
            };

            return (
              <div
                key={app.id}
                id={`application-card-${app.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {app.company.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-base leading-tight">
                          {app.company}
                        </h4>
                        <p className="text-sm font-medium text-slate-600 mt-0.5">
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative shrink-0">
                      <select
                        id={`card-status-select-${app.id}`}
                        aria-label={`Change status for ${app.jobTitle} at ${app.company}`}
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value)}
                        className={`text-xs font-semibold py-1 pl-5 pr-5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusStyle.badgeClass}`}
                      >
                        {APPLICATION_STATUSES.map((st) => (
                          <option key={st} value={st} className="text-slate-900 bg-white">
                            {st}
                          </option>
                        ))}
                      </select>
                      <span
                        className={`w-1.5 h-1.5 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.dotClass}`}
                      />
                    </div>
                  </div>

                  {/* Badges / Metadata */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[170px]" title={app.location}>
                          {app.location || 'Location not specified'}
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {app.jobType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied: {formatDate(app.applicationDate)}
                      </span>

                      {app.applicationUrl && (
                        <a
                          href={app.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                          title="Open job link"
                          id={`card-link-${app.id}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Link
                        </a>
                      )}
                    </div>

                    {/* Notes preview if exists */}
                    {app.notes && (
                      <div className="mt-2 pt-2 border-t border-slate-50 flex items-start gap-1.5 text-slate-500 italic line-clamp-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{app.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    id={`card-view-btn-${app.id}`}
                    type="button"
                    onClick={() => onView(app)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    id={`card-edit-btn-${app.id}`}
                    type="button"
                    onClick={() => onEdit(app)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    id={`card-delete-btn-${app.id}`}
                    type="button"
                    onClick={() => onDelete(app)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
