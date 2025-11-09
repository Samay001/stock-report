import { RecentUpload } from "./types";

const RECENT_UPLOADS_KEY = "tradeSight_recentUploads";
const MAX_RECENT_UPLOADS = 3;

export const getRecentUploads = (): RecentUpload[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_UPLOADS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent uploads:', error);
    return [];
  }
};

export const addRecentUpload = (upload: Omit<RecentUpload, 'id'>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const recent = getRecentUploads();
    const newUpload: RecentUpload = {
      ...upload,
      id: Date.now().toString()
    };
    
    // Add to beginning and limit to MAX_RECENT_UPLOADS
    const updated = [newUpload, ...recent].slice(0, MAX_RECENT_UPLOADS);
    
    localStorage.setItem(RECENT_UPLOADS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent upload:', error);
  }
};

export const clearRecentUploads = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(RECENT_UPLOADS_KEY);
  } catch (error) {
    console.error('Error clearing recent uploads:', error);
  }
};