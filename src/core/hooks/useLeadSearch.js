import React, { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Enhanced Lead Search Hook with Multi-Key Search Capabilities
 * 
 * This hook provides comprehensive search functionality for leads across multiple fields:
 * - Lead Name
 * - Phone Number
 * - Email Address
 * - Location
 * - Reference Name
 * - Requirement/Description
 * - Source (Instagram, Facebook, YouTube, Reference)
 * - Status (NEW, CONTACTED, CLOSED, DROPED)
 * - Action (ASSIGNED, UNASSIGNED, NEW)
 * - Budget Amount
 * - Created By User Name
 * - Assigned To User Name
 * 
 * Features:
 * - Tag-based search for complex queries
 * - Auto-search with debouncing
 * - Filter combinations
 * - Search history and active state management
 */
export const useLeadSearch = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    budget: "",
    source: "",
    assignedTo: "",
    createdBy: "",
    dateRange: ""
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeSearchParams, setActiveSearchParams] = useState(null);

  // Memoized search parameters
  const searchParams = useMemo(() => {
    const params = {};

    // Add search tags and current search term as combined query
    const allSearchTerms = [...searchTags];
    if (searchTerm.trim()) {
      allSearchTerms.push(searchTerm.trim());
    }

    if (allSearchTerms.length > 0) {
      params.search = allSearchTerms.join(' ');
    }

    // Add filters if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        // Map frontend filter names to backend parameter names
        switch(key) {
          case 'assignedTo':
            params.assignedTo = value.trim();
            break;
          case 'createdBy':
            params.createdBy = value.trim();
            break;
          case 'status':
            params.status = value.trim();
            break;
          case 'source':
            params.source = value.trim();
            break;
          case 'budget':
            params.budget = value.trim();
            break;

          case 'dateRange':
            params.dateRange = value.trim();
            break;
          default:
            params[key] = value.trim();
        }
      }
    });

    console.log('🔍 searchParams calculated:', {
      searchTerm,
      searchTags,
      filters,
      result: params
    });

    return params;
  }, [searchTerm, searchTags, filters]);

  // Check if any search/filter is active
  const hasActiveFilters = useMemo(() => {
    const hasSearch = searchTerm.trim();
    const hasTags = searchTags.length > 0;
    const hasFilterValues = Object.values(filters).some(value => value && value.trim());
    
    console.log('🔍 hasActiveFilters calculation:', {
      searchTerm: searchTerm,
      searchTermTrimmed: searchTerm.trim(),
      hasSearch,
      hasTags,
      hasFilterValues,
      result: hasSearch || hasTags || hasFilterValues
    });
    
    return hasSearch || hasTags || hasFilterValues;
  }, [searchTerm, searchTags, filters]);

  // Update individual filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Clear all filters and search
  const clearAll = useCallback(() => {
    setSearchTerm("");
    setSearchTags([]);
    setFilters({
      status: "",
      budget: "",
      source: "",
      assignedTo: "",
      createdBy: "",
      dateRange: ""
    });
    setIsSearchActive(false);
    setActiveSearchParams(null);
  }, []);

  // Clear only search term
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchTags([]);
  }, []);

  // Add search tag
  const addSearchTag = useCallback((tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !searchTags.includes(trimmedTag)) {
      setSearchTags(prev => [...prev, trimmedTag]);
      setSearchTerm(""); // Clear input after adding tag
    }
  }, [searchTags]);

  // Remove search tag
  const removeSearchTag = useCallback((tagToRemove) => {
    setSearchTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  // Handle Enter key to add tag
  const handleSearchEnter = useCallback(() => {
    if (searchTerm.trim()) {
      addSearchTag(searchTerm);
    }
  }, [searchTerm, addSearchTag]);

  // Clear only filters
  const clearFilters = useCallback(() => {
    setFilters({
      status: "",
      budget: "",
      source: "",
      assignedTo: "",
      createdBy: "",
      dateRange: ""
    });
  }, []);

  // Apply search/filters
  const applySearch = useCallback(() => {
    console.log('🔍 applySearch called:', {
      hasActiveFilters,
      searchParams,
      searchTerm,
      searchTags: searchTags.length,
      filters
    });
    
    if (hasActiveFilters) {
      console.log('🔍 Setting search active with params:', searchParams);
      setActiveSearchParams(searchParams);
      setIsSearchActive(true);
    } else {
      console.log('🔍 Clearing search');
      setActiveSearchParams(null);
      setIsSearchActive(false);
    }
  }, [hasActiveFilters, searchParams, searchTerm, searchTags, filters]);

  // Auto-apply search when parameters change (debounced effect can be added)
  const autoApplySearch = useCallback(() => {
    const timeoutId = setTimeout(() => {
      applySearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [applySearch]);

  // Auto-apply search when search term changes
  useEffect(() => {
    if (searchTerm.trim() || searchTags.length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('🔍 Auto-applying search due to search term change:', { searchTerm, searchTags });
        applySearch();
      }, 300); // 300ms debounce for search term changes
      
      return () => clearTimeout(timeoutId);
    } else {
      // Clear search when no search terms
      console.log('🔍 Clearing search due to no search terms');
      setActiveSearchParams(null);
      setIsSearchActive(false);
    }
  }, [searchTerm, searchTags, applySearch]);

  // Auto-apply search when filters change
  useEffect(() => {
    const hasFilterValues = Object.values(filters).some(value => value && value.trim());
    if (hasFilterValues) {
      const timeoutId = setTimeout(() => {
        console.log('🔍 Auto-applying search due to filter change:', filters);
        applySearch();
      }, 300); // 300ms debounce for filter changes
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters, applySearch]);

  // Apply quick filters
  const applyQuickFilters = useCallback((quickFilters) => {
    // Apply new filters without clearing existing ones
    setFilters(prev => ({
      ...prev,
      ...quickFilters
    }));

    // Apply search immediately with new filters
    const newParams = { ...quickFilters };
    setActiveSearchParams(newParams);
    setIsSearchActive(true);

    console.log('🔍 Quick filters applied:', newParams);

    return newParams;
  }, []);

  // Get budget range display text
  const getBudgetRangeText = useCallback((budgetValue) => {
    const budgetRanges = {
      "0-500000": "Below ₹5 Lakh",
      "500000-1000000": "₹5-10 Lakh",
      "1000000-2000000": "₹10-20 Lakh",
      "2000000-5000000": "₹20-50 Lakh",
      "5000000-10000000": "₹50L-1 Crore",
      "10000000-99999999": "Above ₹1 Crore"
    };
    return budgetRanges[budgetValue] || budgetValue;
  }, []);

  // Get active filters summary for display
  const getActiveFiltersSummary = useCallback(() => {
    const activeFilters = [];
    
    if (searchTags.length > 0) {
      activeFilters.push(`Search: ${searchTags.join(', ')}`);
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        switch(key) {
          case 'budget':
            activeFilters.push(`Budget: ${getBudgetRangeText(value)}`);
            break;
          case 'status':
            activeFilters.push(`Status: ${value}`);
            break;
          case 'source':
            activeFilters.push(`Source: ${value}`);
            break;
          case 'assignedTo':
            activeFilters.push(`Assigned: ${value}`);
            break;
          case 'createdBy':
            activeFilters.push(`Created By: ${value}`);
            break;
          default:
            activeFilters.push(`${key}: ${value}`);
        }
      }
    });
    
    return activeFilters;
  }, [searchTags, filters, getBudgetRangeText]);

  return {
    // State
    searchTerm,
    searchTags,
    filters,
    isSearchActive,
    activeSearchParams,
    hasActiveFilters,
    searchParams,
    
    // Actions
    setSearchTerm,
    addSearchTag,
    removeSearchTag,
    handleSearchEnter,
    updateFilter,
    updateFilters,
    clearAll,
    clearSearch,
    clearFilters,
    applySearch,
    autoApplySearch,
    applyQuickFilters,
    
    // Utilities
    getActiveFiltersSummary,
    getBudgetRangeText,
    
    // Missing functions that were causing the error
    setActiveSearchParams,
    setIsSearchActive
  };
};