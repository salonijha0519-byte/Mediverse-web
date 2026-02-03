
export interface UserProfile {
  id: string; // Unique ID (e.g., email or random)
  name: string;
  email: string;
  bloodGroup: string;
  profilePic?: string;
  allergies: string[];
  chronicConditions: string[];
  joinedAt: string;
}

export interface MedicalReport {
  id: string;
  ownerId: string;
  title: string;
  date: string;
  fileType: string;
  content: string; // Base64 or text
  analysis?: HealthAnalysis;
  isEmergency: boolean;
}

export interface SharedReport {
  id: string;
  reportId: string;
  fromId: string;
  toId: string;
  sharedAt: string;
  reportData: MedicalReport; // Snapshot for sharing
}

export interface HealthAnalysis {
  summary: string;
  metrics: HealthMetric[];
  recommendations: string[];
  criticalLevel: 'Low' | 'Medium' | 'High';
}

export interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum View {
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  REPORTS = 'reports',
  CHAT = 'chat',
  EMERGENCY = 'emergency',
  SHARING = 'sharing'
}
