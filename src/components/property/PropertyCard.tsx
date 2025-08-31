import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';
import StatusUpdateModal from '../common/StatusUpdateModal';

interface Property {
  id?: number;
  propertyId?: number;
  propertyName?: string;
  name?: string;
  status?: string;
  type?: string;
  bhk?: string;
  price?: number;
  location?: string;
  sector?: string;
  source?: string;
  size?: string;
  unit?: string;
  unitDetails?: string;
  floor?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerNumber?: string;
  referenceName?: string;
  createdBy?: {
    name: string;
  };
  createdByName?: string;
  createdAt?: string;
  remarks?: any[];
}

interface PropertyCardProps {
  property: Property;
  onStatusChange?: (propertyId: number, newStatus: string) => void;
  onDelete?: (propertyId: number) => void;
  onUpdate?: (property: Property) => void;
  onAddRemark?: (property: Property) => void;
  onViewRemarks?: (property: Property) => void;
  onOutOfBox?: (property: Property) => void;
  companyId?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onStatusChange,
  onDelete,
  onUpdate,
  onAddRemark,
  onViewRemarks,
  onOutOfBox,
  companyId
}) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const propertyId = property.id || property.propertyId;
  const propertyName = property.propertyName || property.name;

  const formatPrice = (price: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE_FOR_SALE':
        return { bg: '#dcfce7', text: '#166534' };
      case 'AVAILABLE_FOR_RENT':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'RENT_OUT':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'SOLD_OUT':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE_FOR_SALE':
        return 'For Sale';
      case 'AVAILABLE_FOR_RENT':
        return 'For Rent';
      case 'RENT_OUT':
        return 'Rented Out';
      case 'SOLD_OUT':
        return 'Sold Out';
      default:
        return status || 'N/A';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!onStatusChange || !propertyId) return;
    onStatusChange(propertyId, newStatus);
  };

  const actions = [
    {
      label: 'Update Property',
      icon: <Ionicons name="create" size={14} color="#6b7280" />,
      onClick: () => onUpdate?.(property)
    },
    {
      label: 'Add Remark',
      icon: <Ionicons name="chatbubble" size={14} color="#6b7280" />,
      onClick: () => onAddRemark?.(property)
    },
    {
      label: 'View Remarks',
      icon: <Ionicons name="eye" size={14} color="#6b7280" />,
      onClick: () => onViewRemarks?.(property)
    },
    {
      label: 'Delete Property',
      icon: <Ionicons name="trash" size={14} color="#6b7280" />,
      onClick: () => propertyId && onDelete?.(propertyId),
      danger: true
    }
  ];

  const statusStyle = getStatusColor(property.status || '');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyName}>
            {propertyName || 'Unnamed Property'}
          </Text>
          <Text style={styles.locationText}>
            {property.location || 'N/A'}
          </Text>
        </View>
        
        {/* Three Dot Menu */}
        <ThreeDotMenu
          item={property}
          actions={actions}
          position="right-0"
        />
      </View>

      {/* Property Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{property.type || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>BHK</Text>
            <Text style={styles.detailValue}>{property.bhk ? `${property.bhk} BHK` : 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Size</Text>
            <Text style={styles.detailValue}>{property.size || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>{formatPrice(property.price || 0)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Owner/Broker</Text>
            <Text style={styles.detailValue}>{property.ownerName || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{property.ownerContact || property.ownerNumber || 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Source</Text>
            <Text style={styles.detailValue}>{property.source || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Unit Details</Text>
            <Text style={styles.detailValue}>{property.unitDetails || property.unit || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {getStatusLabel(property.status || '')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Update Modal */}
      <StatusUpdateModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        onStatusUpdate={handleStatusChange}
        title="Update Status"
        subtitle="Select new status"
        statusOptions={[
          { value: 'AVAILABLE_FOR_SALE', label: 'For Sale' },
          { value: 'AVAILABLE_FOR_RENT', label: 'For Rent' },
          { value: 'RENT_OUT', label: 'Rented Out' },
          { value: 'SOLD_OUT', label: 'Sold Out' }
        ]}
        currentStatus={property.status}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>Created {formatDate(property.createdAt || '')}</Text>
        <Text style={styles.createdByText}>
          by {property.createdBy?.name || property.createdByName || 'Unknown'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  createdByText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default PropertyCard;
