# AccountSection Component

## Overview
The `AccountSection` component is a React Native component that provides a complete account management interface for users. It replicates the functionality and UI design from the web version of the CRM application, adapted for mobile use.

## Features

### 🔐 User Authentication
- Integrates with the existing `useAuth` context
- Automatically loads user data on component mount
- Handles authentication state changes

### 👤 Profile Management
- **View Profile**: Display current user information in read-only mode
- **Edit Profile**: Toggle edit mode to modify user details
- **Save Changes**: Update user profile with backend validation
- **Cancel Changes**: Revert to original values without saving

### 📱 Avatar Management
- **Profile Picture Display**: Shows current user avatar or default image
- **Image Upload**: Camera icon button for avatar upload
- **Image Picker Integration**: Uses `expo-image-picker` for native image selection
- **Preview**: Immediate preview of selected image before upload
- **Backend Integration**: Uploads avatar to server via `UserService.uploadAvatar`

### 📝 Form Fields
- **Full Name**: Editable text input
- **Email Address**: Editable email input with validation
- **Phone Number**: Editable phone input with phone keyboard
- **Role**: Read-only display of user role

### 🎨 UI/UX Features
- **Responsive Design**: Adapts to different screen sizes
- **Modern Card Layout**: Clean, shadow-based design
- **Color-coded Buttons**: 
  - Blue for edit actions
  - Green for save actions
  - Gray for cancel actions
- **Loading States**: Loading spinner during API calls
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for successful operations

## Dependencies

### Required Packages
```json
{
  "expo-image-picker": "^latest",
  "expo-image": "^latest",
  "@expo/vector-icons": "^latest"
}
```

### Core Services
- `UserService` - For API operations
- `useAuth` - For authentication context
- `customAlert` - For user notifications

## Usage

### Basic Implementation
```tsx
import AccountSection from './src/components/users/AccountSection';

export default function AccountPage() {
  return (
    <SafeAreaView style={styles.container}>
      <AccountSection />
    </SafeAreaView>
  );
}
```

### With Custom Styling
```tsx
import AccountSection from './src/components/users/AccountSection';

export default function AccountPage() {
  return (
    <View style={styles.container}>
      <AccountSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});
```

## API Integration

### UserService Methods Used
- `getUserById(userId)` - Fetch user profile data
- `updateProfile(userId, userData)` - Update user profile
- `getAvatar(userId)` - Fetch user avatar
- `uploadAvatar(userId, file)` - Upload new avatar

### Data Flow
1. **Component Mount**: Loads user data from auth context
2. **Profile Load**: Fetches fresh data from backend
3. **Avatar Load**: Retrieves current avatar URL
4. **Edit Mode**: Enables form editing
5. **Save Changes**: Validates and sends updates to backend
6. **Success Handling**: Updates local state and shows confirmation
7. **Error Handling**: Displays user-friendly error messages

## Styling

### Design System
- **Colors**: Uses consistent color palette matching the web version
- **Typography**: Hierarchical text sizing and weights
- **Spacing**: Consistent padding and margins throughout
- **Shadows**: Subtle elevation effects for depth
- **Borders**: Rounded corners and subtle borders

### Responsive Considerations
- **Grid Layout**: Adapts input fields to screen width
- **Touch Targets**: Adequate button sizes for mobile
- **Scroll Support**: Handles content overflow gracefully

## Error Handling

### User Input Validation
- Required field validation
- Email format validation
- Phone number validation

### API Error Handling
- Network error messages
- Backend validation errors
- Permission errors for image upload

### User Feedback
- Loading indicators during operations
- Success confirmations
- Error messages with actionable information

## Security Features

### Permission Management
- Camera roll access for avatar upload
- User authentication verification
- Role-based access control

### Data Validation
- Input sanitization
- Backend validation
- Secure file upload handling

## Performance Optimizations

### State Management
- Efficient state updates
- Minimal re-renders
- Optimized form handling

### Image Handling
- Compressed image uploads
- Lazy loading of avatars
- Efficient image picker integration

## Testing Considerations

### Component Testing
- Unit tests for form validation
- Integration tests with UserService
- UI component testing

### User Experience Testing
- Touch interaction testing
- Form submission flow
- Error scenario handling

## Future Enhancements

### Planned Features
- **Profile Picture Cropping**: Advanced image editing
- **Two-Factor Authentication**: Enhanced security
- **Profile Export**: Data portability
- **Social Media Integration**: Profile linking

### Technical Improvements
- **Offline Support**: Local data caching
- **Real-time Updates**: WebSocket integration
- **Advanced Validation**: Client-side validation rules
- **Accessibility**: Screen reader support

## Troubleshooting

### Common Issues
1. **Image Upload Fails**: Check camera roll permissions
2. **Profile Not Loading**: Verify authentication state
3. **Save Errors**: Check network connectivity
4. **Avatar Not Displaying**: Verify image URL format

### Debug Information
- Console logging for development
- Error boundary implementation
- User feedback for debugging

## Contributing

### Code Standards
- TypeScript for type safety
- Consistent naming conventions
- Comprehensive error handling
- Accessibility considerations

### Testing Requirements
- Unit test coverage
- Integration test scenarios
- User acceptance testing
- Performance benchmarking
