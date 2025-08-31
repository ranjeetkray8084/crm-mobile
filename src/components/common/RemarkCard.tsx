import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Remark {
  id: string;
  remark: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  type?: string;
}

interface RemarkCardProps {
  remark: Remark;
  showType?: boolean;
  compact?: boolean;
}

const RemarkCard: React.FC<RemarkCardProps> = ({ 
  remark, 
  showType = true, 
  compact = false 
}) => {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getRemarkTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'followup':
        return '#3b82f6'; // Blue
      case 'important':
        return '#ef4444'; // Red
      case 'general':
        return '#10b981'; // Green
      case 'note':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  const getRemarkTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'followup':
        return 'time';
      case 'important':
        return 'alert-circle';
      case 'general':
        return 'chatbubble';
      case 'note':
        return 'document-text';
      default:
        return 'chatbubble-outline';
    }
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          {showType && (
            <View style={styles.typeContainer}>
              <View 
                style={[
                  styles.typeIndicator, 
                  { backgroundColor: getRemarkTypeColor(remark.type) }
                ]} 
              />
              <Text style={styles.typeText}>
                {remark.type || 'General'}
              </Text>
            </View>
          )}
          <Text style={styles.timestamp}>
            {formatDateTime(remark.createdAt)}
          </Text>
        </View>
        <View style={styles.rightHeader}>
          <Ionicons 
            name={getRemarkTypeIcon(remark.type) as any} 
            size={16} 
            color={getRemarkTypeColor(remark.type)} 
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.remarkText} numberOfLines={compact ? 3 : undefined}>
          {remark.remark}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.authorText}>
            {remark.createdBy?.name || 'Unknown User'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  compactContainer: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftHeader: {
    flex: 1,
    gap: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 11,
    color: '#6b7280',
  },
  rightHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: 12,
  },
  remarkText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1f2937',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default RemarkCard;
