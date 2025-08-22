// Notes Context for Mobile CRM App
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, userId } = useAuth();

  // Load notes when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [isAuthenticated, userId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await NotesService.getAllNotes();
      // setNotes(response.data || []);
      
      // Temporary mock data
      setNotes([]);
      
    } catch (error) {
      console.error('Error loading notes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData) => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await NotesService.createNote(noteData);
      // const newNote = response.data;
      
      // Temporary mock implementation
      const newNote = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId
      };
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
      
      return { success: true, note: newNote };
    } catch (error) {
      console.error('Error adding note:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateNote = async (noteId, updatedData) => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await NotesService.updateNote(noteId, updatedData);
      // const updatedNote = response.data;
      
      // Temporary mock implementation
      const updatedNote = {
        ...notes.find(note => note.id === noteId),
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      );
      
      return { success: true, note: updatedNote };
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await NotesService.deleteNote(noteId);
      
      setNotes(prevNotes => 
        prevNotes.filter(note => note.id !== noteId)
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const getNoteById = (noteId) => {
    return notes.find(note => note.id === noteId);
  };

  const getNotesByType = (type) => {
    return notes.filter(note => note.type === type);
  };

  const searchNotes = (query) => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title?.toLowerCase().includes(lowercaseQuery) ||
      note.content?.toLowerCase().includes(lowercaseQuery) ||
      note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const value = {
    notes,
    loading,
    error,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByType,
    searchNotes,
    // Helper getters
    get notesCount() {
      return notes.length;
    },
    get recentNotes() {
      return notes.slice(0, 10);
    }
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
