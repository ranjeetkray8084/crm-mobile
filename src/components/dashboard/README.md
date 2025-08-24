# Dashboard System Components

This directory contains the dashboard system components for CRMNativeExpo, designed to mirror the functionality of the web dashboard system.

## Components Overview

### 1. DashboardStats.tsx
**Main Statistics Display Component**

**Features:**
- Role-based statistics display (DEVELOPER, DIRECTOR, ADMIN, USER)
- Developer stats: Total Companies, Users, Admins, Directors
- Business stats: Leads Overview, Property Overview, Deals Overview, Users & Admins
- Loading states and error handling
- Responsive design with gradient cards

**Props:** None (uses hooks internally)

**Hooks Used:**
- `useAuth()` - For user authentication and role information
- `useDashboardStats()` - For fetching dashboard statistics

### 2. DashboardEvents.tsx
**Today's Events Display Component**

**Features:**
- Shows today's scheduled events
- Hidden for DEVELOPER role
- Event details: content, time, creator
- Empty state with helpful message
- Loading and error states

**Props:** None (uses hooks internally)

**Hooks Used:**
- `useAuth()` - For user authentication
- `useDashboardEvents()` - For fetching today's events

### 3. DashboardFollowUps.tsx
**Today's Follow-ups Display Component**

**Features:**
- Shows today's scheduled follow-ups
- Filters follow-ups for current user
- Follow-up details: lead name, phone, note, time
- Auto-notification badge
- Empty state with encouraging message
- Loading and error states

**Props:** None (uses hooks internally)

**Hooks Used:**
- `useAuth()` - For user authentication
- `useTodayFollowUps()` - For fetching today's follow-ups

## Architecture

### Component Structure
```
Dashboard.tsx (Main Container)
├── DashboardStats.tsx (Statistics Cards)
├── DashboardEvents.tsx (Today's Events)
└── DashboardFollowUps.tsx (Today's Follow-ups)
```

### Data Flow
1. **Authentication**: Components use `useAuth()` to get user context
2. **Data Fetching**: Components use specialized hooks for data
3. **State Management**: Local state for loading, error, and data
4. **UI Rendering**: Conditional rendering based on user role and data availability

### Role-Based Features

#### DEVELOPER Role
- Global statistics across all companies
- Company, user, admin, and director counts
- No events or follow-ups (system-level view)

#### DIRECTOR Role
- Company-wide business statistics
- All events and follow-ups visible
- User and admin management overview

#### ADMIN Role
- Assigned user statistics
- Company-wide property and lead overview
- Events and follow-ups for assigned users

#### USER Role
- Personal lead and property statistics
- Company-wide property overview
- Personal events and follow-ups

## Styling

### Design System
- **Colors**: Consistent with web dashboard
- **Shadows**: Subtle elevation for cards
- **Typography**: Hierarchical text sizing
- **Spacing**: Consistent padding and margins
- **Borders**: Rounded corners for modern look

### Responsive Design
- Flexible layouts that adapt to different screen sizes
- Proper spacing for mobile devices
- Touch-friendly interactive elements

## Error Handling

### Loading States
- Skeleton loading cards
- Loading indicators for better UX

### Error States
- User-friendly error messages
- Fallback data when possible
- Graceful degradation

### Empty States
- Encouraging messages for empty data
- Clear visual indicators
- Helpful guidance for users

## Performance Considerations

### Data Fetching
- Efficient API calls through hooks
- Proper error boundaries
- Loading state management

### Rendering Optimization
- Conditional rendering based on data
- Efficient list rendering
- Minimal re-renders

## Usage Example

```tsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Dashboard
      onMenuPress={() => {/* handle menu */}}
      onNotificationPress={() => {/* handle notifications */}}
      onLogoutPress={() => {/* handle logout */}}
    />
  );
}
```

## Dependencies

- React Native core components
- Expo Vector Icons
- React Native Safe Area Context
- Custom hooks from `../../core/hooks/`
- Authentication context

## Future Enhancements

- Real-time data updates
- Push notifications for events/follow-ups
- Offline data caching
- Advanced filtering and search
- Customizable dashboard layouts
- Export functionality for statistics
