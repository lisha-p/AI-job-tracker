import React from 'react';
import { Briefcase, Clock, CalendarCheck, Award, XCircle, TrendingUp } from 'lucide-react';

export default function DashboardStats({ applications, activeStatusFilter, onSelectStatusFilter }) {
  const total = applications.length;
  
  // Applications in progress: active non-terminal statuses
  const inProgress = applications.filter(
    (app) => app.status === 'Applied' || app.status === 'Assessment' || app.status === 'Interview'
  ).length;

  const interviews = applications.filter((app) => app.status === 'Interview').length;
  const offers = applications.filter((app) => app.status === 'Offer').length;
  const rejections = applications.filter((app) => app.status === 'Rejected').length;

  // Additional helpful rate
  const interviewRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  const stats = [
    {
      id: 'stat-total',
      label: 'Total Applications',
      value: total,
      subtext: total === 1 ? '1 application logged' : `${total} applications logged`,
      icon: Briefcase,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      activeColor: 'border-blue-500 ring-2 ring-blue-100',
      filterTarget: 'All',
    },
    {
      id: 'stat-in-progress',
      label: 'In Progress',
      value: inProgress,
      subtext: 'Applied, Assessment, or Interview',
      icon: Clock,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'border-amber-500 ring-2 ring-amber-100',
      filterTarget: 'In Progress',
    },
    {
      id: 'stat-interviews',
      label: 'Interviews',
      value: interviews,
      subtext: `${interviewRate}% reached interview stage`,
      icon: CalendarCheck,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      activeColor: 'border-purple-500 ring-2 ring-purple-100',
      filterTarget: 'Interview',
    },
    {
      id: 'stat-offers',
      label: 'Offers',
      value: offers,
      subtext: offers > 0 ? `${offerRate}% overall offer rate` : 'Awaiting first offer',
      icon: Award,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      activeColor: 'border-emerald-500 ring-2 ring-emerald-100',
      filterTarget: 'Offer',
    },
    {
      id: 'stat-rejections',
      label: 'Rejections',
      value: rejections,
      subtext: total > 0 ? `${Math.round((rejections / total) * 100)}% of total logged` : '0% rejection rate',
      icon: XCircle,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
      activeColor: 'border-rose-500 ring-2 ring-rose-100',
      filterTarget: 'Rejected',
    },
  ];

  return (
    <section id="dashboard-stats-section" aria-label="Application Summary Metrics" className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Application Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key metrics update automatically as application statuses change.
          </p>
        </div>
        {activeStatusFilter !== 'All' && (
          <button
            id="clear-dashboard-filter-btn"
            onClick={() => onSelectStatusFilter('All')}
            className="self-start text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-colors"
          >
            Filtering by: {activeStatusFilter} (Click to reset)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const isSelected = item.filterTarget && activeStatusFilter === item.filterTarget;

          return (
            <div
              key={item.id}
              id={item.id}
              onClick={() => {
                if (item.filterTarget) {
                  onSelectStatusFilter(item.filterTarget === activeStatusFilter ? 'All' : item.filterTarget);
                }
              }}
              className={`relative bg-white rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                item.filterTarget ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : 'cursor-default'
              } ${isSelected ? item.activeColor : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-lg border ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate" title={item.subtext}>
                  {item.subtext}
                </p>
              </div>

              {item.filterTarget && (
                <div className="mt-2 text-[11px] text-slate-400 font-medium">
                  {isSelected ? '✓ Filter active' : 'Click to filter'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Pipeline Bar */}
      {total > 0 && (
        <div id="pipeline-breakdown" className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-semibold text-slate-700">Pipeline Distribution</span>
            <span className="text-slate-400">{total} active &amp; logged opportunities</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            {applications.filter((a) => a.status === 'Applied').length > 0 && (
              <div
                style={{ width: `${(applications.filter((a) => a.status === 'Applied').length / total) * 100}%` }}
                className="bg-blue-500 h-full transition-all duration-300"
                title={`Applied: ${applications.filter((a) => a.status === 'Applied').length}`}
              />
            )}
            {applications.filter((a) => a.status === 'Assessment').length > 0 && (
              <div
                style={{ width: `${(applications.filter((a) => a.status === 'Assessment').length / total) * 100}%` }}
                className="bg-amber-500 h-full transition-all duration-300"
                title={`Assessment: ${applications.filter((a) => a.status === 'Assessment').length}`}
              />
            )}
            {interviews > 0 && (
              <div
                style={{ width: `${(interviews / total) * 100}%` }}
                className="bg-purple-500 h-full transition-all duration-300"
                title={`Interview: ${interviews}`}
              />
            )}
            {offers > 0 && (
              <div
                style={{ width: `${(offers / total) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Offer: ${offers}`}
              />
            )}
            {rejections > 0 && (
              <div
                style={{ width: `${(rejections / total) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-300"
                title={`Rejected: ${rejections}`}
              />
            )}
            {applications.filter((a) => a.status === 'Withdrawn').length > 0 && (
              <div
                style={{ width: `${(applications.filter((a) => a.status === 'Withdrawn').length / total) * 100}%` }}
                className="bg-slate-400 h-full transition-all duration-300"
                title={`Withdrawn: ${applications.filter((a) => a.status === 'Withdrawn').length}`}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Applied ({applications.filter((a) => a.status === 'Applied').length})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Assessment ({applications.filter((a) => a.status === 'Assessment').length})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Interview ({interviews})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Offer ({offers})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Rejected ({rejections})
            </span>
            {applications.filter((a) => a.status === 'Withdrawn').length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Withdrawn ({applications.filter((a) => a.status === 'Withdrawn').length})
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
