import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NoteCardProps {
  note: any;
  onEdit: (noteId: number) => void;
  onDelete: (noteId: number) => void;
  onUpdateStatus: (noteId: number, status: string) => void;
  onUpdatePriority: (noteId: number, priority: string) => void;
  onAddRemark: (noteId: number) => void;
  onViewRemarks: (noteId: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePriority,
  onAddRemark,
  onViewRemarks,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A': return '#ef4444'; // Red
      case 'PRIORITY_B': return '#f59e0b'; // Orange
      case 'PRIORITY_C': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return '#f59e0b'; // Yellow/Orange
      case 'PROCESSING': return '#3b82f6'; // Blue
      case 'COMPLETED': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
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

  const formatCreatedFor = (note: any) => {
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(note.id) }
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Content */}
      <Text style={styles.content} numberOfLines={3}>
        {note?.content || 'No content available'}
      </Text>

      {/* Status and Priority Selectors */}
      <View style={styles.controlsRow}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(note?.status) }]}>
            <Text style={styles.badgeText}>{note?.status || 'NEW'}</Text>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Priority</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(note?.priority) }]}>
            <Text style={styles.badgeText}>{note?.priority || 'PRIORITY_C'}</Text>
          </View>
        </View>
      </View>

      {/* Note Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            Type: <Text style={styles.detailValue}>{note?.typeStr || 'Note'}</Text>
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
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Scheduled: <Text style={styles.detailValue}>{formatDateTime(note?.dateTime)}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit(note.id)}
        >
          <Ionicons name="create-outline" size={16} color="#1c69ff" />
          <Text style={[styles.actionButtonText, styles.editButtonText]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.remarkButton]} 
          onPress={() => onAddRemark(note.id)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#f59e0b" />
          <Text style={[styles.actionButtonText, styles.remarkButtonText]}>Add Remark</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]} 
          onPress={() => onViewRemarks(note.id)}
        >
          <Ionicons name="eye-outline" size={16} color="#10b981" />
          <Text style={[styles.actionButtonText, styles.viewButtonText]}>View Remarks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    color: '#374151',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    borderColor: '#1c69ff',
    backgroundColor: '#f0f9ff',
  },
  editButtonText: {
    color: '#1c69ff',
  },
  remarkButton: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  remarkButtonText: {
    color: '#f59e0b',
  },
  viewButton: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  viewButtonText: {
    color: '#10b981',
  },
  deleteButton: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
});

export default NoteCard;
