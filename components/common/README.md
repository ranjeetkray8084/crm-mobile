# Common Components - Leadstracker

This folder contains React Native versions of the common components used in the crm-frontend project, adapted for mobile use.

## Components Overview

### 1. ThreeDotMenu
A dropdown menu component that shows additional actions for items.

```tsx
import { ThreeDotMenu } from '../components/common';

const actions = [
  {
    label: 'Edit',
    onClick: (item) => console.log('Edit', item),
    icon: 'create-outline'
  },
  {
    label: 'Delete',
    onClick: (item) => console.log('Delete', item),
    icon: 'trash-outline',
    danger: true
  }
];

<ThreeDotMenu 
  item={leadData} 
  actions={actions} 
/>
```

### 2. ConfirmModal
A confirmation dialog for important actions.

```tsx
import { ConfirmModal } from '../components/common';

<ConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  title="Delete Lead"
  message="Are you sure you want to delete this lead? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
/>
```

### 3. CustomAlert
An animated alert component for showing messages.

```tsx
import { CustomAlert } from '../components/common';

<CustomAlert
  message={alertMessage}
  onClose={() => setAlertMessage(null)}
/>
```

### 4. NotificationDropdown
A notification bell with unread count badge.

```tsx
import { NotificationDropdown } from '../components/common';

<NotificationDropdown
  unreadCount={5}
  onPress={() => navigation.navigate('Notifications')}
  loading={false}
/>
```

### 5. ResponsiveContainer
A container component with header, title, and content areas.

```tsx
import { ResponsiveContainer } from '../components/common';

<ResponsiveContainer
  title="Leads Dashboard"
  subtitle="Manage your leads efficiently"
  icon="people-outline"
  maxWidth="lg"
>
  <Text>Your content here</Text>
</ResponsiveContainer>
```

### 6. ResponsiveGrid
A responsive grid layout component.

```tsx
import { ResponsiveGrid } from '../components/common';

<ResponsiveGrid
  cols={{ sm: 1, md: 2, lg: 3 }}
  gap={4}
>
  <View style={styles.card}>Card 1</View>
  <View style={styles.card}>Card 2</View>
  <View style={styles.card}>Card 3</View>
</ResponsiveGrid>
```

### 7. HighlightText
Text component that highlights search terms.

```tsx
import { HighlightText } from '../components/common';

<HighlightText
  text="This is a sample text"
  searchTerm="sample"
  style={styles.text}
/>
```

### 8. Sidebar ⭐ NEW
A role-based navigation sidebar component that shows different menu items based on user role.

```tsx
import { Sidebar } from '../components/common';

<Sidebar
  userRole="ADMIN"
  activeSection="ViewDashboard"
  onSectionChange={handleSectionChange}
  companyName="SmartProCare"
  userName="John Doe"
  userRoleDisplay="Administrator"
  onClose={() => setShowSidebar(false)}
/>
```

**Role-based Menu Items:**
- **ADMIN**: Dashboard, Users, Leads, Property, Notes/Event, Calling Data, Account, Logout
- **USER**: Dashboard, Leads, Property, Notes/Event, Calling Data, Account, Logout
- **DEVELOPER**: Dashboard, Add Company, View Company, Add Admin/Users, View Admin, View Directors, View Users, Account, Logout
- **DIRECTOR**: Dashboard, Admins, Users, Leads, Property, Notes/Event, Calling Data, Account, Logout

### 9. Topbar ⭐ NEW
A header component with hamburger menu, search, notifications, and user profile.

```tsx
import { Topbar } from '../components/common';

<Topbar
  userName="John Doe"
  userRole="ADMIN"
  companyName="SmartProCare"
  onAddAction={handleAddAction}
  onSectionChange={handleSectionChange}
  onSidebarToggle={() => setShowSidebar(true)}
/>
```

**Features:**
- **Hamburger Menu**: Toggle sidebar visibility
- **Role-based Add Menu**: Different add options based on user role
- **Search Bar**: Integrated search functionality
- **Notifications**: Notification bell with badge
- **User Profile**: User info and avatar
- **Responsive Design**: Adapts to mobile and desktop layouts

## Usage Examples

### Complete Dashboard with Sidebar and Topbar

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import {
  Sidebar,
  Topbar,
  ResponsiveContainer,
  ThreeDotMenu,
  ConfirmModal,
  CustomAlert,
  NotificationDropdown
} from '../components/common';

export default function DashboardScreen() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState('ViewDashboard');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSectionChange = (section: string) => {
    if (section === 'logout') {
      // Handle logout
      return;
    }
    setActiveSection(section);
    setShowSidebar(false); // Close sidebar on mobile
  };

  const handleAddAction = (action: string) => {
    console.log('Add action:', action);
    // Navigate to appropriate form
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'ViewDashboard':
        return (
          <View style={styles.dashboardContent}>
            <Text style={styles.welcomeText}>Welcome to your Dashboard!</Text>
            {/* Dashboard content */}
          </View>
        );
      
      case 'ViewLead':
        return (
          <ResponsiveContainer title="Leads Management" icon="document-text-outline">
            <Text>Leads content here</Text>
          </ResponsiveContainer>
        );
      
      // Add more sections as needed
      
      default:
        return (
          <ResponsiveContainer title="Dashboard" icon="home-outline">
            <Text>Select a section from the sidebar</Text>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Topbar with hamburger menu */}
      <Topbar
        userName="John Doe"
        userRole="ADMIN"
        companyName="SmartProCare"
        onAddAction={handleAddAction}
        onSectionChange={setActiveSection}
        onSidebarToggle={() => setShowSidebar(true)}
      />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Mobile Sidebar Modal */}
      <Modal
        visible={showSidebar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSidebar(false)}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              userRole="ADMIN"
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              companyName="SmartProCare"
              userName="John Doe"
              userRoleDisplay="Administrator"
              onClose={() => setShowSidebar(false)}
            />
          </View>
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            onPress={() => setShowSidebar(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
  },
  dashboardContent: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
  },
  sidebarBackdrop: {
    flex: 1,
  },
});
```

## Role-Based Navigation

The Sidebar component automatically shows different menu items based on the user's role:

### ADMIN Role
- Full access to all features
- Can manage users, leads, properties, notes, and tasks
- Access to account settings

### USER Role
- Limited access to core features
- Can manage leads, properties, and notes
- Access to account settings

### DEVELOPER Role
- System-level access
- Can manage companies, admins, and users
- Full administrative capabilities

### DIRECTOR Role
- High-level management access
- Can view admins and users
- Access to all business features

## Styling

All components use consistent styling that matches the crm-frontend design system:

- **Colors**: Consistent color palette with primary, secondary, and danger colors
- **Spacing**: Standard spacing scale (4, 8, 12, 16, 20, 24, 32)
- **Typography**: Consistent font sizes and weights
- **Shadows**: Subtle shadows with proper elevation for Android
- **Borders**: Consistent border radius and colors

## Platform Considerations

- **iOS**: Uses native shadows and animations
- **Android**: Uses elevation for shadows
- **Cross-platform**: Consistent behavior across both platforms

## Dependencies

These components require:
- `@expo/vector-icons` for icons
- React Native core components
- TypeScript for type safety

## Migration from Web

When migrating from crm-frontend web components:

1. Replace `className` with `style` props
2. Use React Native components instead of HTML elements
3. Adapt CSS classes to StyleSheet objects
4. Replace web-specific event handlers with React Native equivalents
5. Use React Native's Modal component instead of CSS-based modals
6. Implement mobile-specific navigation patterns
