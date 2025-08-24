import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
}

interface UpdatePropertyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  property: Property | null;
}

const UpdatePropertyModal: React.FC<UpdatePropertyModalProps> = ({
  isVisible,
  onClose,
  onUpdate,
  property
}) => {
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showReference, setShowReference] = useState(false);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        propertyName: property.propertyName || property.name || '',
        type: property.type || '',
        bhk: property.bhk || '',
        unitDetails: property.unitDetails || property.unit || '',
        floor: property.floor || '',
        size: property.size || '',
        location: property.location || '',
        ownerContact: property.ownerContact || property.ownerNumber || '',
        ownerName: property.ownerName || '',
        price: property.price || 0,
        sector: property.sector || '',
        status: property.status || '',
        source: property.source || '',
        referenceName: property.referenceName || ''
      });
      setErrors({});
    }
  }, [property]);

  useEffect(() => {
    if (formData.type === 'Office' || formData.type === 'Retail') {
      if (formData.bhk) {
        setFormData(prev => ({ ...prev, bhk: '' }));
      }
    }
  }, [formData.type, formData.bhk]);

  useEffect(() => {
    const source = formData.source;
    setShowReference(source === 'Reference');
    setIsBroker(source === 'Broker');
  }, [formData.source]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.propertyName?.trim()) {
      newErrors.propertyName = 'Property name is required';
    }

    if (!formData.type?.trim()) {
      newErrors.type = 'Property type is required';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.sector?.trim()) {
      newErrors.sector = 'Sector is required';
    }

    if (!formData.status?.trim()) {
      newErrors.status = 'Status is required';
    }

    if (formData.size && isNaN(Number(formData.size))) {
      newErrors.size = 'Size must be a valid number';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const updateData = {
        propertyName: formData.propertyName,
        type: formData.type,
        bhk: formData.bhk,
        unitDetails: formData.unitDetails,
        floor: formData.floor,
        size: formData.size ? parseInt(formData.size) : null,
        location: formData.location,
        ownerContact: formData.ownerContact,
        ownerName: formData.ownerName,
        price: formData.price,
        sector: formData.sector,
        status: formData.status,
        source: formData.source,
        referenceName: formData.source === 'Reference' ? (formData.referenceName || '') : ''
      };
      
      onUpdate(updateData);
    }
  };

  const handleInputChange = (field: keyof Property, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const typeOptions = [
    { value: 'Office', label: 'Office' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Plot', label: 'Plot' }
  ];

  const statusOptions = [
    { value: 'AVAILABLE_FOR_SALE', label: 'Available for Sale' },
    { value: 'AVAILABLE_FOR_RENT', label: 'Available for Rent' },
    { value: 'RENT_OUT', label: 'Rent Out' },
    { value: 'SOLD_OUT', label: 'Sold Out' }
  ];

  const sourceOptions = [
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Cold Call', label: 'Cold Call' },
    { value: 'Project Call', label: 'Project Call' },
    { value: 'Reference', label: 'Reference' },
    { value: 'Broker', label: 'Broker' }
  ];

  const isBhkDisabled = formData.type === 'Office' || formData.type === 'Retail';

  if (!property) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Property</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Property Name *</Text>
                <TextInput
                  style={[styles.input, errors.propertyName && styles.inputError]}
                  value={formData.propertyName}
                  onChangeText={(value) => handleInputChange('propertyName', value)}
                  placeholder="Enter property name"
                  placeholderTextColor="#9ca3af"
                />
                {errors.propertyName && <Text style={styles.errorText}>{errors.propertyName}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.pickerContainer}>
                  {typeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        formData.type === option.value && styles.optionSelected
                      ]}
                      onPress={() => handleInputChange('type', option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.type === option.value && styles.optionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>BHK</Text>
                <TextInput
                  style={[styles.input, isBhkDisabled && styles.inputDisabled]}
                  value={formData.bhk}
                  onChangeText={(value) => handleInputChange('bhk', value)}
                  placeholder="e.g., 2BHK"
                  placeholderTextColor="#9ca3af"
                  editable={!isBhkDisabled}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Unit Details</Text>
                <TextInput
                  style={styles.input}
                  value={formData.unitDetails}
                  onChangeText={(value) => handleInputChange('unitDetails', value)}
                  placeholder="Enter unit details"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Floor</Text>
                <TextInput
                  style={styles.input}
                  value={formData.floor}
                  onChangeText={(value) => handleInputChange('floor', value)}
                  placeholder="Enter floor"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Size (sqft)</Text>
                <TextInput
                  style={[styles.input, errors.size && styles.inputError]}
                  value={formData.size}
                  onChangeText={(value) => handleInputChange('size', value)}
                  placeholder="Enter size"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
                {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{isBroker ? 'Broker Name' : 'Owner Name'}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ownerName}
                  onChangeText={(value) => handleInputChange('ownerName', value)}
                  placeholder={isBroker ? "Enter broker name" : "Enter owner name"}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>{isBroker ? 'Broker Contact' : 'Owner Contact'}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ownerContact}
                  onChangeText={(value) => handleInputChange('ownerContact', value)}
                  placeholder={isBroker ? "Enter broker contact" : "Enter owner contact"}
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  placeholder="Enter location"
                  placeholderTextColor="#9ca3af"
                />
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={formData.price?.toString()}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="Enter price"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Sector *</Text>
                <TextInput
                  style={[styles.input, errors.sector && styles.inputError]}
                  value={formData.sector}
                  onChangeText={(value) => handleInputChange('sector', value)}
                  placeholder="Enter sector"
                  placeholderTextColor="#9ca3af"
                />
                {errors.sector && <Text style={styles.errorText}>{errors.sector}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Status *</Text>
                <View style={styles.pickerContainer}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        formData.status === option.value && styles.optionSelected
                      ]}
                      onPress={() => handleInputChange('status', option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.status === option.value && styles.optionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Source</Text>
                <View style={styles.pickerContainer}>
                  {sourceOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        formData.source === option.value && styles.optionSelected
                      ]}
                      onPress={() => handleInputChange('source', option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.source === option.value && styles.optionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {showReference && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Reference Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.referenceName}
                  onChangeText={(value) => handleInputChange('referenceName', value)}
                  placeholder="Enter reference name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleSubmit}>
              <Text style={styles.updateButtonText}>Update Property</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    maxHeight: 500,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  optionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  updateButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});

export default UpdatePropertyModal;
