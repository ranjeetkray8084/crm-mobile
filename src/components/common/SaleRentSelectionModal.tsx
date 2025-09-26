import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SaleRentSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSale: () => void;
  onSelectRent: () => void;
  leadName: string;
}

const SaleRentSelectionModal: React.FC<SaleRentSelectionModalProps> = ({
  visible,
  onClose,
  onSelectSale,
  onSelectRent,
  leadName
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="home" size={24} color="#3b82f6" />
              <Text style={styles.modalTitle}>Lead Closed: Sale or Rent?</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>
              The lead <Text style={styles.leadName}>{leadName}</Text> has been marked as CLOSED.
              Was this lead closed due to a Sale or a Rent?
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saleButton}
                onPress={onSelectSale}
              >
                <Ionicons name="cash" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Sale</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.rentButton}
                onPress={onSelectRent}
              >
                <Ionicons name="home" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Rent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  leadName: {
    fontWeight: '600',
    color: '#374151',
  },
  buttonContainer: {
    gap: 12,
  },
  saleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  rentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default SaleRentSelectionModal;
