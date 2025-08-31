import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RemarksList from './RemarksList';

interface Entity {
  id?: string | number;
  name?: string;
  propertyName?: string;
  leadId?: string;
  propertyId?: number;
}

interface Remark {
  id: string;
  remark: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  type?: string;
}

interface UnifiedRemarksModalProps {
  isVisible: boolean;
  onClose: () => void;
  entity: Entity | null;
  entityType: 'lead' | 'property' | 'note';
  onGetRemarks: (entityId: string | number) => Promise<{ success: boolean; data?: Remark[]; error?: string }>;
  onAddRemark?: () => void;
}

const UnifiedRemarksModal: React.FC<UnifiedRemarksModalProps> = ({
  isVisible,
  onClose,
  entity,
  entityType,
  onGetRemarks,
  onAddRemark
}) => {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get entity ID and name
  const getEntityId = () => {
    switch (entityType) {
      case 'lead':
        return entity?.id || entity?.leadId;
      case 'property':
        return entity?.id || entity?.propertyId;
      case 'note':
        return entity?.id;
      default:
        return entity?.id;
    }
  };

  const getEntityName = () => {
    switch (entityType) {
      case 'lead':
        return entity?.name;
      case 'property':
        return entity?.propertyName || entity?.name;
      case 'note':
        return entity?.name || 'Note';
      default:
        return entity?.name;
    }
  };

  const entityId = getEntityId();
  const entityName = getEntityName();

  // Fetch remarks when modal opens
  useEffect(() => {
    if (isVisible && entityId) {
      fetchRemarks();
    }
  }, [isVisible, entityId]);

  const fetchRemarks = async () => {
    if (!entityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await onGetRemarks(entityId);
      
      if (result.success) {
        // Handle different possible data structures
        let remarksData = result.data;
        if (result.data && result.data.content) {
          remarksData = result.data.content; // Handle paginated response
        } else if (result.data && Array.isArray(result.data)) {
          remarksData = result.data; // Handle direct array
        } else {
          remarksData = []; // Handle unexpected data structure
        }
        
        setRemarks(remarksData);
      } else {
        setError(result.error || 'Failed to load remarks');
      }
    } catch (err: any) {
      console.error('UnifiedRemarksModal: Error fetching remarks:', err);
      setError('Failed to load remarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRemarks();
  };

  const handleAddRemark = () => {
    if (onAddRemark) {
      onAddRemark();
    } else {
      Alert.alert('Info', 'Add remark functionality not available');
    }
  };

  if (!isVisible || !entity) {
    return null;
  }

  const getEntityTypeIcon = () => {
    switch (entityType) {
      case 'lead':
        return 'person';
      case 'property':
        return 'home';
      case 'note':
        return 'document-text';
      default:
        return 'information-circle';
    }
  };

  const getEntityTypeColor = () => {
    switch (entityType) {
      case 'lead':
        return '#3b82f6'; // Blue
      case 'property':
        return '#10b981'; // Green
      case 'note':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.entityIcon, { backgroundColor: getEntityTypeColor() }]}>
                <Ionicons name={getEntityTypeIcon() as any} size={20} color="white" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  Remarks for {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
                </Text>
                <Text style={styles.entityName} numberOfLines={1}>
                  {entityName || 'Unknown'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <RemarksList
              remarks={remarks}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
              emptyMessage={`No remarks found for this ${entityType}`}
              showType={true}
            />
          </View>

          {/* Footer Actions */}
          {onAddRemark && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: getEntityTypeColor() }]} 
                onPress={handleAddRemark}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Remark</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '70%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  entityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  entityName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UnifiedRemarksModal;
