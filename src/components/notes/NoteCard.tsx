import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';

interface Note {
  id: number;
  content: string;
  typeStr?: string;
  status?: string;
  priority?: string;
  userId: number;
  [key: string]: any;
}

interface NoteCardProps {
  note: Note;
  onEdit: (noteId: number) => void;
  onDelete: (noteId: number) => void;
  onUpdateStatus: (noteId: number, status: string) => void;
  onUpdatePriority: (noteId: number, priority: string) => void;
  onAddRemark: (note: Note) => void;
  onViewRemarks: (note: Note) => void;
  userRole?: string;
  currentUserId?: number;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePriority,
  onAddRemark,
  onViewRemarks,
  userRole = 'USER',
  currentUserId
}) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A': return '#f44336'; // Red (same as crm-frontend)
      case 'PRIORITY_B': return '#ff9800'; // Orange (same as crm-frontend)
      case 'PRIORITY_C': return '#4caf50'; // Green (same as crm-frontend)
      default: return '#777'; // Gray (same as crm-frontend)
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return '#f0ad4e'; // Yellow/Orange (same as crm-frontend)
      case 'PROCESSING': return '#5bc0de'; // Light Blue (same as crm-frontend)
      case 'COMPLETED': return '#d9534f'; // Red (same as crm-frontend)
      default: return '#ccc'; // Gray (same as crm-frontend)
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'N/A';
    try {
      const date = new Date(dateTime);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCreatedFor = (note: Note) => {
    if (!note.visibility) return 'Unknown';
    
    switch (note.visibility) {
      case 'ONLY_ME':
        return 'Only Me';
      case 'ALL_USERS':
        return 'All Users';
      case 'ALL_ADMIN':
        return 'All Admins';
      case 'SPECIFIC_USERS':
      case 'SPECIFIC_ADMIN':
        if (note.visibleUserNames && note.visibleUserNames.length > 0) {
          return note.visibleUserNames.join(', ');
        } else if (note.visibleUserIds && note.visibleUserIds.length > 0) {
          return `${note.visibleUserIds.length} user(s)`;
        }
        return 'Specific Users';
      default:
        return note.visibility;
    }
  };

  const isEvent = note?.typeStr === 'Event' || note?.dateTime;
  const isUpcoming = isEvent && note?.dateTime && new Date(note.dateTime) > new Date();

  const actions = [
    {
      label: 'Edit Note',
      icon: <Ionicons name="create" size={14} color="#6b7280" />,
      onClick: () => onEdit(note.id)
    },
    {
      label: 'Add Remark',
      icon: <Ionicons name="chatbubble" size={14} color="#6b7280" />,
      onClick: () => onAddRemark(note)
    },
    {
      label: 'View Remarks',
      icon: <Ionicons name="eye" size={14} color="#6b7280" />,
      onClick: () => onViewRemarks(note)
    },
    {
      label: 'Delete Note',
      icon: <Ionicons name="trash" size={14} color="#6b7280" />,
      onClick: () => onDelete(note.id),
      danger: true
    }
  ];

  return (
    <View style={[styles.card, isEvent && styles.eventCard]}>
      {/* Type Indicator */}
      {isEvent && (
        <View style={styles.typeIndicator}>
          <Ionicons name="calendar" size={16} color="#3b82f6" />
          <Text style={styles.typeIndicatorText}>
            {isUpcoming ? '📅 Upcoming Event' : '📅 Past Event'}
          </Text>
        </View>
      )}

      {/* Content */}
      <Text style={styles.content} numberOfLines={3}>
        {note?.content || 'No content available'}
      </Text>

      {/* Status and Priority Selectors */}
      <View style={styles.controlsRow}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Status</Text>
          <TouchableOpacity
            onPress={() => setStatusModalVisible(true)}
          >
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(note?.status || 'NEW') }]}>
              <Text style={styles.badgeText}>{note?.status || 'NEW'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Priority</Text>
          <TouchableOpacity
            onPress={() => setPriorityModalVisible(true)}
          >
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(note?.priority || 'PRIORITY_C') }]}>
              <Text style={styles.badgeText}>{note?.priority || 'PRIORITY_C'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons 
            name={isEvent ? "calendar-outline" : "document-text-outline"} 
            size={16} 
            color={isEvent ? "#3b82f6" : "#6b7280"} 
          />
          <Text style={styles.detailText}>
            Type: <Text style={[styles.detailValue, isEvent && styles.eventDetailValue]}>
              {note?.typeStr || 'Note'}
            </Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            Created By: <Text style={styles.detailValue}>
              {note?.createdBy?.name || note?.createdBy?.username || 'Unknown'}
            </Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            Created For: <Text style={styles.detailValue}>{formatCreatedFor(note)}</Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            Created: <Text style={styles.detailValue}>{formatDateTime(note?.createdAt)}</Text>
          </Text>
        </View>

        {note?.dateTime && (
          <View style={[styles.detailRow, styles.eventDateTimeRow]}>
            <Ionicons name="calendar-outline" size={16} color="#3b82f6" />
            <Text style={[styles.detailText, styles.eventDateTimeText]}>
              {isUpcoming ? 'Scheduled For: ' : 'Event Date: '}
              <Text style={[styles.detailValue, styles.eventDetailValue]}>
                {formatDateTime(note?.dateTime)}
              </Text>
            </Text>
          </View>
        )}
      </View>

      {/* Three Dot Menu */}
      <View style={styles.actionMenuContainer}>
        <ThreeDotMenu
          item={note}
          actions={actions}
          position="right-0"
        />
      </View>

      {/* Status Selection Modal */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <Text style={styles.modalSubtitle}>Select new status</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdateStatus(note.id, 'NEW');
                    setStatusModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>NEW</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdateStatus(note.id, 'PROCESSING');
                    setStatusModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>PROCESSING</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdateStatus(note.id, 'COMPLETED');
                    setStatusModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>COMPLETED</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Priority Selection Modal */}
      <Modal
        visible={priorityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Priority</Text>
            <Text style={styles.modalSubtitle}>Select new priority</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdatePriority(note.id, 'PRIORITY_A');
                    setPriorityModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>Priority A</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdatePriority(note.id, 'PRIORITY_B');
                    setPriorityModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>Priority B</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (note.id) {
                    onUpdatePriority(note.id, 'PRIORITY_C');
                    setPriorityModalVisible(false);
                  }
                }}
              >
                <Text style={styles.optionText}>Priority C</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setPriorityModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  eventCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    backgroundColor: '#f8fafc',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 4,
  },
  content: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlGroup: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDateTimeRow: {
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  eventDateTimeText: {
    color: '#1e40af',
    fontWeight: '500',
  },
  detailValue: {
    color: '#374151',
    fontWeight: '500',
  },
  eventDetailValue: {
    color: '#1e40af',
    fontWeight: '600',
  },
  actionMenuContainer: {
    alignItems: 'flex-end',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteCard;
