import { INITIAL_SAMPLE_APPLICATIONS } from '../constants/jobConstants.js';

const STORAGE_KEY = 'jobtrack_applications_v1';

// In-memory fallback if localStorage is restricted
let inMemoryFallback = null;

export const storageService = {
  getApplications: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return inMemoryFallback || INITIAL_SAMPLE_APPLICATIONS;
      }
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        // Seed with sample data initially
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS));
        return INITIAL_SAMPLE_APPLICATIONS;
      }
      const parsed = JSON.parse(rawData);
      return Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_APPLICATIONS;
    } catch (err) {
      console.warn('localStorage read error, using fallback:', err);
      if (!inMemoryFallback) {
        inMemoryFallback = [...INITIAL_SAMPLE_APPLICATIONS];
      }
      return inMemoryFallback;
    }
  },

  saveApplications: (applications) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      }
      inMemoryFallback = [...applications];
      return true;
    } catch (err) {
      console.warn('localStorage write error, saved to in-memory fallback:', err);
      inMemoryFallback = [...applications];
      return false;
    }
  },

  resetToSampleData: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS));
      }
      inMemoryFallback = [...INITIAL_SAMPLE_APPLICATIONS];
      return INITIAL_SAMPLE_APPLICATIONS;
    } catch (err) {
      inMemoryFallback = [...INITIAL_SAMPLE_APPLICATIONS];
      return inMemoryFallback;
    }
  },

  clearAllData: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
      inMemoryFallback = [];
      return [];
    } catch (err) {
      inMemoryFallback = [];
      return [];
    }
  },

  exportToJson: (applications) => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `jobtrack_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return true;
    } catch (err) {
      console.error('Failed to export data:', err);
      return false;
    }
  },
};
