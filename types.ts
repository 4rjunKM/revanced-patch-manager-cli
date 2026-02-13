
export enum AppView {
  DASHBOARD = 'Dashboard',
  APPLICATIONS = 'Applications',
  SOURCES = 'Sources',
  PATCHES = 'Patches',
  SETTINGS = 'Settings',
  LOGS = 'Logs',
  DOWNLOADS = 'Downloads'
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Patch {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version?: string;
  compatibleApps?: string[]; 
  compatibilityStatus?: 'verified' | 'warning' | 'incompatible' | 'unknown';
  compatibilityNote?: string;
}

export interface TargetApp {
  id: string;
  name: string;
  icon: string;
  iconUrl?: string; 
  packageName: string;
  color: string;
  recommendedVersion?: string; 
}

export interface GitRepo {
  id: string;
  owner: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  lastUpdated: string;
  branch: string;
  isOfficial: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface VersionInfo {
  name: string;
  version: string;
  url: string;
}

export interface GroundingLink {
  uri: string;
  title: string;
}
