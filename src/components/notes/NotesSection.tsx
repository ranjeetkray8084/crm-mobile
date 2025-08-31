import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl, Text } from 'react-native';
import { useNotes } from '../../core/hooks/useNotes';
import { useAuth } from '../../shared/contexts/AuthContext';
import NotesList from './NotesList';
import NotesToolbar from './NotesToolbar';
import NotesFilters from './NotesFilters';
import NotesPagination from './NotesPagination';
import AddNoteModal from './modals/AddNoteModal';
import EditNoteModal from './modals/EditNoteModal';
import AddRemarkModal from './modals/AddRemarkModal';
import ViewRemarksModal from './modals/ViewRemarksModal';

interface Note {
  id: number;
  content: string;
  typeStr?: string;
  status?: string;
  priority?: string;
  userId: number;
  [key: string]: any;
}

const NotesSection: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalElements: 0,
    size: 10
  });
  
  // Modal states
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Remark modal states - following the same pattern as leads and property
  const [remarkingNote, setRemarkingNote] = useState<Note | null>(null);
  const [viewingRemarksNote, setViewingRemarksNote] = useState<Note | null>(null);

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
    setCurrentPage(0); // Reset to first page on refresh
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Initial load
  useEffect(() => {
    if (companyId && userId) {
      loadNotes();
    }
  }, [companyId, userId, refreshKey]);

  // Update pagination when notes change
  useEffect(() => {
    if (notes && Array.isArray(notes)) {
      const totalElements = notes.length;
      const totalPages = Math.ceil(totalElements / pagination.size);
      setPagination(prev => ({
        ...prev,
        totalElements,
        totalPages: Math.max(1, totalPages)
      }));
    }
  }, [notes]);

  // Filter and search logic
  const filteredNotes = (notes as Note[]).filter((note: Note) => {
    const matchesSearch = searchTerm === '' ||
      (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.typeStr && note.typeStr.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === '' || note.status === statusFilter;
    const matchesPriority = priorityFilter === '' || note.priority === priorityFilter;
    const matchesType = typeFilter === '' || note.typeStr === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Status-based sorting logic: NEW -> PROCESSING -> COMPLETED
  const sortedNotes = [...filteredNotes].sort((a: Note, b: Note) => {
    const statusPriority: { [key: string]: number } = {
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

  // Paginate the sorted notes
  const paginatedNotes = sortedNotes.slice(
    currentPage * pagination.size,
    (currentPage + 1) * pagination.size
  );

  // Get unique types for filter dropdown
  const uniqueTypes = [...new Set((notes as Note[]).map(note => note.typeStr).filter((type): type is string => Boolean(type)))];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setTypeFilter('');
    setCurrentPage(0); // Reset to first page when filters change
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

  // Remark handlers - following the same pattern as leads and property
  const handleAddRemark = (note: Note) => {
    setRemarkingNote(note);
  };

  const handleConfirmAddRemark = async (remarkData: any) => {
    if (!remarkingNote) return;
    try {
      const noteId = remarkingNote.id;
      const result = await addRemarkToNote(noteId, remarkData);
      if (result.success) {
        Alert.alert('Success', 'Remark added successfully');
      } else {
        Alert.alert('Error', `Failed to add remark: ${result.error}`);
      }
      setRemarkingNote(null);
      handleRefresh();
    } catch (error: any) {
      Alert.alert('Error', `Failed to add remark: ${error.message}`);
      setRemarkingNote(null);
    }
  };

  const handleViewRemarks = (note: Note) => {
    console.log('NotesSection: handleViewRemarks called for note:', note.id);
    setViewingRemarksNote(note);
  };

  // Memoize the onGetRemarks function to prevent unnecessary re-renders
  const handleGetRemarks = useCallback(async (noteId: number) => {
    console.log('NotesSection: handleGetRemarks called for noteId:', noteId);
    try {
      console.log('NotesSection: Calling getRemarksByNoteId for noteId:', noteId);
      const result = await getRemarksByNoteId(noteId);
      console.log('NotesSection: getRemarksByNoteId result:', result);
      
      if (result.success) {
        console.log('NotesSection: Success, returning data:', result.data);
        return { success: true, data: result.data };
      } else {
        console.log('NotesSection: Error from getRemarksByNoteId:', result.error);
        return { success: false, error: result.error || 'Failed to load remarks' };
      }
    } catch (error) {
      console.error('NotesSection: Exception in onGetRemarks:', error);
      return { success: false, error: 'Failed to load remarks' };
    }
  }, [getRemarksByNoteId]);

  console.log('NotesSection: handleGetRemarks function recreated, getRemarksByNoteId changed:', !!getRemarksByNoteId);
  console.log('NotesSection: viewingRemarksNote state:', viewingRemarksNote?.id);

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

  const handleStatusUpdate = async (noteId: number, status: string) => {
    try {
      await updateNoteStatus(noteId, status);
      handleRefresh();
      Alert.alert('Success', 'Status updated successfully');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update status: ${error.message}`);
    }
  };

  const handlePriorityUpdate = async (noteId: number, priority: string) => {
    try {
      await updateNotePriority(noteId, priority);
      handleRefresh();
      Alert.alert('Success', 'Priority updated successfully');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update priority: ${error.message}`);
    }
  };

  const handleShare = (note: Note) => {
    Alert.alert('Share', `Share functionality for ${note.typeStr} would be implemented here`);
  };

  const handleDuplicate = (note: Note) => {
    Alert.alert('Duplicate', `Duplicate functionality for ${note.typeStr} would be implemented here`);
  };

  const handleArchive = (note: Note) => {
    Alert.alert('Archive', `Archive functionality for ${note.typeStr} would be implemented here`);
  };

  const handlePin = (note: Note) => {
    Alert.alert('Pin', `Pin functionality for ${note.typeStr} would be implemented here`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <NotesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNote={handleAddNote}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
        notesCount={pagination.totalElements}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        pageSize={pagination.size}
      />

      {/* Filters */}
      {showFilters && (
        <NotesFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onTypeFilterChange={setTypeFilter}
          onClearFilters={clearFilters}
          uniqueTypes={uniqueTypes}
        />
      )}

      {/* Notes List */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text>Loading notes...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}



      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <NotesList
          notes={paginatedNotes}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDeleteNote}
          onUpdateStatus={updateNoteStatus}
          onUpdatePriority={updateNotePriority}
          onAddRemark={handleAddRemark}
          onViewRemarks={handleViewRemarks}
          userRole={userRole}
          currentUserId={userId}
        />
        <NotesPagination
          currentPage={currentPage}
          pagination={pagination}
          onPageChange={handlePageChange}
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

      {/* Remark Modals - following the same pattern as leads and property */}
      <AddRemarkModal
        isVisible={!!remarkingNote}
        onClose={() => setRemarkingNote(null)}
        onAddRemark={handleConfirmAddRemark}
        note={remarkingNote || {} as Note}
      />

      {viewingRemarksNote && (
        <ViewRemarksModal
          key={`remarks-modal-${viewingRemarksNote.id}`}
          isVisible={!!viewingRemarksNote}
          onClose={() => {
            console.log('NotesSection: ViewRemarksModal closing for note:', viewingRemarksNote.id);
            setViewingRemarksNote(null);
          }}
          note={viewingRemarksNote}
          onGetRemarks={handleGetRemarks}
        />
      )}

      {/* Note Details Modal - Removed since we're removing view details functionality */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default NotesSection;
