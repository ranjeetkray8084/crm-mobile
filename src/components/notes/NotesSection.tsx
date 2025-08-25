import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { useNotes } from '../../core/hooks/useNotes';
import { useAuth } from '../../shared/contexts/AuthContext';
import NotesList from './NotesList';
import NotesToolbar from './NotesToolbar';
import NotesFilters from './NotesFilters';
import AddNoteModal from './modals/AddNoteModal';
import EditNoteModal from './modals/EditNoteModal';
import AddRemarkModal from './modals/AddRemarkModal';
import ViewRemarksModal from './modals/ViewRemarksModal';

const NotesSection: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isViewRemarksModalOpen, setIsViewRemarksModalOpen] = useState(false);
  const [remarks, setRemarks] = useState([]);

  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const userRole = user?.role || 'USER';

  const {
    notes,
    loading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    updateNoteStatus,
    updateNotePriority,
    addRemarkToNote,
    getNoteById,
    getRemarksByNoteId,
  } = useNotes(companyId, userId, userRole);

  // Refresh function
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Initial load
  useEffect(() => {
    if (companyId && userId) {
      loadNotes();
    }
  }, [companyId, userId, refreshKey]);

  // Filter and search logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' ||
      (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.typeStr && note.typeStr.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === '' || note.status === statusFilter;
    const matchesPriority = priorityFilter === '' || note.priority === priorityFilter;
    const matchesType = typeFilter === '' || note.typeStr === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Status-based sorting logic: NEW -> PROCESSING -> COMPLETED
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const statusPriority = {
      'NEW': 1,
      'PROCESSING': 2,
      'COMPLETED': 3
    };
    
    const statusA = (a.status || 'COMPLETED').toUpperCase();
    const statusB = (b.status || 'COMPLETED').toUpperCase();
    
    const priorityA = statusPriority[statusA] || 4;
    const priorityB = statusPriority[statusB] || 4;
    
    return priorityA - priorityB;
  });

  // Get unique types for filter dropdown
  const uniqueTypes = [...new Set(notes.map(note => note.typeStr).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setTypeFilter('');
  };

  const handleEdit = async (noteId: number) => {
    const { success, data } = await getNoteById(noteId);
    if (success) {
      setSelectedNote(data);
      setIsEditModalOpen(true);
    }
  };

  const handleAddNote = () => {
    if (!companyId || !userId) {
      Alert.alert('Error', 'Missing user session data. Please login again.');
      return;
    }
    setSelectedNote(null);
    setIsAddModalOpen(true);
  };

  const handleAddRemark = (noteId: number) => {
    setSelectedNote({ id: noteId });
    setIsRemarkModalOpen(true);
  };

  const handleViewRemarks = async (noteId: number) => {
    const { success, data } = await getRemarksByNoteId(noteId);
    if (success) {
      setRemarks(data);
      setSelectedNote({ id: noteId });
      setIsViewRemarksModalOpen(true);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteNote(noteId);
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', `Failed to delete note: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      <NotesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleFilters={toggleFilters}
        onAddNote={handleAddNote}
        notesCount={notes.length}
        hasActiveFilters={!!(statusFilter || priorityFilter || typeFilter || searchTerm)}
        onClearFilters={clearFilters}
      />

      {showFilters && (
        <NotesFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          typeFilter={typeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onTypeChange={setTypeFilter}
          uniqueTypes={uniqueTypes}
          onClearFilters={clearFilters}
        />
      )}

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <NotesList
          notes={sortedNotes}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDeleteNote}
          onUpdateStatus={updateNoteStatus}
          onUpdatePriority={updateNotePriority}
          onAddRemark={handleAddRemark}
          onViewRemarks={handleViewRemarks}
        />
      </ScrollView>

      {/* MODALS */}
      <AddNoteModal
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreateNote={async (noteData) => {
          try {
            const result = await createNote(noteData);
            if (result.success) {
              Alert.alert('Success', 'Note created successfully');
              setIsAddModalOpen(false);
              handleRefresh();
            } else {
              Alert.alert('Error', `Failed to create note: ${result.error}`);
            }
          } catch (error: any) {
            Alert.alert('Error', `Failed to create note: ${error.message}`);
          }
        }}
        companyId={companyId}
        userId={userId}
        userRole={userRole}
      />

      <EditNoteModal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async (noteId, noteData) => {
          try {
            const result = await updateNote(noteId, noteData);
            if (result.success) {
              Alert.alert('Success', 'Note updated successfully');
              setIsEditModalOpen(false);
              handleRefresh();
            } else {
              Alert.alert('Error', `Failed to update note: ${result.error}`);
            }
          } catch (error: any) {
            Alert.alert('Error', `Failed to update note: ${error.message}`);
          }
        }}
        note={selectedNote}
      />

      <AddRemarkModal
        isVisible={isRemarkModalOpen}
        onClose={() => setIsRemarkModalOpen(false)}
        onAddRemark={async (noteId, remarkData) => {
          try {
            const result = await addRemarkToNote(noteId, remarkData);
            if (result.success) {
              Alert.alert('Success', 'Remark added successfully');
              setIsRemarkModalOpen(false);
              handleRefresh();
            } else {
              Alert.alert('Error', `Failed to add remark: ${result.error}`);
            }
          } catch (error: any) {
            Alert.alert('Error', `Failed to add remark: ${error.message}`);
          }
        }}
        noteId={selectedNote?.id}
        userId={userId}
      />

      <ViewRemarksModal
        isVisible={isViewRemarksModalOpen}
        onClose={() => setIsViewRemarksModalOpen(false)}
        remarks={remarks}
        noteId={selectedNote?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
});

export default NotesSection;
