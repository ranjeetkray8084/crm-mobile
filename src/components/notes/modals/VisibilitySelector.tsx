import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VisibilitySelectorProps {
  visibility: string;
  onVisibilityChange: (visibility: string) => void;
  selectedUsers: number[];
  onUserSelection: (userId: number) => void;
  availableUsers: any[];
  userRole: string;
  loading: boolean;
}

const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  visibility,
  onVisibilityChange,
  selectedUsers,
  onUserSelection,
  availableUsers,
  userRole,
  loading,
}) => {
  const getVisibilityOptions = () => {
    const options = [
      { value: 'ONLY_ME', label: 'Only Me', icon: 'person' },
      { value: 'ALL_USERS', label: 'All Users', icon: 'people' },
    ];

    if (userRole === 'ADMIN' || userRole === 'DIRECTOR') {
      options.push({ value: 'ALL_ADMIN', label: 'All Admins', icon: 'shield-checkmark' });
    }

    options.push(
      { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: 'person-add' }
    );

    if (userRole === 'ADMIN' || userRole === 'DIRECTOR') {
      options.push({ value: 'SPECIFIC_ADMIN', label: 'Specific Admins', icon: 'shield-add' });
    }

    return options;
  };

  const getVisibilityIcon = (value: string) => {
    const option = getVisibilityOptions().find(opt => opt.value === value);
    return option?.icon || 'person';
  };

  const getVisibilityLabel = (value: string) => {
    const option = getVisibilityOptions().find(opt => opt.value === value);
    return option?.label || value;
  };

  const isUserSpecific = visibility === 'SPECIFIC_USERS' || visibility === 'SPECIFIC_ADMIN';

  return (
    <View style={styles.container}>
      {/* Visibility Options */}
      <View style={styles.visibilityOptions}>
        {getVisibilityOptions().map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.visibilityOption,
              visibility === option.value && styles.visibilityOptionSelected
            ]}
            onPress={() => onVisibilityChange(option.value)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={20} 
              color={visibility === option.value ? '#fff' : '#6b7280'} 
            />
            <Text style={[
              styles.visibilityOptionText,
              visibility === option.value && styles.visibilityOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User Selection */}
      {isUserSpecific && (
        <View style={styles.userSelectionContainer}>
          <Text style={styles.userSelectionTitle}>
            Select {visibility === 'SPECIFIC_USERS' ? 'Users' : 'Admins'}:
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1c69ff" />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.usersScroll}
            >
              {availableUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userChip,
                    selectedUsers.includes(user.id) && styles.userChipSelected
                  ]}
                  onPress={() => onUserSelection(user.id)}
                >
                  <Ionicons 
                    name={selectedUsers.includes(user.id) ? 'checkmark-circle' : 'person-circle-outline'} 
                    size={20} 
                    color={selectedUsers.includes(user.id) ? '#fff' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.userChipText,
                    selectedUsers.includes(user.id) && styles.userChipTextSelected
                  ]}>
                    {user.name || user.username || `User ${user.id}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {selectedUsers.length > 0 && (
            <View style={styles.selectedUsersInfo}>
              <Text style={styles.selectedUsersText}>
                {selectedUsers.length} {visibility === 'SPECIFIC_USERS' ? 'user' : 'admin'}{selectedUsers.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  visibilityOptions: {
    gap: 8,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    gap: 12,
  },
  visibilityOptionSelected: {
    backgroundColor: '#1c69ff',
    borderColor: '#1c69ff',
  },
  visibilityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  visibilityOptionTextSelected: {
    color: '#fff',
  },
  userSelectionContainer: {
    gap: 12,
  },
  userSelectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  usersScroll: {
    flexGrow: 0,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    marginRight: 8,
    gap: 6,
  },
  userChipSelected: {
    backgroundColor: '#1c69ff',
    borderColor: '#1c69ff',
  },
  userChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  userChipTextSelected: {
    color: '#fff',
  },
  selectedUsersInfo: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c69ff',
  },
  selectedUsersText: {
    fontSize: 14,
    color: '#1c69ff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default VisibilitySelector;
