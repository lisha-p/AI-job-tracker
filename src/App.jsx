import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardStats from './components/DashboardStats.jsx';
import SearchAndFilters from './components/SearchAndFilters.jsx';
import ApplicationList from './components/ApplicationList.jsx';
import ApplicationFormModal from './components/ApplicationFormModal.jsx';
import ApplicationDetailModal from './components/ApplicationDetailModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import { storageService } from './services/storageService.js';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Applications state
  const [applications, setApplications] = useState(() => storageService.getApplications());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApplication, setDeletingApplication] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Sync with persistent storage whenever applications change
  useEffect(() => {
    storageService.saveApplications(applications);
  }, [applications]);

  // Keep viewing application in sync if it was updated
  useEffect(() => {
    if (viewingApplication) {
      const updated = applications.find((a) => a.id === viewingApplication.id);
      if (updated) {
        setViewingApplication(updated);
      }
    }
  }, [applications]);

  // Handle Add Application
  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setIsFormModalOpen(true);
  };

  // Handle Edit Application
  const handleOpenEditModal = (app) => {
    setEditingApplication(app);
    setIsFormModalOpen(true);
  };

  // Handle Save (Add or Edit)
  const handleSaveApplication = (formData) => {
    const now = new Date().toISOString();
    if (editingApplication) {
      // Update existing
      setApplications((prev) =>
        prev.map((item) =>
          item.id === editingApplication.id
            ? { ...item, ...formData, updatedAt: now }
            : item
        )
      );
      showToast(`Updated application for ${formData.company}`);
    } else {
      // Add new
      const newApp = {
        id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [newApp, ...prev]);
      showToast(`Added application for ${formData.company}`);
    }
    setIsFormModalOpen(false);
    setEditingApplication(null);
  };

  // Handle Direct Status Change
  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      })
    );
    const targetApp = applications.find((a) => a.id === id);
    showToast(`Status updated to "${newStatus}" for ${targetApp ? targetApp.company : 'application'}`);
  };

  // Handle View Details
  const handleOpenViewModal = (app) => {
    setViewingApplication(app);
    setIsDetailModalOpen(true);
  };

  // Handle Delete Prompt
  const handlePromptDelete = (app) => {
    setDeletingApplication(app);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = (id) => {
    const target = applications.find((a) => a.id === id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (viewingApplication?.id === id) {
      setIsDetailModalOpen(false);
      setViewingApplication(null);
    }
    showToast(`Deleted application for ${target ? target.company : 'Job'}`, 'info');
  };

  // Reset to Sample Data
  const handleResetSampleData = () => {
    const samples = storageService.resetToSampleData();
    setApplications(samples);
    showToast('Reset applications to initial sample data');
  };

  // Clear All Data
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all applications? This cannot be undone.')) {
      const cleared = storageService.clearAllData();
      setApplications(cleared);
      showToast('All applications cleared', 'info');
    }
  };

  // Export Data as JSON
  const handleExportData = () => {
    const success = storageService.exportToJson(applications);
    if (success) {
      showToast('Downloaded applications backup JSON file');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setJobTypeFilter('All');
    setSortBy('date-desc');
  };

  // Filter & Search & Sort logic
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search by Company name & Job title
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchCompany = app.company?.toLowerCase().includes(query);
          const matchTitle = app.jobTitle?.toLowerCase().includes(query);
          if (!matchCompany && !matchTitle) return false;
        }

        // Filter by Status
        if (statusFilter !== 'All') {
          if (statusFilter === 'In Progress') {
            const inProgressStages = ['Applied', 'Assessment', 'Interview'];
            if (!inProgressStages.includes(app.status)) return false;
          } else if (app.status !== statusFilter) {
            return false;
          }
        }

        // Filter by Job Type
        if (jobTypeFilter !== 'All' && app.jobType !== jobTypeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.applicationDate || 0) - new Date(b.applicationDate || 0);
        }
        if (sortBy === 'company-asc') {
          return (a.company || '').localeCompare(b.company || '');
        }
        if (sortBy === 'company-desc') {
          return (b.company || '').localeCompare(a.company || '');
        }
        if (sortBy === 'status') {
          return (a.status || '').localeCompare(b.status || '');
        }
        return 0;
      });
  }, [applications, searchQuery, statusFilter, jobTypeFilter, sortBy]);

  const isFiltered = Boolean(
    searchQuery.trim() || statusFilter !== 'All' || jobTypeFilter !== 'All'
  );

  return (
    <div id="jobtrack-app-root" className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onResetSampleData={handleResetSampleData}
        onClearAll={handleClearAll}
        onExportData={handleExportData}
        applicationCount={applications.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Metrics (Total, In Progress, Interviews, Offers, Rejections) */}
        <DashboardStats
          applications={applications}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Search and Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          jobTypeFilter={jobTypeFilter}
          onJobTypeFilterChange={setJobTypeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={filteredApplications.length}
          totalApplications={applications.length}
          onResetFilters={handleResetFilters}
        />

        {/* Application List (Table or Cards) */}
        <ApplicationList
          applications={filteredApplications}
          viewMode={viewMode}
          onView={handleOpenViewModal}
          onEdit={handleOpenEditModal}
          onDelete={handlePromptDelete}
          onStatusChange={handleStatusChange}
          onOpenAddModal={handleOpenAddModal}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            <strong>JobTrack</strong> – Job Application Tracker
          </p>
          <p>
            Clean React &amp; JavaScript architecture · All application data is preserved in storage
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ApplicationFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveApplication}
        initialData={editingApplication}
      />

      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingApplication(null);
        }}
        application={viewingApplication}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingApplication(null);
        }}
        onConfirm={handleConfirmDelete}
        application={deletingApplication}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          id="toast-notification"
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium border border-slate-800 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
