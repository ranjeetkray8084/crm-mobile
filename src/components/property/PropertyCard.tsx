import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThreeDotMenu from '../common/ThreeDotMenu';
import StatusUpdateModal from '../common/StatusUpdateModal';
import PhoneNumber from '../common/PhoneNumber';

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
  onUpdate?: (property: Property) => void;
  onAddRemark?: (property: Property) => void;
  onViewRemarks?: (property: Property) => void;
  onOutOfBox?: (property: Property) => void;
  companyId?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onStatusChange,
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

  const formatPricePerSqft = (price: number, size: string) => {
    if (!price || !size) return 'N/A';
    
    // Extract numeric value from size string (e.g., "2040" from "2040 sqft")
    const sizeMatch = size.match(/(\d+)/);
    if (!sizeMatch) return 'N/A';
    
    const sizeInSqft = parseInt(sizeMatch[1]);
    if (sizeInSqft === 0) return 'N/A';
    
    const pricePerSqft = Math.round(price / sizeInSqft);
    return `₹${pricePerSqft.toLocaleString()}/sqft`;
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
    }
  ];

  const statusStyle = getStatusColor(property.status || '');

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Property Details',
        message: formatPropertyDataForShare(property),
        url: '', // You can add a URL if needed
      };

      const result = await Share.share(shareData);
      
      if (result.action === Share.sharedAction) {
        console.log('Property shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing property:', error);
      Alert.alert('Error', 'Failed to share property details');
    }
  };

  const formatPropertyDataForShare = (property: Property) => {
    const propertyName = property.propertyName || property.name || 'Unnamed Property';
    const location = property.location || 'N/A';
    const type = property.type || 'N/A';
    const bhk = property.bhk ? `${property.bhk} BHK` : 'N/A';
    const price = property.price ? `₹${property.price.toLocaleString('en-IN')}` : 'N/A';
    const size = property.size || 'N/A';
    const source = property.source || 'N/A';
    const status = getStatusLabel(property.status || '');

    return `🏠 *${propertyName}*

📍 Location: ${location}
🏢 Type: ${type}
🏠 BHK: ${bhk}
💰 Price: ${price}
📏 Size: ${size}
📊 Source: ${source}
📋 Status: ${status}

Shared from CRM App`;
  };

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
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Share Button */}
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
          
          {/* Three Dot Menu */}
          <ThreeDotMenu
            item={property}
            actions={actions}
            position="right-0"
          />
        </View>
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
            {property.size && property.price && (
              <Text style={styles.pricePerSqftText}>
                {formatPricePerSqft(property.price, property.size)}
              </Text>
            )}
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>{formatPrice(property.price || 0)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Floor</Text>
            <Text style={styles.detailValue}>{property.floor || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Unit Details</Text>
            <Text style={styles.detailValue}>{property.unitDetails || 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Owner/Broker</Text>
            <Text style={styles.detailValue}>{property.ownerName || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Contact</Text>
            <PhoneNumber 
              phoneNumber={property.ownerContact || property.ownerNumber || 'N/A'} 
              textStyle={styles.detailValue}
            />
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Source</Text>
            <Text style={styles.detailValue}>{property.source || 'N/A'}</Text>
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  pricePerSqftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
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
