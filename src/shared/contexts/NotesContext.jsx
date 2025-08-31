import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    console.error('useNotesContext must be used within a NotesProvider');
    // Return a fallback context instead of throwing an error
    return {
      allNotes: [],
      notesLoading: false,
      notesError: null,
      updateNotesData: () => {},
      getTodayEvents: () => [],
      getSortedNotes: () => [],
      companyId: null,
      userId: null,
      role: null
    };
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const auth = useAuth();
  const [allNotes, setAllNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);

  // Safely extract user data with fallbacks
  const user = auth?.user || {};
  const companyId = user?.companyId;
  const userId = user?.userId || user?.id;
  const role = user?.role || 'USER';

  // Function to update notes data (called from useNotes hook)
  const updateNotesData = (notes, loading, error) => {
    try {
      setAllNotes(notes || []);
      setNotesLoading(loading);
      setNotesError(error);
    } catch (error) {
      console.error('Error updating notes data:', error);
    }
  };

  // Function to get today's events from the stored notes
  const getTodayEvents = () => {
    try {
      if (!allNotes || allNotes.length === 0) {
        return [];
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Store all notes with dateTime in an array
      const notesArray = [];
      
      allNotes.forEach((note) => {
        // Only include notes with dateTime and exclude completed/closed status
        if (note.dateTime && note.status !== 'CLOSED' && note.status !== 'COMPLETED') {
          try {
            const noteDate = new Date(note.dateTime).toISOString().split('T')[0];
            notesArray.push({
              ...note,
              noteDate,
              isToday: noteDate === today
            });
          } catch (dateError) {
            // Skip notes with invalid dateTime
            console.warn('Invalid dateTime for note:', note.id, note.dateTime);
          }
        }
      });

      // Sort the array: today's events first, then by date and time
      const sortedNotes = notesArray.sort((a, b) => {
        // First priority: today's events come first
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        
        // Second priority: sort by date and time
        try {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateA - dateB;
        } catch (error) {
          console.warn('Error sorting notes by date:', error);
          return 0;
        }
      });

      // Return only today's events for dashboard display
      const todayEvents = sortedNotes.filter(note => note.isToday);
      return todayEvents;
    } catch (error) {
      console.error('Error getting today events:', error);
      return [];
    }
  };

  // Function to get all sorted notes (today first, then by date)
  const getSortedNotes = () => {
    try {
      if (!allNotes || allNotes.length === 0) {
        return [];
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Store all notes with dateTime in an array
      const notesArray = [];
      
      allNotes.forEach((note) => {
        // Only include notes with dateTime and exclude completed/closed status
        if (note.dateTime && note.status !== 'CLOSED' && note.status !== 'COMPLETED') {
          try {
            const noteDate = new Date(note.dateTime).toISOString().split('T')[0];
            notesArray.push({
              ...note,
              noteDate,
              isToday: noteDate === today
            });
          } catch (dateError) {
            // Skip notes with invalid dateTime
            console.warn('Invalid dateTime for note:', note.id, note.dateTime);
          }
        }
      });

      // Sort the array: today's events first, then by date and time
      const sortedNotes = notesArray.sort((a, b) => {
        // First priority: today's events come first
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        
        // Second priority: sort by date and time
        try {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateA - dateB;
        } catch (error) {
          console.warn('Error sorting notes by date:', error);
          return 0;
        }
      });

      return sortedNotes;
    } catch (error) {
      console.error('Error getting sorted notes:', error);
      return [];
    }
  };

  const value = {
    allNotes,
    notesLoading,
    notesError,
    updateNotesData,
    getTodayEvents,
    getSortedNotes,
    companyId,
    userId,
    role
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
