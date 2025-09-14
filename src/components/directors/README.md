# Directors Module

This module provides functionality to view all directors in the system.

## Components

### DirectorsSection

A component that displays all directors in a card format, similar to the CRM frontend but without any action buttons (view-only).

#### Features

- **Role-based Access**: Only DEVELOPER and DIRECTOR roles can view directors
- **Company Filtering**: Directors can only see other directors in their company
- **Card Display**: Shows directors in a clean card format with custom styling
- **View-Only**: No action buttons or three-dot menu - purely for viewing
- **Pull-to-Refresh**: Users can refresh the list by pulling down
- **Loading States**: Shows skeleton loading while fetching data
- **Empty States**: Displays appropriate messages when no directors are found

#### Usage

```tsx
import { DirectorsSection } from '../components/directors';

// In your component
<DirectorsSection />
```

#### Data Fetching

- **Developers**: Can see all directors across all companies using `UserService.getUsersByRole('DIRECTOR')`
- **Directors**: Can see other directors in their company using `UserService.getUsersByRoleAndCompany(companyId, 'DIRECTOR')`

#### Permissions

- **DEVELOPER**: Full access to view all directors
- **DIRECTOR**: Can view other directors in the same company
- **Other roles**: No access (shows permission denied message)

#### Integration

The component is integrated into the main Dashboard through the sidebar navigation:
- Sidebar menu item: "View Directors"
- Section ID: `viewDirectors`
- Route: Accessible via sidebar navigation

#### Styling

- Uses consistent styling with other sections
- Responsive design for different screen sizes
- Follows the app's design system
- Uses the shared UserCard component for consistency
