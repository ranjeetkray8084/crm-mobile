# UserSection Component

The UserSection component is a React Native component that provides comprehensive user management functionality, mirroring the web CRM frontend's UsersSection component.

## Features

### Role-Based Access Control
- **DEVELOPER**: Can view all users across all companies
- **DIRECTOR**: Can view and manage all users in their company
- **ADMIN**: Can view and manage users assigned to them
- **USER**: Read-only access to user information

### User Management Operations
- **View Users**: Display user information in card format
- **Activate/Deactivate Users**: Toggle user status
- **Assign/Unassign Admins**: Manage admin assignments (DIRECTOR only)
- **Search Users**: Real-time search functionality
- **Update Users**: Edit user information (modal integration ready)

### UI Features
- **Responsive Design**: Optimized for mobile devices
- **Loading States**: Skeleton loading animations
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data is available
- **Search Functionality**: Filter users by name, email, phone, or role

## Usage

### Basic Implementation

```tsx
import React from 'react';
import { View } from 'react-native';
import { UserSection } from '../../components';

const MyScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserSection />
    </View>
  );
};

export default MyScreen;
```

### With Custom Styling

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UserSection } from '../../components';

const MyScreen = () => {
  return (
    <View style={styles.container}>
      <UserSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default MyScreen;
```

## Dependencies

### Required Hooks
- `useUsers` - User management operations
- `useAuth` - Authentication context

### Required Services
- `UserService` - Backend API calls
- `AdminService` - Admin management operations

### Required Utils
- `customAlert` - User notifications

## Component Structure

```
UserSection
├── Header
│   ├── Title with Icon
│   └── Search Input
├── Content
│   ├── Loading Skeleton
│   ├── Error Display
│   ├── Empty State
│   └── User Cards
└── User Cards
    ├── User Header
    │   ├── User Name
    │   └── Action Buttons
    └── User Details
        ├── Email
        ├── Phone
        ├── Role Badge
        ├── Status Badge
        └── Admin Assignment
```

## User Card Actions

### Action Buttons
- **Edit User** (✏️): Opens update modal (DIRECTOR, ADMIN, DEVELOPER)
- **Activate User** (✅): Activates inactive users
- **Deactivate User** (❌): Deactivates active users
- **Assign Admin** (➕): Assigns admin to user (DIRECTOR only)
- **Unassign Admin** (➖): Removes admin assignment (DIRECTOR only)

### Status Badges
- **Active**: Green badge with "Active" text
- **Inactive**: Red badge with "Inactive" text

### Role Badge
- **Role Display**: Purple badge showing user role

## Search Functionality

The search input filters users in real-time based on:
- User name
- Email address
- Phone number
- User role

## Loading States

### Skeleton Loading
- Displays while fetching data
- Shows placeholder cards with animated elements
- Provides visual feedback during API calls

### Error Handling
- Displays error messages when API calls fail
- Uses customAlert utility for notifications
- Graceful fallback for failed operations

## Empty States

### No Users Found
- Shows when no users exist
- Displays encouraging message
- Provides guidance for next steps

### No Search Results
- Shows when search returns no results
- Suggests adjusting search terms
- Maintains user engagement

## Styling

### Color Scheme
- **Primary**: #1F2937 (Dark Gray)
- **Secondary**: #6B7280 (Medium Gray)
- **Accent**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Warning**: #F59E0B (Yellow)

### Typography
- **Title**: 20px, Semi-bold
- **Subtitle**: 18px, Semi-bold
- **Body**: 14px, Regular
- **Caption**: 12px, Medium

### Spacing
- **Container Padding**: 20px
- **Card Margin**: 16px
- **Element Gap**: 8px
- **Header Margin**: 16px

## Integration Points

### Navigation
- Integrates with React Navigation
- Supports tab-based navigation
- Compatible with drawer navigation

### State Management
- Uses React hooks for local state
- Integrates with authentication context
- Supports global state management

### API Integration
- RESTful API calls through services
- Error handling and retry logic
- Loading state management

## Performance Considerations

### Optimization
- Memoized callback functions
- Efficient re-rendering
- Optimized list rendering
- Debounced search input

### Memory Management
- Proper cleanup in useEffect
- Efficient state updates
- Minimal re-renders

## Accessibility

### Screen Reader Support
- Proper accessibility labels
- Semantic markup
- VoiceOver compatibility

### Touch Targets
- Minimum 44px touch targets
- Proper spacing between elements
- Clear visual feedback

## Testing

### Component Testing
- Unit tests for individual functions
- Integration tests for API calls
- Snapshot tests for UI consistency

### User Testing
- Mobile device testing
- Different screen size testing
- Performance testing

## Future Enhancements

### Planned Features
- Bulk user operations
- Advanced filtering options
- Export functionality
- User activity tracking
- Audit logging

### Technical Improvements
- Virtual scrolling for large lists
- Offline support
- Push notifications
- Real-time updates

## Troubleshooting

### Common Issues
- **Authentication Errors**: Check user context and permissions
- **API Failures**: Verify network connectivity and API endpoints
- **Rendering Issues**: Check component dependencies and imports

### Debug Mode
- Enable console logging for debugging
- Check network requests in developer tools
- Verify state updates in React DevTools

## Support

For issues or questions:
1. Check the component documentation
2. Review the integration examples
3. Check the troubleshooting section
4. Contact the development team

## License

This component is part of the CRMNativeExpo project and follows the project's licensing terms.
