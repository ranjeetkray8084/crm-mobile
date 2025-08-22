# CRM Mobile App

A powerful mobile CRM application built with React Native and Expo, converted from the web-based CRM frontend.

## Features

### 🔐 Authentication
- Secure login with email and password
- Forgot password functionality
- AsyncStorage for persistent user sessions
- JWT token management

### 📊 Dashboard
- Overview of key metrics (leads, properties, tasks, notifications)
- Quick action buttons for common tasks
- Recent activity feed
- User role and company information display

### 👥 Leads Management
- View all leads with search and filtering
- Lead status tracking (new, contacted, qualified, lost)
- Contact information management
- Source tracking

### 🏢 Properties Management
- Property listings with detailed information
- Type filtering (residential, commercial, land)
- Status tracking (available, sold, pending)
- Property details including bedrooms, bathrooms, area

### ✅ Task Management
- Task creation and assignment
- Priority levels (low, medium, high)
- Status tracking (pending, in progress, completed)
- Due date management

### 👤 Profile & Settings
- User profile information
- Company details
- Statistics overview
- Settings and logout functionality

## Technical Architecture

### Core Technologies
- **React Native** with Expo
- **Expo Router** for navigation
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **Axios** for API communications

### Key Components
- **AuthContext**: User authentication and session management
- **NotesContext**: Notes and activities management
- **AuthService**: Authentication API calls and token management
- **API Endpoints**: Centralized API endpoint definitions

### Project Structure
```
src/
├── contexts/           # React contexts for state management
│   ├── AuthContext.js  # Authentication context
│   └── NotesContext.js # Notes context
├── services/           # API services
│   ├── auth.service.js # Authentication service
│   └── api.endpoints.js # API endpoint definitions
app/
├── auth/              # Authentication screens
│   ├── login.tsx      # Login screen
│   └── forgot-password.tsx # Forgot password screen
└── (tabs)/            # Main app tabs
    ├── index.tsx      # Dashboard
    ├── leads.tsx      # Leads management
    ├── properties.tsx # Properties management
    ├── tasks.tsx      # Task management
    └── profile.tsx    # User profile
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation
1. Navigate to the project directory:
   ```bash
   cd Leadstracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API endpoints:
   - Update `BASE_URL` in `src/services/api.endpoints.js`
   - Replace with your actual API base URL

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on device/simulator:
   ```bash
   npm run ios     # For iOS
   npm run android # For Android
   ```

## Configuration

### API Configuration
Update the API base URL in `src/services/api.endpoints.js`:
```javascript
export const BASE_URL = 'https://your-api-base-url.com';
```

### Authentication
The app uses JWT tokens for authentication. Make sure your backend API supports:
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- POST `/api/auth/refresh` - Token refresh
- POST `/api/auth/forgot-password` - Password reset

## Features Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Offline data synchronization
- [ ] Advanced filtering and search
- [ ] File attachments for leads/properties
- [ ] Calendar integration
- [ ] Reports and analytics
- [ ] Multi-language support

### API Integration
- [ ] Connect to actual CRM backend APIs
- [ ] Implement real-time data updates
- [ ] Add image upload functionality
- [ ] Implement push notifications

## Development Notes

### Mock Data
Currently, the app uses mock data for demonstration purposes. To connect to a real backend:

1. Update API endpoints in `src/services/api.endpoints.js`
2. Implement actual API calls in service files
3. Remove mock data from component files
4. Add proper error handling for API responses

### Security Considerations
- All API calls use authentication tokens
- Sensitive data is encrypted in AsyncStorage
- Input validation is implemented on all forms
- Secure token refresh mechanism

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact: support@crmapp.com