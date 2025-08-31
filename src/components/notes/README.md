# Notes & Events System

This directory contains the enhanced Notes & Events system for CRMNativeExpo, which has been upgraded to match the functionality from crm-frontend.

## Features

### 📝 Notes
- Create, edit, and delete notes
- Set priority levels (A, B, C)
- Set status (NEW, PROCESSING, COMPLETED)
- Configure visibility settings
- Add remarks and view remark history

### 📅 Events
- Schedule events with date and time
- Event-specific validation
- Visual indicators for upcoming vs past events
- Event-specific styling and icons

### 🔒 Visibility Control
- **ONLY_ME**: Private to creator
- **ALL_USERS**: Visible to all users in company
- **ALL_ADMIN**: Visible to all admin users
- **SPECIFIC_USERS**: Visible to selected users
- **SPECIFIC_ADMIN**: Visible to selected admin users
- **ME_AND_DIRECTOR**: Visible to creator and director
- **ME_AND_ADMIN**: Visible to creator and admin

### 🎯 Role-Based Access
- **DIRECTOR**: Full access to all visibility options
- **ADMIN**: Access to user management and specific user selection
- **USER**: Limited visibility options (me + director/admin)

### ⚡ Action System
- **Three-Dot Menu**: Clean action menu accessible via ellipsis button
- **Status Management**: Quick status updates (NEW, PROCESSING, COMPLETED)
- **Priority Management**: Priority level changes (A, B, C)
- **Note Management**: Edit, add remarks, view remarks
- **Additional Actions**: Share, duplicate, archive, pin
- **Visibility Information**: Display current visibility settings
- **Danger Zone**: Delete notes/events (role-based permissions)

## Components

### Core Components
- `NotesSection.tsx` - Main notes management interface
- `NotesList.tsx` - Displays notes in a list format
- `NoteCard.tsx` - Individual note/event display card with three-dot action menu
- `NotesToolbar.tsx` - Search, filters, and actions toolbar
- `NotesFilters.tsx` - Status, priority, and type filtering

### Action System Components
- `NoteActions.tsx` - Comprehensive action interface for notes/events (used in details view)
- `NoteDetails.tsx` - Detailed view with integrated actions system
- `NoteActionMenu.tsx` - Three-dot menu component for quick actions

### Modal Components
- `AddNoteModal.tsx` - Create new notes and events
- `EditNoteModal.tsx` - Edit existing notes
- `AddRemarkModal.tsx` - Add remarks to notes
- `ViewRemarksModal.tsx` - View remark history

### Utility Components
- `VisibilitySelector.tsx` - Role-based visibility selection
- `NotesDemo.tsx` - Demo component showcasing the system

## Usage

### Basic Notes Section
```tsx
import { NotesSection } from '../components/notes';

const MyScreen = () => {
  return <NotesSection />;
};
```

### Demo Component with Actions
```tsx
import { NotesDemo } from '../components/notes';

const DemoScreen = () => {
  return <NotesDemo />;
};
```

### Custom Note Creation
```tsx
import { AddNoteModal } from '../components/notes';

const [isModalOpen, setIsModalOpen] = useState(false);

const handleCreateNote = async (noteData) => {
  // Handle note creation
  console.log('New note:', noteData);
};

<AddNoteModal
  isVisible={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreateNote={handleCreateNote}
  companyId={1}
  userId={1}
  userRole="ADMIN"
/>
```

### Using the Action System
```tsx
import { NoteActions } from '../components/notes';

const handleStatusUpdate = (noteId, status) => {
  // Update note status
};

const handlePriorityUpdate = (noteId, priority) => {
  // Update note priority
};

<NoteActions
  note={note}
  onStatusUpdate={handleStatusUpdate}
  onPriorityUpdate={handlePriorityUpdate}
  onDelete={handleDelete}
  onUpdate={handleUpdate}
  onAddRemark={handleAddRemark}
  onViewRemarks={handleViewRemarks}
  onShare={handleShare}
  onDuplicate={handleDuplicate}
  onArchive={handleArchive}
  onPin={handlePin}
  userRole="ADMIN"
  isOwner={true}
/>
```

