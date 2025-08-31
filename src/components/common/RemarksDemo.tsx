import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  RemarkCard, 
  RemarksList, 
  UnifiedRemarksModal, 
  UnifiedAddRemarkModal 
} from './index';

// Mock data for demonstration
const mockRemarks = [
  {
    id: '1',
    remark: 'Customer showed interest in 3BHK properties. Follow up scheduled for next week.',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: { name: 'John Doe' },
    type: 'followup'
  },
  {
    id: '2',
    remark: 'Property inspection completed. All amenities working properly.',
    createdAt: '2024-01-14T15:45:00Z',
    createdBy: { name: 'Jane Smith' },
    type: 'general'
  },
  {
    id: '3',
    remark: 'Important: Client has urgent requirement. Need immediate attention.',
    createdAt: '2024-01-13T09:15:00Z',
    createdBy: { name: 'Mike Johnson' },
    type: 'important'
  },
  {
    id: '4',
    remark: 'Note: Property valuation report attached for review.',
    createdAt: '2024-01-12T14:20:00Z',
    createdBy: { name: 'Sarah Wilson' },
    type: 'note'
  }
];

const mockLead = {
  id: 'lead-123',
  name: 'Rahul Kumar',
  leadId: 'lead-123'
};

const mockProperty = {
  id: 456,
  propertyId: 456,
  propertyName: 'Sunrise Apartments - 3BHK',
  name: 'Sunrise Apartments - 3BHK'
};

const mockNote = {
  id: 789,
  name: 'Meeting Notes - Client Discussion'
};

const RemarksDemo: React.FC = () => {
  const [showLeadRemarks, setShowLeadRemarks] = useState(false);
  const [showPropertyRemarks, setShowPropertyRemarks] = useState(false);
  const [showNoteRemarks, setShowNoteRemarks] = useState(false);
  const [showAddRemark, setShowAddRemark] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [currentEntityType, setCurrentEntityType] = useState<'lead' | 'property' | 'note'>('lead');

  const handleViewRemarks = (entity: any, entityType: 'lead' | 'property' | 'note') => {
    setCurrentEntity(entity);
    setCurrentEntityType(entityType);
    switch (entityType) {
      case 'lead':
        setShowLeadRemarks(true);
        break;
      case 'property':
        setShowPropertyRemarks(true);
        break;
      case 'note':
        setShowNoteRemarks(true);
        break;
    }
  };

  const handleAddRemark = (entity: any, entityType: 'lead' | 'property' | 'note') => {
    setCurrentEntity(entity);
    setCurrentEntityType(entityType);
    setShowAddRemark(true);
  };

  const mockGetRemarks = async (entityId: string | number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: mockRemarks
    };
  };

  const mockAddRemark = async (data: { remark: string; type?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Adding remark:', data);
    return {
      success: true,
      data: { id: Date.now().toString(), ...data }
    };
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={24} color="white" />
        <Text style={styles.headerText}>Unified Remarks Demo</Text>
      </View>

      <View style={styles.content}>
        {/* Individual Remark Card Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Individual Remark Card</Text>
          <Text style={styles.sectionDescription}>
            Single remark displayed in a clean card format
          </Text>
          <RemarkCard remark={mockRemarks[0]} />
        </View>

        {/* Compact Remark Card Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compact Remark Card</Text>
          <Text style={styles.sectionDescription}>
            Compact version for list views
          </Text>
          <RemarkCard remark={mockRemarks[1]} compact={true} />
        </View>

        {/* Remarks List Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks List</Text>
          <Text style={styles.sectionDescription}>
            List of remarks with pull-to-refresh
          </Text>
          <View style={styles.listContainer}>
            <RemarksList
              remarks={mockRemarks}
              onRefresh={() => console.log('Refreshing...')}
              emptyMessage="No remarks found"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>View Remarks by Entity Type</Text>
          <Text style={styles.sectionDescription}>
            Click to view remarks for different entity types
          </Text>
          
          <View style={styles.buttonGrid}>
            {/* Lead Remarks */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => handleViewRemarks(mockLead, 'lead')}
            >
              <Ionicons name="person" size={20} color="white" />
              <Text style={styles.actionButtonText}>View Lead Remarks</Text>
            </TouchableOpacity>

            {/* Property Remarks */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => handleViewRemarks(mockProperty, 'property')}
            >
              <Ionicons name="home" size={20} color="white" />
              <Text style={styles.actionButtonText}>View Property Remarks</Text>
            </TouchableOpacity>

            {/* Note Remarks */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
              onPress={() => handleViewRemarks(mockNote, 'note')}
            >
              <Ionicons name="document-text" size={20} color="white" />
              <Text style={styles.actionButtonText}>View Note Remarks</Text>
            </TouchableOpacity>

            {/* Add Remark */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
              onPress={() => handleAddRemark(mockLead, 'lead')}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.actionButtonText}>Add Remark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Unified Remarks Modal for Leads */}
      <UnifiedRemarksModal
        isVisible={showLeadRemarks}
        onClose={() => setShowLeadRemarks(false)}
        entity={currentEntity}
        entityType="lead"
        onGetRemarks={mockGetRemarks}
        onAddRemark={() => {
          setShowLeadRemarks(false);
          handleAddRemark(currentEntity, 'lead');
        }}
      />

      {/* Unified Remarks Modal for Properties */}
      <UnifiedRemarksModal
        isVisible={showPropertyRemarks}
        onClose={() => setShowPropertyRemarks(false)}
        entity={currentEntity}
        entityType="property"
        onGetRemarks={mockGetRemarks}
        onAddRemark={() => {
          setShowPropertyRemarks(false);
          handleAddRemark(currentEntity, 'property');
        }}
      />

      {/* Unified Remarks Modal for Notes */}
      <UnifiedRemarksModal
        isVisible={showNoteRemarks}
        onClose={() => setShowNoteRemarks(false)}
        entity={currentEntity}
        entityType="note"
        onGetRemarks={mockGetRemarks}
        onAddRemark={() => {
          setShowNoteRemarks(false);
          handleAddRemark(currentEntity, 'note');
        }}
      />

      {/* Unified Add Remark Modal */}
      <UnifiedAddRemarkModal
        isVisible={showAddRemark}
        onClose={() => setShowAddRemark(false)}
        entity={currentEntity}
        entityType={currentEntityType}
        onAddRemark={mockAddRemark}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8b5cf6',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  listContainer: {
    height: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGrid: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RemarksDemo;
