import { useState, useCallback } from 'react';

/**
 * Hook to manage navigation history and provide redirect functionality
 * This helps forms redirect back to where they came from when cancelled
 * Mobile version adapted from web implementation
 */
export const useNavigationHistory = (initialSection = 'dashboard') => {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [previousSection, setPreviousSection] = useState(null);
  const [sectionHistory, setSectionHistory] = useState([initialSection]);

  const navigateToSection = useCallback((newSection) => {
    if (newSection !== currentSection) {
      console.log(`🚀 Mobile Navigation: ${currentSection} -> ${newSection}`);
      console.log(`📚 Previous section set to: ${currentSection}`);
      console.log(`📚 Current section set to: ${newSection}`);
      
      setPreviousSection(currentSection);
      setCurrentSection(newSection);
      setSectionHistory(prev => {
        const newHistory = [...prev, newSection];
        console.log(`📚 History updated:`, newHistory);
        return newHistory;
      });
    } else {
      console.log(`⚠️ Navigation skipped: Already at ${newSection}`);
    }
  }, [currentSection]);

  const goBack = useCallback(() => {
    console.log(`🔄 goBack called`);
    console.log(`📚 Current section: ${currentSection}`);
    console.log(`📚 Previous section: ${previousSection}`);
    console.log(`📚 Full history:`, sectionHistory);
    
    if (previousSection && previousSection !== currentSection) {
      console.log(`✅ Going back to: ${previousSection}`);
      
      // Find the index of the previous section in history
      const previousIndex = sectionHistory.indexOf(previousSection);
      const newPreviousSection = previousIndex > 0 ? sectionHistory[previousIndex - 1] : 'dashboard';
      
      console.log(`📚 New previous section will be: ${newPreviousSection}`);
      
      setCurrentSection(previousSection);
      setPreviousSection(newPreviousSection);
      
      // Update history by removing the current section
      setSectionHistory(prev => {
        const newHistory = prev.slice(0, -1);
        console.log(`📚 History updated after goBack:`, newHistory);
        return newHistory;
      });
    } else {
      // Fallback to dashboard if no previous section or if we're already there
      console.log(`⚠️ No previous section or already at previous, going to dashboard`);
      setCurrentSection('dashboard');
      setPreviousSection(null);
      setSectionHistory(['dashboard']);
    }
  }, [previousSection, currentSection, sectionHistory]);

  const goToSection = useCallback((section) => {
    navigateToSection(section);
  }, [navigateToSection]);

  const resetToSection = useCallback((section) => {
    console.log(`🔄 resetToSection called with: ${section}`);
    setCurrentSection(section);
    setPreviousSection(null);
    setSectionHistory([section]);
  }, []);

  return {
    currentSection,
    previousSection,
    sectionHistory,
    navigateToSection,
    goBack,
    goToSection,
    resetToSection
  };
};
