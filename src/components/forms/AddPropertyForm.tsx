import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProperties } from '../../core/hooks/useProperties';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddPropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  companyId?: string;
  userId?: string;
  userRole?: string;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ 
  onSuccess, 
  onCancel, 
  companyId: propCompanyId, 
  userId: propUserId, 
  userRole: propUserRole 
}) => {
  const [form, setForm] = useState({
    propertyName: '',
    type: 'Residential',
    bhk: '',
    unit: '',
    floor: '',
    sizeValue: '',
    sizeUnit: 'sqft',
    status: 'AVAILABLE_FOR_SALE',
    price: '',
    sector: '',
    location: '',
    source: 'Social Media',
    referenceName: '',
    ownerName: '',
    ownerContact: '',
  });

  const [showReference, setShowReference] = useState(false);
  const [isBroker, setIsBroker] = useState(false);
  const [disableBhk, setDisableBhk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<string>(propCompanyId || '');
  const [userId, setUserId] = useState<string>(propUserId || '');

  const { createProperty } = useProperties(companyId, userId, propUserRole || '');

  useEffect(() => {
    const loadUserInfo = async () => {
      // Use props if available, otherwise fall back to AsyncStorage
      if (propCompanyId && propUserId) {
        setCompanyId(propCompanyId);
        setUserId(propUserId);
        return;
      }

      try {
        const userData = await AsyncStorage.getItem('crm_user');
        if (userData) {
          const user = JSON.parse(userData);
          setCompanyId(user.companyId?.toString() || '');
          setUserId(user.userId?.toString() || user.id?.toString() || '');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, [propCompanyId, propUserId]);

  useEffect(() => {
    toggleBhkField(form.type);
    toggleSourceFields(form.source);
  }, [form.type, form.source]);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleBhkField = (type: string) => {
    const disable = ['Office', 'Retail', 'Plot'].includes(type);
    setDisableBhk(disable);
    if (disable) {
      setForm(prev => ({ ...prev, bhk: '' }));
    }
  };

  const toggleSourceFields = (source: string) => {
    setShowReference(source === 'Reference');
    setIsBroker(source === 'Broker');
  };

  const handleSubmit = async () => {
    console.log('AddPropertyForm: handleSubmit called');
    console.log('AddPropertyForm: companyId:', companyId);
    console.log('AddPropertyForm: userId:', userId);
    console.log('AddPropertyForm: form data:', form);

    if (!form.propertyName.trim() || !form.sector.trim() || !form.ownerName.trim() || !form.ownerContact.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (form.source === 'Reference' && !form.referenceName.trim()) {
      Alert.alert('Error', 'Please enter the reference name');
      return;
    }

    if (!companyId || !userId) {
      Alert.alert('Error', 'Company ID or User ID is missing. Please try again.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      propertyName: form.propertyName,
      type: form.type,
      bhk: disableBhk ? '' : form.bhk,
      size: form.sizeValue ? `${form.sizeValue} ${form.sizeUnit}` : '',
      unitDetails: form.unit || '',
      floor: form.floor || '',
      location: form.location || '',
      status: form.status,
      price: form.price ? Number(form.price) : null,
      sector: form.sector,
      source: form.source,
      referenceName: form.source === 'Reference' ? (form.referenceName || '') : '',
      ownerName: form.ownerName,
      ownerContact: form.ownerContact,
      createdBy: { userId },
    };

    console.log('AddPropertyForm: Submitting payload:', payload);

    try {
      const result = await createProperty(payload);
      console.log('AddPropertyForm: createProperty result:', result);

      if (result.success) {
        Alert.alert('Success', 'Property created successfully!');
        setForm({
          propertyName: '',
          type: 'Residential',
          bhk: '',
          unit: '',
          floor: '',
          sizeValue: '',
          sizeUnit: 'sqft',
          status: 'AVAILABLE_FOR_SALE',
          price: '',
          sector: '',
          location: '',
          source: 'Social Media',
          referenceName: '',
          ownerName: '',
          ownerContact: '',
        });
        onSuccess();
      } else {
        Alert.alert('Error', result.error || 'Failed to create property');
      }
    } catch (err: any) {
      console.error('AddPropertyForm: Error in handleSubmit:', err);
      Alert.alert('Error', err.message || 'Error creating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriceLabel = () =>
    ['Office', 'Retail'].includes(form.type) ? 'Lease Amount' : 'Price';

  console.log('AddPropertyForm: Rendering form component');
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="business" size={24} color="white" />
        <Text style={styles.headerText}>Add New Property</Text>
      </View>
      
     

      <View style={styles.form}>
        {/* Property Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Property Name *</Text>
          <TextInput
            style={styles.input}
            value={form.propertyName}
            onChangeText={(value) => handleChange('propertyName', value)}
            placeholder="Enter property name"
          />
        </View>

        {/* Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type *</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, form.type === 'Residential' && styles.pickerOptionSelected]}
              onPress={() => handleChange('type', 'Residential')}
            >
              <Text style={[styles.pickerOptionText, form.type === 'Residential' && styles.pickerOptionTextSelected]}>
                Residential
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.type === 'Retail' && styles.pickerOptionSelected]}
              onPress={() => handleChange('type', 'Retail')}
            >
              <Text style={[styles.pickerOptionText, form.type === 'Retail' && styles.pickerOptionTextSelected]}>
                Retail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.type === 'Office' && styles.pickerOptionSelected]}
              onPress={() => handleChange('type', 'Office')}
            >
              <Text style={[styles.pickerOptionText, form.type === 'Office' && styles.pickerOptionTextSelected]}>
                Office
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.type === 'Plot' && styles.pickerOptionSelected]}
              onPress={() => handleChange('type', 'Plot')}
            >
              <Text style={[styles.pickerOptionText, form.type === 'Plot' && styles.pickerOptionTextSelected]}>
                Plot
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BHK */}
        <View style={styles.field}>
          <Text style={styles.label}>BHK</Text>
          <TextInput
            style={[styles.input, disableBhk && styles.inputDisabled]}
            value={form.bhk}
            onChangeText={(value) => handleChange('bhk', value)}
            placeholder="e.g. 2BHK"
            editable={!disableBhk}
          />
        </View>

        {/* Unit */}
        <View style={styles.field}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={styles.input}
            value={form.unit}
            onChangeText={(value) => handleChange('unit', value)}
            placeholder="Enter unit details"
          />
        </View>

        {/* Floor */}
        <View style={styles.field}>
          <Text style={styles.label}>Floor</Text>
          <TextInput
            style={styles.input}
            value={form.floor}
            onChangeText={(value) => handleChange('floor', value)}
            placeholder="Enter floor number"
          />
        </View>

        {/* Size */}
        <View style={styles.field}>
          <Text style={styles.label}>Size</Text>
          <View style={styles.sizeContainer}>
            <TextInput
              style={[styles.input, styles.sizeInput]}
              value={form.sizeValue}
              onChangeText={(value) => handleChange('sizeValue', value)}
              placeholder="Size value"
              keyboardType="numeric"
            />
            <View style={styles.sizeUnitContainer}>
              <TouchableOpacity
                style={[styles.sizeUnitOption, form.sizeUnit === 'sqft' && styles.sizeUnitOptionSelected]}
                onPress={() => handleChange('sizeUnit', 'sqft')}
              >
                <Text style={[styles.sizeUnitText, form.sizeUnit === 'sqft' && styles.sizeUnitTextSelected]}>
                  sqft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeUnitOption, form.sizeUnit === 'sqyd' && styles.sizeUnitOptionSelected]}
                onPress={() => handleChange('sizeUnit', 'sqyd')}
              >
                <Text style={[styles.sizeUnitText, form.sizeUnit === 'sqyd' && styles.sizeUnitTextSelected]}>
                  sqyd
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={styles.label}>Status *</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[styles.statusOption, form.status === 'AVAILABLE_FOR_SALE' && styles.statusOptionSelected]}
                onPress={() => handleChange('status', 'AVAILABLE_FOR_SALE')}
              >
                <Text style={[styles.statusOptionText, form.status === 'AVAILABLE_FOR_SALE' && styles.statusOptionTextSelected]}>
                  Available for Sale
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusOption, form.status === 'AVAILABLE_FOR_RENT' && styles.statusOptionSelected]}
                onPress={() => handleChange('status', 'AVAILABLE_FOR_RENT')}
              >
                <Text style={[styles.statusOptionText, form.status === 'AVAILABLE_FOR_RENT' && styles.statusOptionTextSelected]}>
                  Available for Rent
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[styles.statusOption, form.status === 'RENT_OUT' && styles.statusOptionSelected]}
                onPress={() => handleChange('status', 'RENT_OUT')}
              >
                <Text style={[styles.statusOptionText, form.status === 'RENT_OUT' && styles.statusOptionTextSelected]}>
                  Rented Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusOption, form.status === 'SOLD_OUT' && styles.statusOptionSelected]}
                onPress={() => handleChange('status', 'SOLD_OUT')}
              >
                <Text style={[styles.statusOptionText, form.status === 'SOLD_OUT' && styles.statusOptionTextSelected]}>
                  Sold Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price */}
        <View style={styles.field}>
          <Text style={styles.label}>{getPriceLabel()}</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(value) => handleChange('price', value)}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        </View>

        {/* Sector */}
        <View style={styles.field}>
          <Text style={styles.label}>Sector *</Text>
          <TextInput
            style={styles.input}
            value={form.sector}
            onChangeText={(value) => handleChange('sector', value)}
            placeholder="Enter sector"
          />
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={form.location}
            onChangeText={(value) => handleChange('location', value)}
            placeholder="Enter location"
          />
        </View>

        {/* Source */}
        <View style={styles.field}>
          <Text style={styles.label}>Source *</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOption, form.source === 'Social Media' && styles.pickerOptionSelected]}
              onPress={() => handleChange('source', 'Social Media')}
            >
              <Text style={[styles.pickerOptionText, form.source === 'Social Media' && styles.pickerOptionTextSelected]}>
                Social Media
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.source === 'Cold Call' && styles.pickerOptionSelected]}
              onPress={() => handleChange('source', 'Cold Call')}
            >
              <Text style={[styles.pickerOptionText, form.source === 'Cold Call' && styles.pickerOptionTextSelected]}>
                Cold Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.source === 'Project Call' && styles.pickerOptionSelected]}
              onPress={() => handleChange('source', 'Project Call')}
            >
              <Text style={[styles.pickerOptionText, form.source === 'Project Call' && styles.pickerOptionTextSelected]}>
                Project Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.source === 'Reference' && styles.pickerOptionSelected]}
              onPress={() => handleChange('source', 'Reference')}
            >
              <Text style={[styles.pickerOptionText, form.source === 'Reference' && styles.pickerOptionTextSelected]}>
                Reference
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, form.source === 'Broker' && styles.pickerOptionSelected]}
              onPress={() => handleChange('source', 'Broker')}
            >
              <Text style={[styles.pickerOptionText, form.source === 'Broker' && styles.pickerOptionTextSelected]}>
                Broker
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reference Name */}
        {showReference && (
          <View style={styles.field}>
            <Text style={styles.label}>Reference Name</Text>
            <TextInput
              style={styles.input}
              value={form.referenceName}
              onChangeText={(value) => handleChange('referenceName', value)}
              placeholder="Enter reference name"
            />
          </View>
        )}

        {/* Owner / Broker */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {isBroker ? 'Broker Name' : 'Owner Name'} *
          </Text>
          <TextInput
            style={styles.input}
            value={form.ownerName}
            onChangeText={(value) => handleChange('ownerName', value)}
            placeholder={isBroker ? 'Enter broker name' : 'Enter owner name'}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            {isBroker ? 'Broker Contact' : 'Owner Contact'} *
          </Text>
          <TextInput
            style={styles.input}
            value={form.ownerContact}
            onChangeText={(value) => handleChange('ownerContact', value)}
            placeholder={isBroker ? 'Enter broker contact' : 'Enter owner contact'}
            keyboardType="phone-pad"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  pickerOptionText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeInput: {
    flex: 1,
  },
  sizeUnitContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  sizeUnitOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    minWidth: 60,
    alignItems: 'center',
  },
  sizeUnitOptionSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  sizeUnitText: {
    color: '#374151',
    fontSize: 14,
  },
  sizeUnitTextSelected: {
    color: 'white',
  },
  statusContainer: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  statusOptionSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  statusOptionText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddPropertyForm;
