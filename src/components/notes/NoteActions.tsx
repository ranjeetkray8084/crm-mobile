import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

interface NoteActionsProps {
  note: Note;
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
  isOwner?: boolean;
}

const NoteActions: React.FC<NoteActionsProps> = ({
  note,
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
  isOwner = false
}) => {
  const canDelete = userRole === 'DIRECTOR' || userRole === 'ADMIN' || isOwner;
  const canEdit = userRole === 'DIRECTOR' || userRole === 'ADMIN' || isOwner;
  const canManageVisibility = userRole === 'DIRECTOR' || userRole === 'ADMIN';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'star';
      case 'PROCESSING':
        return 'sync';
      case 'COMPLETED':
        return 'checkmark-circle';
      default:
        return 'ellipsis-horizontal';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'PRIORITY_A':
        return 'alert-circle';
      case 'PRIORITY_B':
        return 'warning';
      case 'PRIORITY_C':
        return 'information-circle';
      default:
        return 'ellipsis-horizontal';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'ONLY_ME':
        return 'person';
      case 'ALL_USERS':
        return 'people';
      case 'ALL_ADMIN':
        return 'shield-checkmark';
      case 'SPECIFIC_USERS':
        return 'person-add';
      case 'SPECIFIC_ADMIN':
        return 'shield-add';
      case 'ME_AND_DIRECTOR':
        return 'star';
      case 'ME_AND_ADMIN':
        return 'shield';
      default:
        return 'eye';
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

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(note.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
    onPriorityUpdate(note.id, newPriority);
  };

  return (
    <View style={styles.container}>
      {/* Status Management Section */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Status Management</Text>
        <View style={styles.actionButtons}>
          {['NEW', 'PROCESSING', 'COMPLETED'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.actionButton,
                note.status === status && styles.actionButtonActive,
                { borderColor: getStatusColor(status) }
              ]}
              onPress={() => handleStatusChange(status)}
            >
              <Ionicons 
                name={getStatusIcon(status) as any} 
                size={16} 
                color={note.status === status ? '#fff' : getStatusColor(status)} 
              />
              <Text style={[
                styles.actionButtonText,
                note.status === status && styles.actionButtonTextActive,
                { color: note.status === status ? '#fff' : getStatusColor(status) }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Priority Management Section */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Priority Management</Text>
        <View style={styles.actionButtons}>
          {['PRIORITY_A', 'PRIORITY_B', 'PRIORITY_C'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.actionButton,
                note.priority === priority && styles.actionButtonActive,
                { borderColor: getPriorityColor(priority) }
              ]}
              onPress={() => handlePriorityChange(priority)}
            >
              <Ionicons 
                name={getPriorityIcon(priority) as any} 
                size={16} 
                color={note.priority === priority ? '#fff' : getPriorityColor(priority)} 
              />
              <Text style={[
                styles.actionButtonText,
                note.priority === priority && styles.actionButtonTextActive,
                { color: note.priority === priority ? '#fff' : getPriorityColor(priority) }
              ]}>
                {priority.replace('PRIORITY_', 'Priority ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Note Management Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Note Management</Text>
        <View style={styles.actionButtons}>
          {canEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={() => onUpdate(note)}>
              <Ionicons name="create" size={20} color="#f59e0b" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onAddRemark(note)}>
            <Ionicons name="chatbubble" size={20} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>Add Remark</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onViewRemarks(note)}>
            <Ionicons name="eye" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>View Remarks</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Additional Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(note)}>
            <Ionicons name="share" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onDuplicate(note)}>
            <Ionicons name="copy" size={20} color="#8b5cf6" />
            <Text style={styles.actionButtonText}>Duplicate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onPin(note)}>
            <Ionicons name="pin" size={20} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Pin</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onArchive(note)}>
            <Ionicons name="archive" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>Archive</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visibility Information */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Visibility</Text>
        <View style={styles.visibilityInfo}>
          <Ionicons 
            name={getVisibilityIcon(note.visibility) as any} 
            size={20} 
            color="#6b7280" 
          />
          <Text style={styles.visibilityText}>
            {getVisibilityLabel(note.visibility)}
          </Text>
          {note.visibleUserIds && note.visibleUserIds.length > 0 && (
            <Text style={styles.visibilityDetails}>
              ({note.visibleUserIds.length} specific users)
            </Text>
          )}
        </View>
      </View>

      {/* Danger Actions */}
      {canDelete && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={() => onDelete(note.id)}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                Delete {note.type === 'EVENT' ? 'Event' : 'Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  dangerButtonText: {
    color: '#ef4444',
  },
  visibilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  visibilityDetails: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default NoteActions;
