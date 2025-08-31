import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RemarkCard from './RemarkCard';

interface Remark {
  id: string;
  remark: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  type?: string;
}

interface RemarksListProps {
  remarks: Remark[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  emptyMessage?: string;
  compact?: boolean;
  showType?: boolean;
}

const RemarksList: React.FC<RemarksListProps> = ({
  remarks,
  loading = false,
  error = null,
  onRefresh,
  emptyMessage = 'No remarks found',
  compact = false,
  showType = true
}) => {
  const sortedRemarks = [...remarks].sort((a, b) => {
    try {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    } catch (error) {
      console.warn('Error sorting remarks by date:', error);
      return 0;
    }
  });

  if (loading && remarks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={48} color="#9ca3af" />
        <Text style={styles.loadingText}>Loading remarks...</Text>
      </View>
    );
  }

  if (error && remarks.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        {onRefresh && (
          <Text style={styles.retryText}>Pull down to refresh</Text>
        )}
      </View>
    );
  }

  if (sortedRemarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubText}>Add the first remark to get started</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        ) : undefined
      }
    >
      {sortedRemarks.map((remark, index) => (
        <RemarkCard
          key={remark.id || index}
          remark={remark}
          showType={showType}
          compact={compact}
        />
      ))}
      
      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default RemarksList;
