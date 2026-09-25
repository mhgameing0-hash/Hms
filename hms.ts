export type Language = 'urdu' | 'english' | 'arabic';

export interface HMSService {
  id: string;
  titleUrdu: string;
  titleEng: string;
  titleArabic: string;
  iconName: string;
  accentColor: string;
  category: string;
  categoryUrdu: string;
  categoryArabic: string;
  descriptionUrdu: string;
  descriptionEng: string;
  descriptionArabic: string;
  typicalRate: string;
  rateUnit: string;
  commonTasks: string[];
}

export interface WorkerReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  commentUrdu: string;
  commentEng: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  serviceId: string;
  phone: string;
  whatsapp: string;
  experienceYears: number;
  rateText: string;
  city: string;
  area: string;
  rating: number;
  jobsCompleted: number;
  cnicVerified: boolean;
  isAvailableToday: boolean;
  bio: string;
  portfolioImages: string[];
  videoThumbnail?: string;
  hasAudioIntro?: boolean;
  badgeLevel: 'Top Rated' | 'Verified Pro' | 'Master Craftsman';
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  serviceId: string;
  proId?: string;
  proName?: string;
  customerName: string;
  customerPhone: string;
  city: string;
  area: string;
  address: string;
  serviceType: string;
  urgency: 'urgent' | 'scheduled';
  scheduledDate?: string;
  notes: string;
  hasVoiceNote?: boolean;
  status: 'pending' | 'confirmed' | 'worker_assigned' | 'completed';
  createdAt: string;
}

export interface ConstructionEstimateItem {
  id: string;
  nameUrdu: string;
  nameEng: string;
  unit: string;
  defaultRatePkr: number;
  quantity: number;
  totalPkr: number;
}
