# Login Data Structure - CRM Frontend vs Leadstracker

## Overview
This document outlines the exact data structure that is stored during login in both the crm-frontend (web) and Leadstracker (mobile) projects.

## Data Stored During Login

### 1. User Data Object
Both projects store the following user data structure:

```javascript
const user = {
  userId: response.data.userId || response.data.id,  // Primary user identifier
  email: response.data.email,                        // User's email address
  name: response.data.name,                          // User's full name
  role: response.data.role,                          // User's role (ADMIN, USER, DEVELOPER, etc.)
  companyName: response.data.companyName,            // Company name
  companyId: response.data.companyId,                // Company identifier
  img: response.data.avatar || response.data.img,    // User avatar/image
};
```

### 2. Session Keys
Both projects use the same session key structure:

```javascript
static SESSION_KEYS = {
  TOKEN: 'token',                    // JWT authentication token
  USER: 'user',                      // User data object
  CURRENT_TASK: 'currentTaskId',     // Current task identifier
  EXCEL_STATE: 'excelEditorState',   // Excel editor state
  LAST_ROUTE: 'lastRoute'            // Last visited route
};
```

### 3. Storage Implementation

#### crm-frontend (Web)
- **Storage**: `localStorage`
- **Method**: `localStorage.setItem(key, JSON.stringify(value))`
- **Retrieval**: `localStorage.getItem(key)`

#### Leadstracker (Mobile)
- **Storage**: `AsyncStorage` (React Native)
- **Method**: `await AsyncStorage.setItem(key, JSON.stringify(value))`
- **Retrieval**: `await AsyncStorage.getItem(key)`

### 4. Data Validation
Both projects implement identical validation:

```javascript
// Essential user data validation
if (!user.userId || !user.role) {
  return {
    success: false,
    error: 'Incomplete user data received from server'
  };
}

// Company validation for non-DEVELOPER roles
if (user.role !== 'DEVELOPER' && !user.companyId) {
  return {
    success: false,
    error: 'Company information missing for user'
  };
}
```

### 5. Authentication Flow

#### Login Process
1. **API Call**: POST to `/api/auth/login`
2. **Response Processing**: Extract token and user data
3. **Validation**: Check essential fields
4. **Storage**: Save to AsyncStorage/localStorage
5. **Axios Configuration**: Set Authorization header
6. **Context Update**: Update React context state

#### Session Management
- **Token Storage**: JWT token stored for API authentication
- **User Data**: Complete user profile stored locally
- **Auto-logout**: Token expiration handling
- **Session Refresh**: Automatic token refresh capability

### 6. Error Handling
Both projects handle the same error scenarios:

- **Network Errors**: Connection failures
- **Validation Errors**: Missing required fields
- **Authentication Errors**: Invalid credentials
- **Account Status**: Deactivated accounts (403 status)
- **Server Errors**: Backend failures

### 7. Security Features
- **Token-based Authentication**: JWT tokens
- **Secure Storage**: AsyncStorage/localStorage
- **Auto-logout**: On token expiration
- **Session Validation**: Regular token validation
- **Secure Headers**: Authorization headers for API calls

## Implementation Notes

### crm-frontend
- Uses `localStorage` for web browser storage
- Synchronous storage operations
- Web-specific error handling
- Browser-based session management

### Leadstracker
- Uses `AsyncStorage` for React Native
- Asynchronous storage operations
- Mobile-specific error handling
- Native app session management

## Data Consistency
Both projects now maintain **100% data consistency** in:
- User data structure
- Session key names
- Validation logic
- Error handling
- Authentication flow
- Security measures

This ensures seamless data synchronization between web and mobile platforms.
