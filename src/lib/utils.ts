import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
}

export function getRiskLevel(attendancePercent: number, marksPercent: number, attendanceThreshold: number, marksThreshold: number): 'high' | 'medium' | 'low' | 'none' {
  const attendanceBelowThreshold = attendancePercent < attendanceThreshold;
  const marksBelowThreshold = marksPercent < marksThreshold;

  if (attendanceBelowThreshold && marksBelowThreshold) return 'high';
  if (attendanceBelowThreshold || marksBelowThreshold) return 'medium';
  if (attendancePercent < attendanceThreshold + 5 || marksPercent < marksThreshold + 10) return 'low';
  return 'none';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-800',
    present: 'bg-emerald-100 text-emerald-800',
    verified: 'bg-emerald-100 text-emerald-800',
    resolved: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    pending_verification: 'bg-amber-100 text-amber-800',
    under_review: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    absent: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    late: 'bg-orange-100 text-orange-800',
    open: 'bg-purple-100 text-purple-800',
    at_risk: 'bg-red-100 text-red-800',
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-yellow-100 text-yellow-800',
    none: 'bg-gray-100 text-gray-600',
    planned: 'bg-indigo-100 text-indigo-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    completed: 'Completed',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    verified: 'Verified',
    rejected: 'Rejected',
    pending: 'Pending',
    pending_verification: 'Pending Verification',
    overdue: 'Overdue',
    open: 'Open',
    under_review: 'Under Review',
    resolved: 'Resolved',
    in_progress: 'In Progress',
    planned: 'Planned',
    cancelled: 'Cancelled',
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    none: 'No Risk',
  };
  return labels[status] || status;
}

// localStorage helpers
const STORAGE_PREFIX = 'school_platform_';

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clearAllStorage(): void {
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
