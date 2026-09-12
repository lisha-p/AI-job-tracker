import React from 'react';
import { Search, Filter, X, LayoutGrid, Table, ArrowUpDown } from 'lucide-react';
import { APPLICATION_STATUSES, JOB_TYPES } from '../constants/jobConstants.js';

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  jobTypeFilter,
  onJobTypeFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  totalResults,
  totalApplications,
  onResetFilters,
}) {
  const isFiltered = Boolean(searchQuery.trim() || statusFilter !== 'All' || jobTypeFilter !== 'All');

  return (
    <div id="search-filters-container" className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input for company name and job title */}
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search by company or job title
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company name or job title..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none">
            <label htmlFor="status-filter-select" className="sr-only">Filter by Status</label>
            <div className="relative">
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress (Active)</option>
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="flex-1 sm:flex-none">
            <label htmlFor="job-type-filter-select" className="sr-only">Filter by Job Type</label>
            <div className="relative">
              <select
                id="job-type-filter-select"
                value={jobTypeFilter}
                onChange={(e) => onJobTypeFilterChange(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Job Types</option>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex-1 sm:flex-none">
            <label htmlFor="sort-by-select" className="sr-only">Sort By</label>
            <div className="relative">
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="date-desc">Newest Date</option>
                <option value="date-asc">Oldest Date</option>
                <option value="company-asc">Company (A-Z)</option>
                <option value="company-desc">Company (Z-A)</option>
                <option value="status">Status</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle (Table vs Cards) */}
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button
              id="view-mode-table-btn"
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Table view"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              id="view-mode-card-btn"
              type="button"
              onClick={() => onViewModeChange('card')}
              title="Card view"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Bar & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-800">{totalResults}</strong> of{' '}
            <strong className="text-slate-800">{totalApplications}</strong> applications
          </span>
          {isFiltered && (
            <span className="text-slate-400">· Filters applied</span>
          )}
        </div>

        {isFiltered && (
          <button
            id="reset-all-filters-btn"
            type="button"
            onClick={onResetFilters}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
}
