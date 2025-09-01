import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Pressable,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../core/hooks/useTasks';
import { useAuth } from '../../shared/contexts/AuthContext';

interface TaskPreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  taskId: string;
  companyId: string;
}

const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({
  isVisible,
  onClose,
  taskId,
  companyId
}) => {
  const { user } = useAuth();
  const userId = user?.userId || user?.id;
  const role = user?.role;
  const {
    updateCell,
    addNewRow,
    addNewColumn,
    deleteSelectedColumns,
    undoLastAction,
    previewExcel
  } = useTasks(companyId, userId, role);

  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible && taskId && companyId) {
      loadPreviewData();
    }
  }, [isVisible, taskId, companyId]);

  const loadPreviewData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Loading preview data for taskId:', taskId);
      const result = await previewExcel(taskId);
      if (result.success) {
        console.log('✅ Preview data loaded successfully:', result.data?.length || 0, 'rows');
        setData(result.data || []);
      } else {
        console.error('❌ Failed to load preview:', result.error);
        setError(result.error || 'Failed to load preview');
      }
    } catch (err) {
      console.error('❌ Error loading preview data:', err);
      setError('Failed to load preview data');
    } finally {
      setLoading(false);
    }
  };

  const getColumnLetter = (colIndex: number): string => {
    let letter = '';
    let tempIndex = colIndex;
    while (tempIndex >= 0) {
      letter = String.fromCharCode(65 + (tempIndex % 26)) + letter;
      tempIndex = Math.floor(tempIndex / 26) - 1;
    }
    return letter;
  };

  // Phone number detection and calling functionality
  const isPhoneNumber = (text: string): boolean => {
    if (!text) return false;
    // Remove spaces, dashes, parentheses, and plus signs for validation
    const cleanText = text.replace(/[\s\-\(\)\+]/g, '');
    // Check if it's a valid phone number (7-15 digits)
    return /^\d{7,15}$/.test(cleanText);
  };

  const formatPhoneNumber = (text: string): string => {
    if (!text) return '';
    // Remove all non-digit characters except +
    const cleanText = text.replace(/[^\d\+]/g, '');
    // If it doesn't start with +, add country code (assume India +91)
    if (!cleanText.startsWith('+')) {
      return `+91${cleanText}`;
    }
    return cleanText;
  };

  const handlePhoneCall = (phoneNumber: string) => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    Alert.alert(
      'Make Phone Call',
      `Do you want to call ${formattedNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${formattedNumber}`).catch(err => {
              console.error('❌ Error making call:', err);
              Alert.alert('Error', 'Unable to make call. Please try again.');
            });
          }
        }
      ]
    );
  };

  const handleCellPress = (rowIndex: number, colIndex: number, cellValue: string) => {
    // Check if the cell contains a phone number
    if (isPhoneNumber(cellValue)) {
      handlePhoneCall(cellValue);
    } else {
      // If not a phone number, start editing
      startEditing(rowIndex, colIndex, cellValue);
    }
  };

  const getCellTextStyle = (cellValue: string) => {
    if (isPhoneNumber(cellValue)) {
      return [styles.cellText, styles.phoneNumberText];
    }
    return styles.cellText;
  };

    const handleCellUpdate = useCallback(async (rowIndex: number, colIndex: number, newValue: string) => {
    console.log('🔄 Updating cell [', rowIndex, ',', colIndex, '] from:', data[rowIndex]?.[colIndex], 'to:', newValue);
    
    const oldValue = data[rowIndex]?.[colIndex] || '';
    
    // If no change, skip update
    if (oldValue === newValue) {
      console.log('⏭️ No change in value, skipping update');
      return;
    }
    
    // Add to undo stack
    setUndoStack(prev => [...prev, { 
      type: 'update', 
      row: rowIndex, 
      col: colIndex, 
      oldValue, 
      newValue 
    }]);

    // Update only the specific cell in local data immediately
    setData(prevData => {
      const newData = [...prevData];
      
      // Handle empty data case - create rows if needed
      if (newData.length === 0) {
        console.log('📄 Creating initial data structure');
        const maxCols = Math.max(colIndex + 1, 5);
        newData.push(Array(maxCols).fill(''));
      }
      
      // Ensure row exists
      if (!newData[rowIndex]) {
        const maxCols = newData.length > 0 ? Math.max(...newData.map(row => row.length)) : 5;
        newData[rowIndex] = Array(Math.max(maxCols, colIndex + 1)).fill('');
      }
      
      // Ensure column exists in row
      while (newData[rowIndex].length <= colIndex) {
        newData[rowIndex].push('');
      }
      
      // Update only the specific cell
      newData[rowIndex][colIndex] = newValue;
      console.log('✅ Cell updated locally:', newData[rowIndex][colIndex]);
      
      return newData;
    });

    // Update on server in background (non-blocking)
    setTimeout(async () => {
      try {
        console.log('🌐 Sending update to server...');
        const result = await updateCell(taskId, rowIndex, colIndex, newValue);
        if (result.success) {
          console.log('✅ Cell updated successfully on server');
          // Clear any previous errors
          if (error) setError('');
          showSuccessMessage('Cell updated successfully');
        } else {
          console.error('❌ Failed to update cell on server:', result.error);
          // Revert on failure - only the specific cell
          setData(prevData => {
            const revertedData = [...prevData];
            if (revertedData[rowIndex]) {
              revertedData[rowIndex][colIndex] = oldValue;
              console.log('🔄 Reverted cell to old value:', oldValue);
            }
            return revertedData;
          });
          setError(result.error || 'Failed to update cell');
        }
      } catch (err) {
        console.error('❌ Error updating cell on server:', err);
        // Revert on error - only the specific cell
        setData(prevData => {
          const revertedData = [...prevData];
          if (revertedData[rowIndex]) {
            revertedData[rowIndex][colIndex] = oldValue;
            console.log('🔄 Reverted cell to old value due to error:', oldValue);
          }
          return revertedData;
        });
        setError('Failed to update cell');
      }
    }, 0);
  }, [data, taskId, updateCell, error]);

  const handleAddRow = async () => {
    try {
      console.log('🔄 Adding new row - Current data:', data.length, 'rows');
      
      // Calculate max columns from existing data, ensure minimum of 5
      const maxCols = data.length > 0 ? Math.max(...data.map(row => row.length), 5) : 5;
      console.log('📊 Max columns calculated:', maxCols);
      
      // Create new empty row
      const newRow = Array(maxCols).fill('');
      console.log('➕ New row created:', newRow);
      
      // Add to data
      setData(prev => {
        const updated = [...prev, newRow];
        console.log('✅ Data updated - New total rows:', updated.length);
        return updated;
      });
      
      // Clear any existing errors
      if (error) setError('');
      
      showSuccessMessage('New row added successfully');
      
      // Optional: Backend API call (disabled for now, same as crm-frontend)
      // Uncomment if backend endpoint is available
      /*
      const result = await addNewRow(taskId);
      if (!result.success) {
        // Revert on failure
        setData(prev => prev.slice(0, -1));
        setError(result.error || 'Failed to add row to backend');
      }
      */
    } catch (err) {
      console.error('❌ Error adding row:', err);
      setError('Failed to add row: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleAddColumn = async () => {
    try {
      console.log('🔄 Adding new column - Current data:', data.length, 'rows');
      
      // Add empty column to all existing rows
      let newData = data.map((row, index) => {
        const newRow = [...row, ''];
        console.log(`📝 Row ${index} updated:`, newRow.length, 'columns');
        return newRow;
      });
      
      // If no data exists, create first row with empty column
      if (newData.length === 0) {
        console.log('📄 No data exists, creating first row with 5 columns');
        newData.push(Array(5).fill(''));
      }
      
      console.log('✅ New data structure:', newData.length, 'rows with', newData[0]?.length || 0, 'columns');
      
      setData(newData);
      
      // Clear any existing errors
      if (error) setError('');
      
      showSuccessMessage('New column added successfully');
      
      // Optional: Backend API call (disabled for now, same as crm-frontend)
      // Uncomment if backend endpoint is available
      /*
      const result = await addNewColumn(taskId);
      if (!result.success) {
        // Revert on failure - remove the added column
        const revertedData = data.map(row => row.slice(0, -1));
        setData(revertedData);
        setError(result.error || 'Failed to add column to backend');
      }
      */
    } catch (err) {
      console.error('❌ Error adding column:', err);
      setError('Failed to add column: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteColumns = async () => {
    if (selectedColumns.size === 0) {
      setError('Please select columns to delete');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedColumns.size} column(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const columnIndices = Array.from(selectedColumns).sort((a, b) => b - a);
            
            try {
              const result = await deleteSelectedColumns(taskId, columnIndices);
              if (result.success) {
                // Remove columns from local data
                const newData = data.map(row => {
                  const newRow = [...row];
                  columnIndices.forEach(colIndex => {
                    newRow.splice(colIndex, 1);
                  });
                  return newRow;
                });
                        setData(newData);
        setSelectedColumns(new Set());
        showSuccessMessage(`${columnIndices.length} column(s) deleted successfully`);
      } else {
                setError(result.error || 'Failed to delete columns');
              }
            } catch (err) {
              setError('Failed to delete columns');
            }
          }
        }
      ]
    );
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));

    if (lastAction.type === 'update') {
      const newData = [...data];
      newData[lastAction.row][lastAction.col] = lastAction.oldValue;
      setData(newData);
    }
  };

  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Auto-hide after 3 seconds
  }, []);

  const handleColumnSelect = useCallback((colIndex: number) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(colIndex)) {
      newSelected.delete(colIndex);
    } else {
      newSelected.add(colIndex);
    }
    setSelectedColumns(newSelected);
  }, [selectedColumns]);

  const startEditing = useCallback((rowIndex: number, colIndex: number, value: string) => {
    console.log('🔄 Starting edit for cell [', rowIndex, ',', colIndex, '] with value:', value);
    // Use requestAnimationFrame for immediate UI update
    requestAnimationFrame(() => {
      setEditingCell({ row: rowIndex, col: colIndex });
      setEditValue(value || '');
    });
  }, []);

  const finishEditing = useCallback(() => {
    if (editingCell) {
      console.log('✅ Finishing edit for cell [', editingCell.row, ',', editingCell.col, '] with value:', editValue);
      handleCellUpdate(editingCell.row, editingCell.col, editValue);
      // Use requestAnimationFrame for immediate UI update
      requestAnimationFrame(() => {
        setEditingCell(null);
        setEditValue('');
      });
    }
  }, [editingCell, editValue]);

  const finishEditingAndMoveNext = useCallback(() => {
    if (editingCell) {
      console.log('✅ Finishing edit and moving to next row');
      handleCellUpdate(editingCell.row, editingCell.col, editValue);
      
      // Move to next row, same column
      const nextRow = editingCell.row + 1;
      const currentCol = editingCell.col;
      
      // Use requestAnimationFrame for immediate UI update
      requestAnimationFrame(() => {
        // Clear current editing
        setEditingCell(null);
        setEditValue('');
        
        // If next row doesn't exist, create it immediately
        if (nextRow >= data.length) {
          console.log('📝 Creating new row for navigation');
          const maxCols = data.length > 0 ? Math.max(...data.map(row => row.length), 5) : 5;
          const newRow = Array(maxCols).fill('');
          setData(prev => [...prev, newRow]);
        }
        
        // Start editing next cell immediately in next frame
        requestAnimationFrame(() => {
          setEditingCell({ row: nextRow, col: currentCol });
          setEditValue('');
        });
      });
    }
  }, [editingCell, editValue, data.length]);

  const cancelEditing = useCallback(() => {
    console.log('❌ Canceling edit');
    setEditingCell(null);
    setEditValue('');
  }, []);

  const maxCols = useMemo(() => {
    return data.length > 0 ? Math.max(...data.map(row => row.length)) : 0;
  }, [data]);
  
  // Debug logging
  console.log('🔍 TaskPreviewModal render - Data:', data.length, 'rows, MaxCols:', maxCols);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Excel Editor</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={handleAddRow} style={styles.toolbarButton}>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.toolbarButtonText}>Add Row</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleAddColumn} style={styles.toolbarButton}>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.toolbarButtonText}>Add Column</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDeleteColumns} 
              disabled={selectedColumns.size === 0}
              style={[styles.toolbarButton, styles.deleteButton, selectedColumns.size === 0 && styles.disabledButton]}
            >
              <Ionicons name="trash" size={16} color="white" />
              <Text style={styles.toolbarButtonText}>
                Delete ({selectedColumns.size})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleUndo} 
              disabled={undoStack.length === 0}
              style={[styles.toolbarButton, styles.undoButton, undoStack.length === 0 && styles.disabledButton]}
            >
              <Ionicons name="arrow-undo" size={16} color="white" />
              <Text style={styles.toolbarButtonText}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={loadPreviewData}
              style={[styles.toolbarButton, styles.refreshButton]}
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text style={styles.toolbarButtonText}>Refresh</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')} style={styles.errorCloseButton}>
              <Ionicons name="close" size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Success Message */}
        {successMessage ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tableContainer}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.table}>
                  {/* Header Row */}
                  <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.rowHeaderCell]}>
                      <Text style={styles.headerText}>S.No</Text>
                    </View>
                    {Array.from({ length: maxCols }, (_, colIndex) => (
                      <TouchableOpacity
                        key={`header-${colIndex}`}
                        style={[
                          styles.headerCell,
                          selectedColumns.has(colIndex) && styles.selectedHeaderCell
                        ]}
                        onPress={() => handleColumnSelect(colIndex)}
                      >
                        <Text style={styles.headerText}>
                          {data[0]?.[colIndex] || getColumnLetter(colIndex)}
                        </Text>
                        <View style={styles.checkboxContainer}>
                          <View style={[
                            styles.checkbox,
                            selectedColumns.has(colIndex) && styles.checkboxSelected
                          ]}>
                            {selectedColumns.has(colIndex) && (
                              <Ionicons name="checkmark" size={12} color="white" />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Data Rows */}
                  {data.length === 0 ? (
                    // Show empty state
                    <View style={styles.tableRow}>
                      <View style={[styles.cell, styles.rowHeaderCell]}>
                        <Text style={styles.rowHeaderText}>1</Text>
                      </View>
                      {Array.from({ length: Math.max(maxCols, 5) }, (_, colIndex) => (
                        <View key={`empty-cell-${colIndex}`} style={styles.cell}>
                                                     {editingCell?.row === 0 && editingCell?.col === colIndex ? (
                             <TextInput
                               value={editValue}
                               onChangeText={setEditValue}
                               onBlur={finishEditing}
                               onSubmitEditing={finishEditingAndMoveNext}
                               style={styles.cellInput}
                               autoFocus={true}
                               multiline={false}
                               selectTextOnFocus={true}
                               blurOnSubmit={false}
                               returnKeyType="next"
                               keyboardType="default"
                               autoCapitalize="none"
                               autoCorrect={false}
                               spellCheck={false}
                               maxLength={1000}
                               contextMenuHidden={true}
                             />
                                                     ) : (
                                                          <Pressable
                                style={({ pressed }) => [
                                  styles.cellContent,
                                  pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => handleCellPress(0, colIndex, '')}
                                android_ripple={{ color: '#e5e7eb', borderless: true }}
                              >
                                <Text style={getCellTextStyle('')} numberOfLines={3}>
                                  
                                </Text>
                              </Pressable>
                           )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    data.map((row, rowIndex) => {
                      // Skip first row if it's used as header
                      const isHeaderRow = rowIndex === 0 && data[0]?.some(cell => cell !== null && cell !== '');
                      if (isHeaderRow) return null;

                      return (
                        <View key={`row-${rowIndex}`} style={styles.tableRow}>
                          <View style={[styles.cell, styles.rowHeaderCell]}>
                            <Text style={styles.rowHeaderText}>
                              {isHeaderRow ? rowIndex : rowIndex + 1}
                            </Text>
                          </View>
                          {Array.from({ length: maxCols }, (_, colIndex) => (
                            <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cell}>
                                                           {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                               <TextInput
                                 value={editValue}
                                 onChangeText={setEditValue}
                                 onBlur={finishEditing}
                                 onSubmitEditing={finishEditingAndMoveNext}
                                 style={styles.cellInput}
                                 autoFocus={true}
                                 multiline={false}
                                 selectTextOnFocus={true}
                                 blurOnSubmit={false}
                                 returnKeyType="next"
                                 keyboardType="default"
                                 autoCapitalize="none"
                                 autoCorrect={false}
                                 spellCheck={false}
                                 maxLength={1000}
                                 contextMenuHidden={true}
                               />
                                                             ) : (
                                                                <Pressable
                                  style={({ pressed }) => [
                                    styles.cellContent,
                                    pressed && { opacity: 0.7 }
                                  ]}
                                  onPress={() => handleCellPress(rowIndex, colIndex, row[colIndex] || '')}
                                  android_ripple={{ color: '#e5e7eb', borderless: true }}
                                >
                                                                       <Text style={getCellTextStyle(row[colIndex] || '')} numberOfLines={3}>
                                      {row[colIndex] || ''}
                                    </Text>
                                   </Pressable>
                               )}
                            </View>
                          ))}
                        </View>
                      );
                    })
                  )}
                </View>
              </ScrollView>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  toolbar: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  toolbarButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  undoButton: {
    backgroundColor: '#6b7280',
  },
  refreshButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    padding: 12,
    margin: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  errorCloseButton: {
    padding: 4,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    margin: 16,
    gap: 8,
  },
  successText: {
    color: '#10b981',
    fontSize: 14,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    minWidth: Math.max(width, 600),
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    width: 120,
    minHeight: 50,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedHeaderCell: {
    backgroundColor: '#dbeafe',
  },
  rowHeaderCell: {
    width: 80,
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  checkboxContainer: {
    marginTop: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  cell: {
    width: 120,
    minHeight: 50,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  cellContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  cellInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    minHeight: 0,
    paddingVertical: 4,
  },
  cellText: {
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  phoneNumberText: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  rowHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default TaskPreviewModal;
