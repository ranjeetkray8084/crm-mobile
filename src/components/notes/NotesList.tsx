import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import NoteCard from './NoteCard';

interface NotesListProps {
  notes: any[];
  loading: boolean;
  error: string | null;
  onEdit: (noteId: number) => void;
  onDelete: (noteId: number) => void;
  onUpdateStatus: (noteId: number, status: string) => void;
  onUpdatePriority: (noteId: number, priority: string) => void;
  onAddRemark: (noteId: number) => void;
  onViewRemarks: (noteId: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  loading,
  error,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePriority,
  onAddRemark,
  onViewRemarks,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c69ff" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Notes Found</Text>
        <Text style={styles.emptySubtitle}>
          {notes.length === 0 ? 'Create your first note to get started' : 'No notes match your current filters'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onUpdatePriority={onUpdatePriority}
          onAddRemark={onAddRemark}
          onViewRemarks={onViewRemarks}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotesList;
