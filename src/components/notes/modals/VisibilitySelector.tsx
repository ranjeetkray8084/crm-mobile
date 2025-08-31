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
    const baseOptions = [
      { value: 'ONLY_ME', label: '🔒 Only Me', icon: 'person' },
    ];

    if (userRole === 'DIRECTOR') {
      return [
        ...baseOptions,
        { value: 'ALL_USERS', label: '👥 All Users', icon: 'people' },
        { value: 'SPECIFIC_USERS', label: '👤 Specific Users', icon: 'person-add' },
        { value: 'ALL_ADMIN', label: '🛡️ All Admins', icon: 'shield-checkmark' },
        { value: 'SPECIFIC_ADMIN', label: '👨‍💼 Specific Admins', icon: 'shield-add' },
      ];
    } else if (userRole === 'ADMIN') {
      return [
        ...baseOptions,
        { value: 'ME_AND_DIRECTOR', label: '🎯 Me and Director', icon: 'star' },
        { value: 'ALL_USERS', label: '👥 All Users', icon: 'people' },
        { value: 'SPECIFIC_USERS', label: '👤 Specific Users', icon: 'person-add' },
      ];
    } else {
      // USER role
      return [
        ...baseOptions,
        { value: 'ME_AND_DIRECTOR', label: '🎯 Me and Director', icon: 'star' },
        { value: 'ME_AND_ADMIN', label: '🛡️ Me and Admin', icon: 'shield' },
      ];
    }
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

  const toggleSelectAll = () => {
    console.log('VisibilitySelector: Toggle select all clicked');
    console.log('VisibilitySelector: Current selectedUsers:', selectedUsers);
    console.log('VisibilitySelector: Available users:', availableUsers);
    
    if (selectedUsers.length === availableUsers.length) {
      // Deselect all - clear the array
      console.log('VisibilitySelector: Deselecting all users');
      selectedUsers.forEach(id => onUserSelection(id));
    } else {
      // Select all available users
      console.log('VisibilitySelector: Selecting all users');
      availableUsers.forEach(user => {
        const userId = user.id || user.userId;
        console.log('VisibilitySelector: Processing user:', user, 'userId:', userId);
        if (userId && !selectedUsers.includes(userId)) {
          console.log('VisibilitySelector: Adding user to selection:', userId);
          onUserSelection(userId);
        }
      });
    }
  };

  const handleUserSelection = (userId: number) => {
    console.log('VisibilitySelector: User selection clicked for userId:', userId);
    console.log('VisibilitySelector: Current selectedUsers:', selectedUsers);
    onUserSelection(userId);
  };

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
          ) : availableUsers.length > 0 ? (
            <>
              {/* Select All Toggle */}
                             <TouchableOpacity
                 style={styles.selectAllButton}
                 onPress={toggleSelectAll}
               >
                 <Ionicons 
                   name={selectedUsers.length === availableUsers.length ? 'checkbox' : 'square-outline'} 
                   size={20} 
                   color={selectedUsers.length === availableUsers.length ? '#1c69ff' : '#6b7280'} 
                 />
                 <Text style={styles.selectAllText}>
                   Select All {visibility === 'SPECIFIC_USERS' ? 'Users' : 'Admins'}
                 </Text>
               </TouchableOpacity>

                                            {/* Users List */}
               <View style={styles.usersListContainer}>
                 <ScrollView 
                   showsVerticalScrollIndicator={true}
                   nestedScrollEnabled={true}
                   style={styles.usersScrollView}
                   contentContainerStyle={styles.usersScrollContent}
                   bounces={false}
                   alwaysBounceVertical={false}
                 >
                   {availableUsers.map((user, index) => {
                     const userId = user.id || user.userId;
                     const isSelected = selectedUsers.includes(userId);
                     
                     return (
                       <TouchableOpacity
                         key={userId}
                         style={styles.userListItem}
                         onPress={() => handleUserSelection(userId)}
                       >
                         <View style={styles.checkboxContainer}>
                           <Ionicons 
                             name={isSelected ? 'checkbox' : 'square-outline'} 
                             size={20} 
                             color={isSelected ? '#1c69ff' : '#6b7280'} 
                           />
                         </View>
                         <Text style={styles.userListItemText}>
                           {user.name || user.username || `User ${userId}`}
                         </Text>
                       </TouchableOpacity>
                     );
                   })}
                 </ScrollView>
               </View>

               {/* Selection Summary - Outside the user list */}
               <View style={[
                 styles.selectedUsersInfo,
                 selectedUsers.length === 0 && styles.selectedUsersInfoEmpty
               ]}>
                 <Text style={[
                   styles.selectedUsersText,
                   selectedUsers.length === 0 && styles.selectedUsersTextEmpty
                 ]}>
                   {selectedUsers.length === 0 
                     ? `No ${visibility === 'SPECIFIC_USERS' ? 'users' : 'admins'} selected` 
                     : `${selectedUsers.length} ${visibility === 'SPECIFIC_USERS' ? 'user' : 'admin'}${selectedUsers.length !== 1 ? 's' : ''} selected`
                   }
                 </Text>
               </View>
            </>
          ) : (
            <View style={styles.noUsersContainer}>
              <Text style={styles.noUsersText}>
                No {visibility === 'SPECIFIC_USERS' ? 'users' : 'admins'} found
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
  noUsersContainer: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1c69ff',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1c69ff',
  },
  usersListContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 8,
  },
  usersScrollView: {
    flex: 1,
  },
  usersScrollContent: {
    paddingBottom: 8,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  checkboxContainer: {
    width: 24,
    alignItems: 'center',
  },
  userListItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedUsersInfo: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c69ff',
  },
  selectedUsersInfoEmpty: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  selectedUsersText: {
    fontSize: 14,
    color: '#1c69ff',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedUsersTextEmpty: {
    color: '#6b7280',
  },
});

export default VisibilitySelector;
