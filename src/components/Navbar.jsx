import React, { useState, useRef, useEffect } from 'react';
import {
  BriefcaseBusiness,
  Plus,
  Download,
  RotateCcw,
  Trash2,
  HardDrive,
  MoreVertical,
} from 'lucide-react';

export default function Navbar({
  onOpenAddModal,
  onResetSampleData,
  onClearAll,
  onExportData,
  applicationCount,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  JobTrack
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Job Application Tracker
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Storage status badge */}
            <div
              id="storage-indicator"
              title="Data is stored securely in your browser's persistent local storage"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg"
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Storage</span>
            </div>

            {/* Quick Data Actions Menu */}
            <div className="relative" ref={menuRef}>
              <button
                id="data-menu-btn"
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
                title="Data options (Export, Reset, Clear)"
                aria-label="Data options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  id="data-dropdown-menu"
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 text-xs text-slate-700"
                >
                  <button
                    id="export-data-btn"
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onExportData();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    <span>Export Data (JSON)</span>
                  </button>

                  <button
                    id="reset-sample-btn"
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onResetSampleData();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Reload Sample Applications</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    id="clear-all-data-btn"
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onClearAll();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-rose-50 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Clear All Applications</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action: Add Application */}
            <button
              id="add-application-header-btn"
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Add Application</span>
              <span className="inline xs:hidden sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
