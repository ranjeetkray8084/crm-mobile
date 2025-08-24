# AdminSection Component

The AdminSection component is a React Native component that provides comprehensive admin management functionality, mirroring the web CRM frontend's AdminSection component.

## Features

### Role-Based Access Control
- **DEVELOPER**: Can view all admins across all companies
- **DIRECTOR**: Can view all admins in their company
- **ADMIN**: Read-only access to admin information
- **USER**: No access to admin management

### Admin Management Operations
- **View Admins**: Display admin information in card format
- **Activate/Revoke Admins**: Toggle admin status
- **Search Admins**: Real-time search functionality
- **Company Information**: View admin company associations

### UI Features
- **Responsive Design**: Optimized for mobile devices
- **Loading States**: Skeleton loading animations
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data is available
- **Search Functionality**: Filter admins by name, email, phone, or company

## Usage

### Basic Implementation

```tsx
import React from 'react';
import { View } from 'react-native';
import { AdminSection } from '../../components';

const MyScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <AdminSection />
    </View>
  );
};

export default MyScreen;
```

### With Custom Styling

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdminSection } from '../../components';

const MyScreen = () => {
  return (
    <View style={styles.container}>
      <AdminSection />
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
- `useAdmins` - Admin management operations
- `useAuth` - Authentication context

### Required Services
- `AdminService` - Backend API calls

### Required Utils
- `customAlert` - User notifications

## Component Structure

```
AdminSection
├── Header
│   ├── Title with Icon
│   └── Search Input
├── Content
│   ├── Loading Skeleton
│   ├── Error Display
│   ├── Empty State
│   └── Admin Cards
└── Admin Cards
    ├── Admin Header
    │   ├── Admin Name
    │   └── Action Buttons
    └── Admin Details
        ├── User ID
        ├── Email
        ├── Phone
        ├── Company
        ├── Status Badge
        └── Actions
```

## Admin Card Actions

### Action Buttons
- **Activate Admin** (🛡️): Activates inactive admins
- **Revoke Admin** (🛡️): Deactivates active admins

### Status Badges
- **Active**: Green badge with "Active" text
- **Inactive**: Red badge with "Inactive" text

### Company Information
- **Company Name**: Displays associated company
- **No Company**: Shows when admin has no company association

## Search Functionality

The search input filters admins in real-time based on:
- Admin name
- Email address
- Phone number
- Company name

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

### No Admins Found
- Shows when no admins exist
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
- Bulk admin operations
- Advanced filtering options
- Export functionality
- Admin activity tracking
- Audit logging
- Admin assignment management

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
