import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../config/api.config';

export type AnnouncementScope = 'ALL_COMPANIES' | 'ONE_COMPANY' | 'SPECIFIC_COMPANIES';
export type AnnouncementAudience = 'ALL_USERS' | 'DIRECTOR_ONLY';

export interface CreateAnnouncementRequest {
  content: string;
  imageUrl?: string | null;
  scope: AnnouncementScope;
  companyId?: number;
  companyIds?: number[];
  audience: AnnouncementAudience;
}

export class AnnouncementService {
  static async uploadImage(fileUri: string, filename?: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    const baseURL = getApiBaseUrl();
    const token = await AsyncStorage.getItem('token');
    const form = new FormData();
    const name = filename || fileUri.split('/').pop() || `ann_${Date.now()}.jpg`;
    const type = name.endsWith('.png') ? 'image/png' : (name.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
    form.append('file', { uri: fileUri, name, type } as any);
    const res = await fetch(`${baseURL}/api/announcements/upload-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form,
    } as any);
    const data = await res.json();
    return res.ok ? { success: true, imageUrl: `${baseURL}${data.imageUrl}` } : { success: false, error: data?.error || 'Upload failed' };
  }

  static async create(req: CreateAnnouncementRequest): Promise<{ success: boolean; createdIds?: number[]; error?: string }> {
    const baseURL = getApiBaseUrl();
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${baseURL}/api/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    return res.ok ? { success: true, createdIds: data?.createdIds || [] } : { success: false, error: data?.error || 'Create failed' };
  }
}