## Action System Features

### Three-Dot Menu (Quick Actions)
- **Access**: Click the ellipsis (⋯) button on any note/event card
- **Actions Available**:
  - View Details - Opens full note details with comprehensive actions
  - Add Remark - Add a remark to the note
  - View Remarks - View all remarks for the note
  - Edit - Edit the note (if user has permission)
  - Delete - Delete the note (if user has permission)

### Status Management
- **NEW**: 🆕 Star icon, yellow/orange color
- **PROCESSING**: ⚡ Sync icon, blue color  
- **COMPLETED**: ✅ Checkmark icon, green color

### Priority Management
- **Priority A**: 🔴 Alert icon, red color (highest)
- **Priority B**: 🟡 Warning icon, orange color (medium)
- **Priority C**: 🟢 Info icon, green color (lowest)

### Action Categories
1. **Quick Actions**: Three-dot menu for common operations
2. **Status Management**: Quick status updates with visual feedback
3. **Priority Management**: Priority level changes with color coding
4. **Note Management**: Edit, add remarks, view remarks
5. **Additional Actions**: Share, duplicate, archive, pin
6. **Visibility Information**: Current visibility settings display
7. **Danger Zone**: Delete actions (role-based permissions)

### Role-Based Permissions
- **DIRECTOR**: Full access to all actions
- **ADMIN**: Can edit, delete, and manage notes
- **USER**: Limited to own notes and basic actions
- **Owner**: Can always edit and delete their own notes

## User Experience

### Clean Interface
- **Minimal UI**: Action buttons are hidden until needed
- **Three-Dot Menu**: Familiar pattern used across the app
- **Quick Access**: Most common actions are easily accessible
- **Progressive Disclosure**: Basic actions in menu, advanced actions in details view

### Action Flow
1. **Quick Actions**: Use three-dot menu for common operations
2. **Detailed Actions**: Click "View Details" for comprehensive action system
3. **Status/Priority**: Direct updates via touchable badges
4. **Role-Based**: Actions adapt based on user permissions

## Data Structure

### Note/Event Object
```typescript
interface Note {
  id: number;
  content: string;
  type: 'NOTE' | 'EVENT';
  dateTime?: string; // ISO string for events
  priority: 'PRIORITY_A' | 'PRIORITY_B' | 'PRIORITY_C';
  status: 'NEW' | 'PROCESSING' | 'COMPLETED';
  visibility: string;
  visibleUserIds: number[];
  userId: number;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
    username: string;
  };
}
```

## Styling

The system uses a consistent design language with:
- **Primary Color**: #1c69ff (Blue)
- **Success Color**: #10b981 (Green)
- **Warning Color**: #f59e0b (Orange)
- **Error Color**: #ef4444 (Red)
- **Event Accent**: #3b82f6 (Blue)

## Key Enhancements from crm-frontend

1. **Dual Type Support**: Notes and Events in one system
2. **Enhanced Visibility**: Role-based visibility options
3. **Event Scheduling**: Date and time picker for events
4. **Visual Indicators**: Clear distinction between notes and events
5. **Improved UX**: Better form validation and user feedback
6. **Responsive Design**: Mobile-optimized interface
7. **Action System**: Comprehensive action management like leads/property
8. **Role-Based Actions**: Permissions-based action availability
9. **Quick Actions**: Status and priority management
10. **Detailed Views**: Full note details with integrated actions
11. **Three-Dot Menu**: Clean, familiar action interface
12. **Progressive Disclosure**: Basic actions in menu, advanced in details

## Dependencies

- React Native
- Expo Vector Icons
- React Native core components
- Custom hooks (useNotes, useUsers)

## Future Enhancements

- Calendar view for events
- Event reminders and notifications
- Bulk operations
- Advanced search and filtering
- Export functionality
- Integration with external calendar systems
- Action history tracking
- Advanced permission system
- Workflow automation
- Custom action workflows
- Action templates
