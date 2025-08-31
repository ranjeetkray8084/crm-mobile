import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: number;
  content: string;
  typeStr?: string;
  status?: string;
  priority?: string;
  userId: number;
  [key: string]: any;
}

interface NoteActionMenuProps {
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

const NoteActionMenu: React.FC<NoteActionMenuProps> = ({
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
  // Add debugging to see what values we're getting
  console.log('NoteActionMenu Debug:', {
    noteId: note?.id,
    noteUserId: note?.userId,
    currentUserId,
    userRole,
    isOwner: currentUserId === note?.userId,
    canEdit: userRole === 'DIRECTOR' || userRole === 'ADMIN' || currentUserId === note?.userId,
    canDelete: userRole === 'DIRECTOR' || userRole === 'ADMIN' || currentUserId === note?.userId
  });

  const isOwner = currentUserId === note?.userId;
  const canEdit = userRole === 'DIRECTOR' || userRole === 'ADMIN' || isOwner;
  const canDelete = userRole === 'DIRECTOR' || userRole === 'ADMIN' || isOwner;

  const showActionMenu = () => {
    const actions = [
      { title: 'Add Remark', onPress: () => onAddRemark(note) },
      { title: 'View Remarks', onPress: () => onViewRemarks(note) },
      ...(canEdit ? [
        { title: 'Edit', onPress: () => onEdit(note.id) }
      ] : []),
      ...(canDelete ? [
        { title: 'Delete', onPress: () => handleDelete(), destructive: true }
      ] : [])
    ];

    console.log('NoteActionMenu: Available actions:', actions.map(a => a.title));

    Alert.alert(
      'Note Actions',
      'Choose an action',
      actions.map(action => ({
        text: action.title,
        onPress: action.onPress,
        style: action.destructive ? 'destructive' : 'default'
      }))
    );
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
    <TouchableOpacity onPress={showActionMenu} style={styles.menuButton}>
      <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});

export default NoteActionMenu;
