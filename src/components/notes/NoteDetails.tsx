import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoteActions from './NoteActions';
import NotificationPanel from './NotificationPanel';

interface Note {
  id: number;
  content: string;
  type: 'NOTE' | 'EVENT';
  dateTime?: string;
  priority: string;
  status: string;
  visibility: string;
  visibleUserIds: number[];
  userId: number;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
    username: string;
  };
}

interface NoteDetailsProps {
  note: Note;
  onClose: () => void;
  onStatusUpdate: (noteId: number, status: string) => void;
  onPriorityUpdate: (noteId: number, priority: string) => void;
  onDelete: (noteId: number) => void;
  onUpdate: (note: Note) => void;
  onAddRemark: (note: Note) => void;
  onViewRemarks: (note: Note) => void;
  onShare: (note: Note) => void;
  onDuplicate: (note: Note) => void;
  onArchive: (note: Note) => void;
  onPin: (note: Note) => void;
  userRole?: string;
  currentUserId?: number;
}

const NoteDetails: React.FC<NoteDetailsProps> = ({
  note,
  onClose,
  onStatusUpdate,
  onPriorityUpdate,
  onDelete,
  onUpdate,
  onAddRemark,
  onViewRemarks,
  onShare,
  onDuplicate,
  onArchive,
  onPin,
  userRole,
  currentUserId
}) => {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    actions: true,
  });
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return '#f59e0b';
      case 'PROCESSING':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A':
        return '#ef4444';
      case 'PRIORITY_B':
        return '#f59e0b';
      case 'PRIORITY_C':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'ONLY_ME':
        return 'Only Me';
      case 'ALL_USERS':
        return 'All Users';
      case 'ALL_ADMIN':
        return 'All Admins';
      case 'SPECIFIC_USERS':
        return 'Specific Users';
      case 'SPECIFIC_ADMIN':
        return 'Specific Admins';
      case 'ME_AND_DIRECTOR':
        return 'Me + Director';
      case 'ME_AND_ADMIN':
        return 'Me + Admin';
      default:
        return visibility;
    }
  };

  const isOwner = currentUserId === note.userId;
  const isEvent = note.type === 'EVENT';
  const isUpcoming = isEvent && note.dateTime && new Date(note.dateTime) > new Date();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {isEvent ? '📅 Event Details' : '📝 Note Details'}
            </Text>
            {isEvent && (
              <View style={[styles.eventBadge, { backgroundColor: isUpcoming ? '#3b82f6' : '#6b7280' }]}>
                <Text style={styles.eventBadgeText}>
                  {isUpcoming ? 'Upcoming' : 'Past'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            ID: {note.id} • Created {formatDate(note.createdAt)}
          </Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton} 
            onPress={() => setShowNotificationPanel(true)}
          >
            <Ionicons name="notifications" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={onClose}>
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Content Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('details')}
          >
            <Text style={styles.sectionTitle}>Content & Information</Text>
            <Ionicons 
              name={expandedSections.details ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
          
          {expandedSections.details && (
            <View style={styles.sectionContent}>
              {/* Content */}
              <View style={styles.contentBox}>
                <Text style={styles.contentLabel}>Content</Text>
                <Text style={styles.contentText}>{note.content}</Text>
              </View>

              {/* Type and Status */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <View style={[styles.infoBadge, { backgroundColor: isEvent ? '#3b82f6' : '#10b981' }]}>
                    <Text style={styles.infoBadgeText}>
                      {isEvent ? '📅 Event' : '📝 Note'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={[styles.infoBadge, { backgroundColor: getStatusColor(note.status) }]}>
                    <Text style={styles.infoBadgeText}>{note.status}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Priority</Text>
                  <View style={[styles.infoBadge, { backgroundColor: getPriorityColor(note.priority) }]}>
                    <Text style={styles.infoBadgeText}>
                      {note.priority.replace('PRIORITY_', 'Priority ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Visibility</Text>
                  <Text style={styles.infoText}>{getVisibilityLabel(note.visibility)}</Text>
                </View>
              </View>

              {/* Event-specific Information */}
              {isEvent && note.dateTime && (
                <View style={styles.eventInfo}>
                  <Text style={styles.eventInfoTitle}>Event Details</Text>
                  <View style={styles.eventDateTime}>
                    <Ionicons name="calendar" size={20} color="#3b82f6" />
                    <Text style={styles.eventDateTimeText}>
                      {formatDate(note.dateTime)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Creator Information */}
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorLabel}>Created By</Text>
                <View style={styles.creatorDetails}>
                  <Ionicons name="person" size={16} color="#6b7280" />
                  <Text style={styles.creatorText}>
                    {note.createdBy?.name || note.createdBy?.username || 'Unknown'}
                  </Text>
                  {isOwner && (
                    <View style={styles.ownerBadge}>
                      <Text style={styles.ownerBadgeText}>Owner</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Visibility Details */}
              {note.visibleUserIds && note.visibleUserIds.length > 0 && (
                <View style={styles.visibilityDetails}>
                  <Text style={styles.visibilityLabel}>Visible To</Text>
                  <Text style={styles.visibilityText}>
                    {note.visibleUserIds.length} specific user{note.visibleUserIds.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('actions')}
          >
            <Text style={styles.sectionTitle}>Actions & Management</Text>
            <Ionicons 
              name={expandedSections.actions ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
          
          {expandedSections.actions && (
            <View style={styles.sectionContent}>
              <NoteActions
                note={note}
                onStatusUpdate={onStatusUpdate}
                onPriorityUpdate={onPriorityUpdate}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onAddRemark={onAddRemark}
                onViewRemarks={onViewRemarks}
                onShare={onShare}
                onDuplicate={onDuplicate}
                onArchive={onArchive}
                onPin={onPin}
                userRole={userRole}
                isOwner={isOwner}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Notification Panel */}
      <NotificationPanel
        noteId={note.id}
        noteTitle={note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '')}
        noteType={note.type}
        eventDateTime={note.dateTime}
        isVisible={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionContent: {
    padding: 16,
  },
  contentBox: {
    marginBottom: 20,
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 6,
  },
  infoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  eventInfo: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginBottom: 20,
  },
  eventInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  eventDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDateTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
  },
  creatorInfo: {
    marginBottom: 16,
  },
  creatorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  creatorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  ownerBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  visibilityDetails: {
    marginBottom: 16,
  },
  visibilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  visibilityText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default NoteDetails;
