import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions
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

  const handleCellUpdate = async (rowIndex: number, colIndex: number, newValue: string) => {
    const oldValue = data[rowIndex]?.[colIndex] || '';
    
    // Add to undo stack
    setUndoStack(prev => [...prev, { 
      type: 'update', 
      row: rowIndex, 
      col: colIndex, 
      oldValue, 
      newValue 
    }]);

    // Update local data immediately
    const newData = [...data];
    if (!newData[rowIndex]) {
      newData[rowIndex] = [];
    }
    newData[rowIndex][colIndex] = newValue;
    setData(newData);

    // Update on server
    try {
      console.log('🔄 Updating cell [', rowIndex, ',', colIndex, '] to:', newValue);
      const result = await updateCell(taskId, rowIndex, colIndex, newValue);
      if (result.success) {
        console.log('✅ Cell updated successfully');
        // Clear any previous errors
        if (error) setError('');
        showSuccessMessage('Cell updated successfully');
      } else {
        console.error('❌ Failed to update cell:', result.error);
        // Revert on failure
        const revertedData = [...data];
        revertedData[rowIndex][colIndex] = oldValue;
        setData(revertedData);
        setError(result.error || 'Failed to update cell');
      }
    } catch (err) {
      console.error('❌ Error updating cell:', err);
      // Revert on error
      const revertedData = [...data];
      revertedData[rowIndex][colIndex] = oldValue;
      setData(revertedData);
      setError('Failed to update cell');
    }
  };

  const handleAddRow = async () => {
    try {
      const result = await addNewRow(taskId);
      if (result.success) {
        // Add empty row to local data
        const maxCols = data.length > 0 ? Math.max(...data.map(row => row.length)) : 5;
        const newRow = Array(maxCols).fill('');
        setData(prev => [...prev, newRow]);
        showSuccessMessage('New row added successfully');
      } else {
        setError(result.error || 'Failed to add row');
      }
    } catch (err) {
      setError('Failed to add row');
    }
  };

  const handleAddColumn = async () => {
    try {
      const result = await addNewColumn(taskId);
      if (result.success) {
        // Add empty column to all rows
        const newData = data.map(row => [...row, '']);
        if (newData.length === 0) {
          newData.push(['']);
        }
        setData(newData);
        showSuccessMessage('New column added successfully');
      } else {
        setError(result.error || 'Failed to add column');
      }
    } catch (err) {
      setError('Failed to add column');
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

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Auto-hide after 3 seconds
  };

  const handleColumnSelect = (colIndex: number) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(colIndex)) {
      newSelected.delete(colIndex);
    } else {
      newSelected.add(colIndex);
    }
    setSelectedColumns(newSelected);
  };

  const startEditing = (rowIndex: number, colIndex: number, value: string) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(value || '');
  };

  const finishEditing = () => {
    if (editingCell) {
      handleCellUpdate(editingCell.row, editingCell.col, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  if (!isVisible) return null;

  const maxCols = data.length > 0 ? Math.max(...data.map(row => row.length)) : 0;

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
                        key={colIndex}
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
                  {data.map((row, rowIndex) => {
                    // Skip first row if it's used as header
                    const isHeaderRow = rowIndex === 0 && data[0]?.some(cell => cell !== null && cell !== '');
                    if (isHeaderRow) return null;

                    return (
                      <View key={rowIndex} style={styles.tableRow}>
                        <View style={[styles.cell, styles.rowHeaderCell]}>
                          <Text style={styles.rowHeaderText}>
                            {isHeaderRow ? rowIndex : rowIndex + 1}
                          </Text>
                        </View>
                        {Array.from({ length: maxCols }, (_, colIndex) => (
                          <View key={colIndex} style={styles.cell}>
                            {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                              <TextInput
                                value={editValue}
                                onChangeText={setEditValue}
                                onBlur={finishEditing}
                                onSubmitEditing={finishEditing}
                                onEndEditing={cancelEditing}
                                style={styles.cellInput}
                                autoFocus
                                multiline
                              />
                            ) : (
                              <TouchableOpacity
                                style={styles.cellContent}
                                onPress={() => startEditing(rowIndex, colIndex, row[colIndex] || '')}
                              >
                                <Text style={styles.cellText} numberOfLines={3}>
                                  {row[colIndex] || ''}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                      </View>
                    );
                  })}
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
  },
  cellText: {
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  rowHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default TaskPreviewModal;
