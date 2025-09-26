# 📱 LeadsTracker - React Native CRM Application

A comprehensive Customer Relationship Management (CRM) mobile application built with React Native and Expo, designed for efficient lead management, property tracking, and business operations.

## 🚀 Quick Start

### **⚡ 5-minute Setup**

```bash
# 1. Install dependencies
npm install
npm run install-device-info

# 2. Test setup
npm run test-setup

# 3. Run the app (use physical device)
npx expo run:android --device    # Android (recommended)
npx expo run:ios --device        # iOS
npx expo start --clear          # Development server only
```

### **🔧 Windows Users**
Use the provided batch file:
```cmd
run-app.bat
```

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Production Build](#-production-build)
- [API Configuration](#-api-configuration)
- [Components Guide](#-components-guide)
- [Excel Export System](#-excel-export-system)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Project Overview

LeadsTracker is a production-ready mobile CRM application that provides:
- **Lead Management**: Create, track, and manage sales leads
- **Property Management**: Manage real estate properties and inventory
- **Task Management**: Organize and track business tasks
- **User Management**: Role-based access control and user administration
- **Notes & Events**: Comprehensive note-taking and event scheduling
- **Dashboard Analytics**: Business insights and statistics
- **Excel Export**: Export data to Excel format
- **Push Notifications**: Real-time notifications system

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (DEVELOPER, DIRECTOR, ADMIN, USER)
- Secure token management
- Multi-device logout functionality

### 📊 Core Modules
- **Leads**: Lead creation, tracking, status management, assignment
- **Properties**: Property listings, status updates, filtering, search
- **Tasks**: Task creation, assignment, progress tracking
- **Notes**: Note-taking with priority levels and visibility settings
- **Events**: Event scheduling and management
- **Users**: User management and role administration
- **Companies**: Multi-company support
- **Announcements**: Company-wide announcements

### 📱 User Experience
- Responsive design for all screen sizes
- Offline-capable authentication
- Real-time data synchronization
- Pull-to-refresh functionality
- Search and filtering capabilities
- Dark/Light theme support

### 📈 Analytics & Reporting
- Dashboard with key metrics
- Role-based statistics
- Export functionality (Excel)
- Data visualization
- Performance tracking

## 🛠 Tech Stack

### **Framework & Core**
- **React Native** - Mobile framework
- **Expo SDK 53** - Development platform
- **TypeScript/JavaScript** - Programming languages
- **Expo Router** - File-based navigation

### **State Management & Data**
- **React Context** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence

### **UI & Styling**
- **NativeWind** - Tailwind CSS for React Native
- **Expo Vector Icons** - Icon library
- **React Native Safe Area Context** - Safe area handling

### **Notifications & Background**
- **Firebase Cloud Messaging** - Push notifications
- **Expo Notifications** - Local notifications
- **Background tasks** - Background processing

### **File Management**
- **Expo File System** - File operations
- **Expo Sharing** - File sharing
- **XLSX** - Excel file generation
- **Expo Media Library** - Media management

### **Build & Deployment**
- **EAS Build** - Cloud builds
- **EAS Submit** - App store submission
- **Expo Dev Client** - Development builds

## 📁 Project Structure

```
CRMNativeExpo/
├── app/                          # App screens (Expo Router)
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx             # Dashboard
│   │   ├── leads.tsx             # Leads screen
│   │   ├── property.tsx          # Properties screen
│   │   ├── notes.tsx             # Notes screen
│   │   └── tasks.tsx             # Tasks screen
│   ├── _layout.tsx               # Root layout
│   ├── login.tsx                 # Authentication
│   ├── add-lead.tsx              # Add lead screen
│   ├── add-property.tsx          # Add property screen
│   ├── add-task.tsx              # Add task screen
│   └── view-companies.tsx        # Companies view
├── src/                          # Source code
│   ├── components/               # Reusable components
│   │   ├── common/               # Common components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── leads/                # Lead components
│   │   ├── property/             # Property components
│   │   ├── notes/                # Notes & events components
│   │   ├── tasks/                # Task components
│   │   ├── users/                # User management components
│   │   ├── admins/               # Admin components
│   │   ├── directors/            # Directors components
│   │   ├── forms/                # Form components
│   │   └── modals/               # Modal components
│   ├── core/                     # Core utilities
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/             # API services
│   │   ├── utils/                # Utility functions
│   │   └── config/               # Configuration
│   ├── shared/                   # Shared resources
│   │   └── contexts/             # React contexts
│   └── legacy/                   # Legacy code
├── assets/                       # Static assets
├── android/                      # Android-specific files
├── ios/                         # iOS-specific files (future)
└── docs/                        # Documentation
```

## 🔧 Development

### **Prerequisites**
- Node.js (18.19.0 or later)
- npm or yarn
- Physical device (iOS/Android)
- Expo CLI
- EAS CLI (for builds)

### **Development Commands**

```bash
# Start development server
npm start                    # Expo start with cache clear
npm run android             # Run on Android device
npm run ios                # Run on iOS device
npm run web                # Run on web browser

# Maintenance
npm run clear-cache        # Clear Expo cache
npm run reset-cache        # Reset Expo cache
npm run lint              # Run ESLint

# Testing & Setup
npm run test-setup         # Verify installation
npm run install-device-info # Install device info
```

### **Environment Setup**

1. **Install Dependencies**
   ```bash
   npm install
   npm run install-device-info
   ```

2. **Configure API Endpoint**
   ```bash
   node change-api-ip.js auto  # Auto-detect IP
   # or
   node change-api-ip.js backend.leadstracker.in  # Manual IP
   ```

3. **Test Setup**
   ```bash
   npm run test-setup
   ```

### **Development Best Practices**

- Use physical devices (not emulators) for testing
- Enable USB debugging (Android)
- Trust device (iOS)
- Ensure stable internet connection
- Use development build for testing native features

## 🏗 Production Build

### **Quick Production Build**

```bash
# One-command build
npm run build:production

# Or manual build
npm run build:android        # Production APK
npm run build:android-preview # Preview APK
```

### **EAS Build Configuration**

The app uses EAS (Expo Application Services) for builds:

- **Production Profile**: Optimized, release-ready APK
- **Preview Profile**: Testing builds with development features
- **Development Profile**: Full development builds

### **Build Profiles**

```json
{
  "production": {
    "distribution": "internal",
    "android": { "buildType": "apk" },
    "ios": { "buildConfiguration": "Release" }
  },
  "preview": {
    "distribution": "internal",
    "android": { "buildType": "apk" }
  }
}
```

### **Pre-Build Checklist**

1. ✅ Login to Expo: `eas login`
2. ✅ Clear cache: `npm run clear-cache`
3. ✅ Install dependencies: `npm install`
4. ✅ Test on device
5. ✅ Verify API endpoints
6. ✅ Check app.config.js settings

### **Build Process**

1. **Prepare App**
   ```bash
   npm run clear-cache
   npm install
   npm run lint
   ```

2. **Start Build**
   ```bash
   npm run build:android  # Production APK
   ```

3. **Monitor Progress**
   - Build processed on EAS servers
   - Typical build time: 10-20 minutes
   - Email notification when complete

4. **Download & Test**
   - Download APK from provided link
   - Test on physical devices
   - Verify all features work correctly

## 🌐 API Configuration

### **Backend Integration**

The app connects to a Spring Boot backend API:
- **Production URL**: `https://backend.leadstracker.in`
- **Local Development**: Configure with `change-api-ip.js`

### **API Endpoints**

```javascript
// Main API endpoints
const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register'
  },
  
  // Leads Management
  LEADS: {
    GET_ALL: (companyId) => `/api/companies/${companyId}/leads`,
    CREATE: (companyId) => `/api/companies/${companyId}/leads`,
    UPDATE: (companyId, leadId) => `/api/companies/${companyId}/leads/${leadId}`,
    DELETE: (companyId, id) => `/api/companies/${companyId}/leads/${id}`
  },
  
  // Properties Management
  PROPERTIES: {
    GET_ALL: (companyId) => `/api/companies/${companyId}/properties`,
    CREATE: (companyId) => `/api/companies/${companyId}/properties`,
    UPDATE: (companyId, propertyId) => `/api/companies/${companyId}/properties/${propertyId}`
  }
  
  // ... other endpoints
};
```

### **Network Configuration**

For local development, ensure:
- Backend server running on port 8083
- Phone and computer on same WiFi network
- Firewall allows connections
- HTTPS configured for production

### **API Configuration Commands**

```bash
# Auto-detect local IP
node change-api-ip.js auto

# Set specific IP
node change-api-ip.js 192.168.1.100

# Set production
node change-api-ip.js production
```

## 🧩 Components Guide

### **Core Components**

#### **Dashboard System**
- `DashboardStats.tsx` - Role-based statistics display
- `DashboardEvents.tsx` - Today's events display
- `DashboardFollowUps.tsx` - Follow-ups management

Features:
- Role-based access (DEVELOPER, DIRECTOR, ADMIN, USER)
- Real-time statistics
- Loading states and error handling
- Responsive design with gradient cards

#### **Leads Management**
- `LeadsSection.tsx` - Main leads interface
- `LeadCard.tsx` - Individual lead display
- `LeadDetails.tsx` - Detailed lead view
- `AddLeadForm.tsx` - Lead creation form

Features:
- Lead lifecycle management (NEW, CONTACTED, CLOSED)
- Assignment and filtering
- Search functionality
- Export capabilities

#### **Properties Management**
- `PropertiesSection.tsx` - Main properties interface
- `PropertyCard.tsx` - Property display cards
- `AddPropertyForm.tsx` - Property creation
- `PropertyFilters.tsx` - Advanced filtering

Features:
- Property status tracking
- Price and location filtering
- BHK and type categorization
- Owner contact management

#### **Notes & Events System**
- `NotesSection.tsx` - Notes management interface
- `NoteCard.tsx` - Individual note/event cards
- `AddNoteModal.tsx` - Note/event creation
- `VisibilitySelector.tsx` - Visibility controls

Features:
- Dual type support (Notes and Events)
- Priority levels (A, B, C)
- Status management (NEW, PROCESSING, COMPLETED)
- Role-based visibility controls
- Event scheduling with date/time picker

#### **User Management**
- `UserSection.tsx` - User management interface
- `AdminSection.tsx` - Admin management
- `DirectorsSection.tsx` - Directors view
- `AccountSection.tsx` - User account settings

Features:
- Role-based access control
- User activation/deactivation
- Profile management
- Company associations

### **Common Components**

#### **UI Components**
- `CompanyCard.tsx` - Company display cards
- `UserCard.tsx` - User information cards
- `NotificationCard.tsx` - Notification display
- `FloatingActionButton.tsx` - Floating action buttons

#### **Navigation & Layout**
- `Sidebar.tsx` - Navigation sidebar
- `TabScreenWrapper.tsx` - Tab screen wrapper
- `AuthGuard.tsx` - Route protection

#### **Modals & Forms**
- `ConfirmModal.tsx` - Confirmation dialogs
- `StatusUpdateModal.tsx` - Status update interface
- Various add/edit forms for different entities

### **Utility Components**

#### **File & Export**
- `ExportButton.tsx` - Excel export functionality
- `FileUpload.tsx` - File upload handling
- `ImagePicker.tsx` - Image selection

#### **Notifications**
- `NotificationHandler.tsx` - Push notification handling
- `NotificationPermissionRequest.tsx` - Permission requests
- `NotificationDropdown.tsx` - Notification display

## 📊 Excel Export System

### **Export Capabilities**

The app provides comprehensive Excel export functionality:

- ✅ **Leads Export** - All lead data with proper formatting
- ✅ **Properties Export** - Property listings and details
- ✅ **Role-based Exports** - Different data based on user role
- ✅ **Custom Exports** - Flexible column configuration
- ✅ **Backend Integration** - Server-side processing
- ✅ **Direct Download** - Save to device Downloads folder

### **Export Features**

#### **Data Processing**
- Automatic data formatting (dates, currency, status)
- Nested object handling
- Role-based column filtering
- Data validation and cleanup

#### **File Management**
- XLSX format generation
- Timestamped filenames
- Direct download to Downloads folder
- Native sharing integration

#### **User Experience**
- Progress indicators
- Success/error notifications
- Multiple export options
- Intuitive interface

### **Usage Examples**

#### **Leads Export**
```javascript
import { exportLeadsWithRoleAndDownload } from '../core/utils/excelExport';

const handleExportLeads = async () => {
  try {
    const result = await exportLeadsWithRoleAndDownload(
      leads, 
      userRole, 
      'leads_export'
    );
    
    if (result.success) {
      Alert.alert('Success', result.message);
    }
  } catch (error) {
    Alert.alert('Export Failed', error.message);
  }
};
```

#### **Properties Export**
```javascript
import { exportPropertiesWithRoleAndDownload } from '../core/utils/excelExport';

const handleExportProperties = async () => {
  try {
    const result = await exportPropertiesWithRoleAndDownload(
      properties,
      userRole,
      'properties_export'
    );
  } catch (error) {
    console.error('Export error:', error);
  }
};
```

#### **Backend Export**
```javascript
import { exportLeadsFromBackend } from '../core/utils/backendExcelExport';

const handleBackendExport = async () => {
  const result = await exportLeadsFromBackend({
    companyId: companyId,
    userRole: userRole,
    userId: userId
  });
};
```

### **Export Formats**

#### **Leads Export Columns**
- Lead Name, Phone, Email, Status
- Budget, Requirement, Location, Source
- Created Date, Assigned To, Created By
- Notes, Follow-up Date, Priority

#### **Properties Export Columns**
- Property Name, Status, Type, Price
- Location, Sector, BHK, Unit Details
- Floor, Owner Contact, Source
- Created Date, Created By, Size, Address

### **Role-Based Export**

Different user roles see different data columns:

- **DIRECTOR**: All available columns including sensitive data
- **ADMIN**: Most columns with some restrictions
- **USER**: Limited columns based on assignments and permissions

## 🔔 Push Notifications

### **Notification System**

The app implements a comprehensive push notification system:

#### **Firebase Cloud Messaging**
- Real-time message delivery
- Device token management
- Multi-device support
- Background notifications

#### **Local Notifications**
- Event reminders
- Task deadlines
- Follow-up alerts
- System notifications

#### **Notification Features**
- Role-based notification routing
- Custom notification sounds
- Action buttons in notifications
- Notification history
- Badge count management

### **Implementation**

```javascript
// Notification service usage
import NotificationService from '../core/services/NotificationService';

// Register for notifications
await NotificationService.registerForPushNotifications();

// Send notification
await NotificationService.sendNotification({
  title: 'New Lead',
  body: 'A new lead has been assigned to you',
  data: { leadId: '123' }
});
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Setup Issues**

**Build Fails**
```bash
npm run clear-cache
npm run build:android
```

**Not Logged Into Expo**
```bash
eas login
```

**Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
npm run install-device-info
```

#### **Network Issues**

**Connection Refused**
- Check if backend is running on port 8083
- Verify IP address configuration
- Check firewall settings
- Ensure same network connectivity

**API Timeout**
- Verify network connectivity
- Check API endpoint configuration
- Test with curl or Postman
- Restart development server

#### **Device Issues**

**App Not Installing**
- Enable USB debugging (Android)
- Trust developer (iOS)
- Check device compatibility
- Use physical device (not emulator)

**Notifications Not Working**
- Check notification permissions
- Verify Firebase configuration
- Test push notification service
- Check device notification settings

### **Development Tips**

1. **Use Physical Devices**: Always test on real devices
2. **Check Console Logs**: Monitor console for errors
3. **Network Debugging**: Use React Native Debugger
4. **State Inspection**: Use React DevTools
5. **API Testing**: Test endpoints independently

### **Performance Optimization**

#### **Memory Management**
- Proper cleanup in useEffect hooks
- Efficient state updates
- Avoid memory leaks
- Optimize image handling

#### **Network Optimization**
- Implement request caching
- Use pagination for large datasets
- Optimize API response sizes
- Handle offline scenarios

#### **UI Optimization**
- Lazy load components
- Implement virtual scrolling
- Optimize re-renders
- Use proper key props in lists

## 📱 Device Requirements

### **Minimum Requirements**
- **Android**: API level 24 (Android 7.0) or higher
- **iOS**: iOS 13.0 or higher
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 100MB available space
- **Network**: Internet connection required

### **Recommended Specifications**
- **Android**: API level 28+ (Android 9.0+)
- **iOS**: iOS 14.0+
- **RAM**: 4GB or more
- **Storage**: 500MB available space
- **Network**: WiFi or stable mobile data

### **Testing Devices**
- Physical devices required (not emulators)
- USB debugging enabled (Android)
- Developer mode enabled
- Trusted developer certificates (iOS)

## 🤝 Contributing

### **Development Workflow**

1. **Fork & Clone**
   ```bash
   git clone https://github.com/ranjeetkray8084/crm-mobile.git
   cd CRMNativeExpo
   ```

2. **Setup Development Environment**
   ```bash
   npm install
   npm run install-device-info
   npm run test-setup
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Development**
   ```bash
   npm run android  # Test on Android
   npm run lint     # Check code quality
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

### **Code Standards**

- Follow ESLint configuration
- Use TypeScript for new components
- Follow existing component patterns
- Write descriptive commit messages
- Add appropriate error handling
- Include console logging for debugging

### **Testing Guidelines**

- Test on multiple devices
- Test different user roles
- Test offline scenarios
- Test edge cases
- Verify API integration
- Check performance impact

## 📄 License

This project is part of the LeadsTracker CRM system and follows the project's licensing terms.

## 📞 Support

For issues, questions, or support:

1. **Check Documentation**: Review this README and inline code comments
2. **Check Troubleshooting**: Review the troubleshooting section
3. **GitHub Issues**: Create an issue on the repository
4. **Development Team**: Contact the development team

## 🎯 Project Status

**Current Version**: 1.0.1  
**Status**: Production Ready  
**Last Updated**: January 2024

### **Recent Updates**
- ✅ Enhanced Excel export system
- ✅ Improved notification handling
- ✅ Role-based access refinements
- ✅ Performance optimizations
- ✅ UI/UX improvements
- ✅ Bug fixes and stability improvements

### **Roadmap**
- 🔄 Calendar integration for events
- 🔄 Advanced analytics dashboard
- 🔄 Offline data synchronization
- 🔄 Advanced search and filtering
- 🔄 Bulk operations
- 🔄 Integration with external systems

---

**🚀 Built with ❤️ for efficient CRM management**