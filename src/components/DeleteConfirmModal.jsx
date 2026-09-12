import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, application }) {
  if (!isOpen || !application) return null;

  return (
    <div
      id="delete-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="delete-confirm-modal"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
                Delete Job Application?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Are you sure you want to delete the application for{' '}
                <strong className="text-slate-900">{application.jobTitle}</strong> at{' '}
                <strong className="text-slate-900">{application.company}</strong>?
              </p>
              <p className="text-xs text-rose-600 mt-2 font-medium">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="cancel-delete-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              type="button"
              onClick={() => {
                onConfirm(application.id);
                onClose();
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
