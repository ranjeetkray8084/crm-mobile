# CRM Native Expo - Login System Implementation

This document describes the complete login system implementation in CRMNativeExpo, which mirrors the authentication system from crm-frontend with React Native optimizations.

## 🚀 Features

### Authentication Features
- **User Login**: Email and password authentication
- **Session Management**: Automatic token storage and retrieval
- **Password Reset**: OTP-based password reset functionality
- **Auto-logout**: Automatic logout on token expiration
- **Secure Storage**: Uses AsyncStorage for secure data persistence

### UI/UX Features
- **Modern Design**: Clean, professional interface with consistent branding
- **Responsive Layout**: Optimized for mobile devices
- **Interactive Elements**: Smooth animations and touch feedback
- **Accessibility**: Proper contrast and touch targets
- **Error Handling**: User-friendly error messages and validation

## 🏗️ Architecture

### File Structure
```
CRMNativeExpo/
├── app/
│   ├── _layout.tsx          # Root layout with AuthProvider
│   ├── index.tsx            # Authentication routing
│   ├── login.tsx            # Login screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab layout with logout
│       ├── index.tsx        # Home screen with user info
│       ├── crm.tsx          # CRM dashboard
│       └── explore.tsx      # Search and explore
├── src/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.js      # Authentication service
│   │   │   └── api.endpoints.js     # API endpoints
│   │   └── hooks/
│   │       └── useAuth.js           # Authentication hook
│   ├── shared/
│   │   └── contexts/
│   │       └── AuthContext.jsx      # Authentication context
│   └── legacy/
│       └── api/
│           └── axios.js             # HTTP client configuration
└── app.config.js                    # App configuration
```

### Core Components

#### 1. AuthService (`src/core/services/auth.service.js`)
- Handles all authentication API calls
- Manages session storage using AsyncStorage
- Provides login, logout, OTP, and password reset functionality
- Automatic token management and validation

#### 2. AuthContext (`src/shared/contexts/AuthContext.jsx`)
- Global authentication state management
- Provides authentication methods to all components
- Handles user session persistence
- Automatic user loading on app start

#### 3. useAuth Hook (`src/core/hooks/useAuth.js`)
- React hook for authentication functionality
- Provides user state, loading states, and auth methods
- Handles authentication flow and error states

#### 4. Login Screen (`app/login.tsx`)
- Beautiful, responsive login interface
- Form validation and error handling
- Password reset flow with OTP
- Modern UI with smooth animations

## 🔧 Configuration

### API Configuration
Update the API base URL in `app.config.js`:

```javascript
export default {
  expo: {
    // ... other config
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://your-api-url.com',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development'
    }
  }
};
```

### Environment Variables
Create a `.env` file in the root directory:

```bash
API_BASE_URL=http://your-backend-url.com
NODE_ENV=development
```

## 📱 Screens

### 1. Login Screen (`/login`)
- **Email/Password Input**: Clean form with validation
- **Password Toggle**: Show/hide password functionality
- **Forgot Password**: OTP-based password reset
- **Modern Design**: Professional appearance with brand colors

### 2. Home Screen (`/(tabs)/`)
- **User Welcome**: Personalized greeting with user info
- **Quick Actions**: Common CRM tasks
- **Recent Activity**: Latest user actions
- **Statistics**: Overview of key metrics

### 3. CRM Dashboard (`/(tabs)/crm`)
- **Leads Management**: View and manage leads
- **Task Overview**: Active tasks and priorities
- **Quick Actions**: Common CRM operations
- **Performance Metrics**: Conversion rates and statistics

### 4. Explore Screen (`/(tabs)/explore`)
- **Search Functionality**: Global search across CRM data
- **Quick Filters**: Filter by data type
- **Search Results**: Relevant results with context
- **Recent Items**: Quick access to recent data

## 🔐 Security Features

### Token Management
- JWT tokens stored securely in AsyncStorage
- Automatic token refresh and validation
- Secure logout with token cleanup

### Data Protection
- Input sanitization and validation
- Secure API communication with HTTPS
- Automatic session expiration handling

### Error Handling
- Graceful error handling for network issues
- User-friendly error messages
- Automatic retry mechanisms

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Professional blue theme (#1c69ff)
- **Typography**: Clear, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using 8px grid system
- **Shadows**: Subtle shadows for depth and modern feel

### Components
- **Cards**: Elevated content containers with rounded corners
- **Buttons**: Interactive elements with proper touch targets
- **Inputs**: Clean form inputs with icons and validation
- **Navigation**: Intuitive tab-based navigation

### Responsiveness
- **Mobile First**: Optimized for mobile devices
- **Touch Friendly**: Proper touch target sizes
- **Keyboard Handling**: Smooth keyboard interactions
- **Orientation**: Support for portrait and landscape

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- React Native development environment

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Configuration
1. Update API endpoints in `src/core/services/api.endpoints.js`
2. Configure backend URL in `app.config.js`
3. Set up environment variables
4. Test authentication flow

## 🔄 API Integration

### Authentication Endpoints
```javascript
// Login
POST /api/auth/login
Body: { email, password }

// Send OTP
POST /api/auth/send-otp
Params: { email }

// Verify OTP
POST /api/auth/verify-otp
Params: { email, otp }

// Reset Password
POST /api/auth/reset-password-with-otp
Params: { email, newPassword }

// Logout
GET /api/auth/logout
```

### Response Format
```javascript
// Success Response
{
  success: true,
  data: { ... },
  user: { ... },
  token: "jwt_token_here"
}

// Error Response
{
  success: false,
  error: "Error message"
}
```

## 🧪 Testing

### Manual Testing
1. **Login Flow**: Test with valid/invalid credentials
2. **Password Reset**: Test OTP functionality
3. **Session Persistence**: Test app restart with saved session
4. **Error Handling**: Test network errors and validation

### Automated Testing
```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Fails
- Check API base URL configuration
- Verify backend is running and accessible
- Check network connectivity

#### 2. Session Not Persisting
- Verify AsyncStorage permissions
- Check storage key consistency
- Clear app data and retry

#### 3. UI Rendering Issues
- Check Expo SDK version compatibility
- Verify all dependencies are installed
- Clear Metro bundler cache

### Debug Mode
Enable debug mode in `app.config.js`:

```javascript
extra: {
  debug: true
}
```

## 📚 Additional Resources

### Documentation
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [AsyncStorage Documentation](https://docs.expo.dev/versions/latest/sdk/async-storage/)

### Related Projects
- **crm-frontend**: Web version of the CRM system
- **crm-backend**: Backend API implementation

## 🤝 Contributing

### Development Guidelines
1. Follow existing code style and patterns
2. Add proper TypeScript types
3. Include error handling
4. Test on multiple devices
5. Update documentation

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow React Native best practices
- Use consistent naming conventions

## 📄 License

This project is part of the CRM system and follows the same licensing terms.

---

**Note**: This login system is designed to work seamlessly with the existing crm-frontend backend. Ensure your backend API endpoints match the expected format and authentication flow.
