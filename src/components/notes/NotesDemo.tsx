import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddNoteModal from './modals/AddNoteModal';
import NoteCard from './NoteCard';

const NotesDemo: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'This is a sample note for demonstration purposes. It shows how notes are displayed in the system.',
      status: 'NEW',
      priority: 'PRIORITY_A',
      typeStr: 'Note',
      createdAt: new Date().toISOString(),
      userId: 1,
      createdBy: { name: 'John Doe', username: 'johndoe' },
      visibility: 'ALL_USERS',
      visibleUserIds: [],
      visibleUserNames: []
    },
    {
      id: 2,
      content: 'Team meeting scheduled for next week to discuss project progress and upcoming milestones.',
      status: 'PROCESSING',
      priority: 'PRIORITY_B',
      typeStr: 'Event',
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: new Date().toISOString(),
      userId: 1,
      createdBy: { name: 'John Doe', username: 'johndoe' },
      visibility: 'SPECIFIC_USERS',
      visibleUserIds: [2, 3],
      visibleUserNames: ['Jane Smith', 'Bob Johnson']
    },
    {
      id: 3,
      content: 'Completed the quarterly review report. All objectives have been met successfully.',
      status: 'COMPLETED',
      priority: 'PRIORITY_C',
      typeStr: 'Note',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      userId: 2,
      createdBy: { name: 'Jane Smith', username: 'janesmith' },
      visibility: 'ME_AND_DIRECTOR',
      visibleUserIds: [],
      visibleUserNames: []
    },
    {
      id: 4,
      content: 'Client presentation meeting with ABC Corp. Prepare slides and demo materials.',
      status: 'NEW',
      priority: 'PRIORITY_A',
      typeStr: 'Event',
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      createdAt: new Date().toISOString(),
      userId: 3,
      createdBy: { name: 'Bob Johnson', username: 'bobjohnson' },
      visibility: 'SPECIFIC_ADMIN',
      visibleUserIds: [1],
      visibleUserNames: ['John Doe']
    }
  ]);

  const handleCreateNote = async (noteData: any) => {
    const newNote = {
      id: notes.length + 1,
      ...noteData,
      createdAt: new Date().toISOString(),
      userId: 1,
      createdBy: { name: 'Demo User', username: 'demouser' },
      typeStr: noteData.type === 'EVENT' ? 'Event' : 'Note',
      visibleUserNames: noteData.visibleUserIds?.length > 0 ? ['User 1', 'User 2'] : []
    };

    setNotes(prev => [newNote, ...prev]);
    setIsAddModalOpen(false);
    Alert.alert('Success', 'Note/Event created successfully!');
  };

  const handleEdit = (noteId: number) => {
    Alert.alert('Edit', `Edit note ${noteId} - This would open the edit modal`);
  };

  const handleDelete = (noteId: number) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    Alert.alert('Success', 'Note deleted successfully!');
  };

  const handleUpdateStatus = (noteId: number, status: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, status } : note
    ));
  };

  const handleUpdatePriority = (noteId: number, priority: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, priority } : note
    ));
  };

  const handleAddRemark = (noteId: number) => {
    Alert.alert('Add Remark', `Add remark to note ${noteId} - This would open the remark modal`);
  };

  const handleViewRemarks = (noteId: number) => {
    Alert.alert('View Remarks', `View remarks for note ${noteId} - This would open the remarks modal`);
  };

  const handleShare = (note: any) => {
    Alert.alert('Share', `Share functionality for ${note.typeStr} would be implemented here`);
  };

  const handleDuplicate = (note: any) => {
    Alert.alert('Duplicate', `Duplicate functionality for ${note.typeStr} would be implemented here`);
  };

  const handleArchive = (note: any) => {
    Alert.alert('Archive', `Archive functionality for ${note.typeStr} would be implemented here`);
  };

  const handlePin = (note: any) => {
    Alert.alert('Pin', `Pin functionality for ${note.typeStr} would be implemented here`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes & Events Demo</Text>
        <Text style={styles.subtitle}>
          Showcasing the enhanced notes and events system with actions
        </Text>
      </View>

      {/* Demo Controls */}
      <View style={styles.demoControls}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Create New Note/Event</Text>
        </TouchableOpacity>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notes.filter(n => n.typeStr === 'Event').length}
            </Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notes.filter(n => n.typeStr === 'Note').length}
            </Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>

        {/* Action System Info */}
        <View style={styles.actionInfo}>
          <Text style={styles.actionInfoTitle}>🎯 Action System Features</Text>
          <Text style={styles.actionInfoText}>
            • Click on any note/event to see the action system
          </Text>
          <Text style={styles.actionInfoText}>
            • Manage status, priority, and perform various actions
          </Text>
          <Text style={styles.actionInfoText}>
            • Role-based permissions and visibility controls
          </Text>
        </View>
      </View>

      {/* Notes List */}
      <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePriority={handleUpdatePriority}
            onAddRemark={handleAddRemark}
            onViewRemarks={handleViewRemarks}
            userRole="ADMIN"
            currentUserId={1}
          />
        ))}
      </ScrollView>

      {/* Add Note Modal */}
      <AddNoteModal
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreateNote={handleCreateNote}
        companyId={1}
        userId={1}
        userRole="ADMIN"
      />

      {/* Note Details Modal - Removed since we're removing view details functionality */}
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
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  demoControls: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c69ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c69ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actionInfo: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  actionInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  actionInfoText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
  },
  notesList: {
    flex: 1,
    padding: 16,
  },
});

export default NotesDemo;
