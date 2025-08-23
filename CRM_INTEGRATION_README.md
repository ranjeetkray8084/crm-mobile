# CRM Integration Guide

This document explains how to use the CRM services that have been copied from `crm-frontend` to `CRMNativeExpo`.

## What Was Copied

The following folders and files were copied from `crm-frontend/src` to `CRMNativeExpo/src`:

### Core Services (`src/core/`)
- **`services/`** - API service functions for all CRM operations
  - `auth.service.js` - Authentication services
  - `lead.service.js` - Lead management services
  - `task.service.js` - Task management services
  - `property.service.js` - Property management services
  - `user.service.js` - User management services
  - And many more...

- **`hooks/`** - React hooks for state management
  - `useLeads.js` - Hook for managing leads
  - `useTasks.js` - Hook for managing tasks
  - `useProperties.js` - Hook for managing properties
  - `useAuth.js` - Hook for authentication
  - And many more...

- **`utils/`** - Utility functions
  - `authUtils.js` - Authentication utilities
  - `avatarUtils.js` - Avatar handling utilities
  - `excelExport.js` - Excel export functionality
  - `platform.js` - Platform detection utilities

- **`config/`** - Configuration files
  - `index.js` - Main configuration
  - `security.config.js` - Security configuration
  - `mobile.config.js` - Mobile-specific configuration (newly created)

- **`middleware/`** - API middleware functions

### Shared Contexts (`src/shared/`)
- **`contexts/`** - React contexts for global state
  - `AuthContext.jsx` - Authentication context
  - `NotesContext.jsx` - Notes management context

## New CRM Tab

A new CRM tab has been added to demonstrate the integration:

- **File**: `app/(tabs)/crm.tsx`
- **Features**: 
  - Tabbed interface for Leads, Tasks, and Properties
  - Integration with the copied hooks
  - Beautiful UI with NativeWind styling

## Setup Instructions

### 1. Configure API Endpoints

Update the API base URL in `src/core/config/mobile.config.js`:

```javascript
export const mobileConfig = {
  api: {
    baseURL: 'YOUR_API_BASE_URL_HERE',
    // ... other config
  }
};
```

### 2. Install Required Dependencies

The following dependencies have been installed:
- `axios` - For HTTP requests
- `expo-constants` - For configuration management

### 3. Configure Environment Variables

Create an `app.config.js` file in the root directory:

```javascript
export default {
  expo: {
    // ... other expo config
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://your-api-url.com',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development'
    }
  }
};
```

## Usage Examples

### Using the Leads Hook

```javascript
import { useLeads } from '@/src/core/hooks/useLeads';

function MyComponent() {
  const { leads, loading, error, createLead, updateLead, deleteLead } = useLeads();
  
  // Use the hook functionality
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      {leads.map(lead => (
        <Text key={lead.id}>{lead.firstName} {lead.lastName}</Text>
      ))}
    </View>
  );
}
```

### Using the Auth Service

```javascript
import { authService } from '@/src/core/services/auth.service';

// Login
const login = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

### Using the Auth Context

```javascript
import { useAuth } from '@/src/shared/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }
  
  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
}
```

## Important Notes

1. **API Configuration**: Make sure to update the API base URL in the configuration files
2. **Authentication**: The auth services expect a JWT token system
3. **Error Handling**: All services include proper error handling
4. **Mobile Adaptations**: Some utilities may need mobile-specific adaptations
5. **Storage**: The services use AsyncStorage for React Native (configured in mobile.config.js)

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure the path aliases are correctly configured
2. **API Errors**: Check that your API endpoints are accessible
3. **Authentication Issues**: Verify your JWT token implementation
4. **Storage Issues**: Ensure AsyncStorage is properly configured

### Getting Help

- Check the original `crm-frontend` code for reference
- Review the service implementations in `src/core/services/`
- Check the hook implementations in `src/core/hooks/`

## Next Steps

1. Configure your API endpoints
2. Test the authentication flow
3. Implement additional CRM features using the available services
4. Customize the UI to match your design requirements
5. Add offline support if needed
6. Implement push notifications using the available hooks

The CRM services are now fully integrated and ready to use in your React Native/Expo application!
