import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  maxUsers: number;
  maxAdmins: number;
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  totalUsers?: number;
  totalAdmins?: number;
}

interface ViewCompanyModalProps {
  isVisible: boolean;
  onClose: () => void;
  company: Company | null;
}

const ViewCompanyModal: React.FC<ViewCompanyModalProps> = ({
  isVisible,
  onClose,
  company
}) => {
  if (!company) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: boolean) => {
    return status ? { bg: '#dcfce7', text: '#166534' } : { bg: '#fee2e2', text: '#991b1b' };
  };

  const getStatusLabel = (status: boolean) => {
    return status ? 'Active' : 'Inactive';
  };

  const statusStyle = getStatusColor(company.status);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="business" size={24} color="white" />
            <Text style={styles.headerTitle}>Company Details</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Company Name and Status */}
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {getStatusLabel(company.status)}
              </Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="mail" size={20} color="#6b7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{company.email || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call" size={20} color="#6b7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{company.phone || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* User Limits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Limits</Text>
            
            <View style={styles.limitsContainer}>
              <View style={styles.limitItem}>
                <Ionicons name="people" size={20} color="#3b82f6" />
                <View style={styles.limitContent}>
                  <Text style={styles.limitLabel}>Max Users</Text>
                  <Text style={styles.limitValue}>{company.maxUsers || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.limitItem}>
                <Ionicons name="shield" size={20} color="#8b5cf6" />
                <View style={styles.limitContent}>
                  <Text style={styles.limitLabel}>Max Admins</Text>
                  <Text style={styles.limitValue}>{company.maxAdmins || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Current Usage */}
          {(company.totalUsers !== undefined || company.totalAdmins !== undefined) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Usage</Text>
              
              <View style={styles.usageContainer}>
                {company.totalUsers !== undefined && (
                  <View style={styles.usageItem}>
                    <Ionicons name="person" size={20} color="#10b981" />
                    <View style={styles.usageContent}>
                      <Text style={styles.usageLabel}>Current Users</Text>
                      <Text style={styles.usageValue}>{company.totalUsers}</Text>
                    </View>
                  </View>
                )}

                {company.totalAdmins !== undefined && (
                  <View style={styles.usageItem}>
                    <Ionicons name="shield-checkmark" size={20} color="#f59e0b" />
                    <View style={styles.usageContent}>
                      <Text style={styles.usageLabel}>Current Admins</Text>
                      <Text style={styles.usageValue}>{company.totalAdmins}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* System Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Information</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="key" size={20} color="#6b7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Company ID</Text>
                <Text style={styles.detailValue}>{company.id}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#6b7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Created Date</Text>
                <Text style={styles.detailValue}>{formatDate(company.createdAt)}</Text>
              </View>
            </View>

            {company.createdBy && (
              <View style={styles.detailRow}>
                <Ionicons name="person" size={20} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Created By</Text>
                  <Text style={styles.detailValue}>{company.createdBy.name}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Close Button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={styles.closeButtonMain} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0d9488',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  companyHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  limitsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  limitItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  limitContent: {
    marginLeft: 8,
  },
  limitLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  limitValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  usageContainer: {
    gap: 12,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  usageContent: {
    marginLeft: 8,
  },
  usageLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  usageValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  closeButtonContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  closeButtonMain: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ViewCompanyModal;
