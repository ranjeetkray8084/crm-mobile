import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../src/core/config/api.config';
import { AnnouncementService } from '../src/core/services';
import { useAuth } from '../src/shared/contexts/AuthContext';

type Company = { id: number; name: string };

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>{title}</Text>
    {children}
  </View>
);

export default function AddAnnouncementScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [scope, setScope] = useState<'ALL_COMPANIES' | 'ONE_COMPANY' | 'SPECIFIC_COMPANIES'>('ONE_COMPANY');
  const [audience, setAudience] = useState<'ALL_USERS' | 'DIRECTOR_ONLY'>('ALL_USERS');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);
  const baseURL = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    if (!user || user.role !== 'DEVELOPER') return;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${baseURL}/api/companies/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const list: Company[] = await res.json();
          setCompanies(list);
          if (list.length > 0 && companyId == null) setCompanyId(list[0].id);
        } else {
          console.log('Failed to fetch companies:', await res.text());
        }
      } catch (e: any) {
        console.log('Companies fetch error', e?.message || e);
      }
    })();
  }, [user, baseURL]);

  const toggleCompany = (id: number) => {
    setSelectedCompanyIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const pickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant photo library permission.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      await uploadImage(asset.uri);
    } catch (e: any) {
      Alert.alert('Image picker not available', 'You can paste an image URL instead.');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      const res = await AnnouncementService.uploadImage(uri);
      if (res.success && res.imageUrl) setImageUrl(res.imageUrl);
      else Alert.alert('Upload failed', res.error || 'Could not upload image');
    } catch (e: any) {
      Alert.alert('Upload error', e?.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!user || user.role !== 'DEVELOPER') {
      Alert.alert('Access denied', 'Only Developer can create announcements');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Validation', 'Content is required');
      return;
    }
    if (scope === 'ONE_COMPANY' && !companyId) {
      Alert.alert('Validation', 'Please select a company');
      return;
    }
    if (scope === 'SPECIFIC_COMPANIES' && selectedCompanyIds.length === 0) {
      Alert.alert('Validation', 'Please select at least one company');
      return;
    }
    try {
      setSubmitting(true);
      const body: any = { content, imageUrl, scope, audience };
      if (scope === 'ONE_COMPANY') body.companyId = companyId;
      if (scope === 'SPECIFIC_COMPANIES') body.companyIds = selectedCompanyIds;
      const data = await AnnouncementService.create(body);
      if (data.success) {
        Alert.alert('Success', 'Announcement created and push sent');
        router.back();
      } else {
        Alert.alert('Failed', data?.error || 'Could not create announcement');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'DEVELOPER') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Only Developer can access this screen.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, padding: 12, backgroundColor: '#e5e7eb', borderRadius: 8 }}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>Create Announcement</Text>

      <Section title="Content">
        <TextInput
          placeholder="Write announcement content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{ minHeight: 120, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 }}
        />
      </Section>

      <Section title="Image (optional)">
        {imageUrl ? (
          <View style={{ marginBottom: 8 }}>
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 180, borderRadius: 8 }} />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={pickImage} style={{ padding: 12, backgroundColor: '#1c69ff', borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>{uploading ? 'Uploading...' : 'Pick from gallery'}</Text>
          </TouchableOpacity>
        </View>
      </Section>

      <Section title="Scope">
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          {(['ALL_COMPANIES', 'ONE_COMPANY', 'SPECIFIC_COMPANIES'] as const).map(opt => (
            <TouchableOpacity key={opt} onPress={() => setScope(opt)} style={{ padding: 10, borderRadius: 6, borderWidth: 1, borderColor: scope === opt ? '#1c69ff' : '#e5e7eb' }}>
              <Text style={{ color: scope === opt ? '#1c69ff' : '#111827' }}>{opt.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {scope === 'ONE_COMPANY' && (
          <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }}>
            {companies.map(c => (
              <TouchableOpacity key={c.id} onPress={() => setCompanyId(c.id)} style={{ padding: 10, backgroundColor: companyId === c.id ? '#eef2ff' : '#fff' }}>
                <Text>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {scope === 'SPECIFIC_COMPANIES' && (
          <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }}>
            {companies.map(c => {
              const selected = selectedCompanyIds.includes(c.id);
              return (
                <TouchableOpacity key={c.id} onPress={() => toggleCompany(c.id)} style={{ padding: 10, backgroundColor: selected ? '#eef2ff' : '#fff' }}>
                  <Text>{selected ? '✓ ' : ''}{c.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Section>

      <Section title="Audience">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['ALL_USERS', 'DIRECTOR_ONLY'] as const).map(opt => (
            <TouchableOpacity key={opt} onPress={() => setAudience(opt)} style={{ padding: 10, borderRadius: 6, borderWidth: 1, borderColor: audience === opt ? '#1c69ff' : '#e5e7eb' }}>
              <Text style={{ color: audience === opt ? '#1c69ff' : '#111827' }}>{opt.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      <TouchableOpacity onPress={submit} disabled={submitting} style={{ padding: 14, backgroundColor: '#1c69ff', borderRadius: 10, alignItems: 'center' }}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Create Announcement</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, padding: 12, backgroundColor: '#e5e7eb', borderRadius: 8, alignItems: 'center' }}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


