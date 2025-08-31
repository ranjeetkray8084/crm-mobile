# Unified Remarks Components

This directory contains unified remark components that can be used across leads, properties, and notes modules. These components provide a consistent and clean way to display and manage remarks.

## Components Overview

### 1. RemarkCard
A single remark displayed in a clean card format with type indicators, timestamps, and author information.

**Features:**
- Type-based color coding (General, Follow Up, Important, Note)
- Timestamp display
- Author information
- Compact mode for list views
- Responsive design

**Props:**
```typescript
interface RemarkCardProps {
  remark: Remark;
  showType?: boolean;    // Show/hide type indicator
  compact?: boolean;     // Compact mode for smaller display
}
```

**Usage:**
```tsx
import { RemarkCard } from '../common';

<RemarkCard 
  remark={remarkData} 
  showType={true} 
  compact={false} 
/>
```

### 2. RemarksList
A scrollable list of remarks with pull-to-refresh functionality and error handling.

**Features:**
- Pull-to-refresh
- Loading states
- Error handling
- Empty state display
- Automatic sorting (newest first)

**Props:**
```typescript
interface RemarksListProps {
  remarks: Remark[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  emptyMessage?: string;
  compact?: boolean;
  showType?: boolean;
}
```

**Usage:**
```tsx
import { RemarksList } from '../common';

<RemarksList
  remarks={remarks}
  loading={isLoading}
  error={error}
  onRefresh={handleRefresh}
  emptyMessage="No remarks found"
/>
```

### 3. UnifiedRemarksModal
A modal that displays remarks for any entity type (lead, property, note) with consistent styling.

**Features:**
- Entity type-specific icons and colors
- Pull-to-refresh remarks
- Add remark button
- Consistent header design
- Responsive layout

**Props:**
```typescript
interface UnifiedRemarksModalProps {
  isVisible: boolean;
  onClose: () => void;
  entity: Entity | null;
  entityType: 'lead' | 'property' | 'note';
  onGetRemarks: (entityId: string | number) => Promise<{ success: boolean; data?: Remark[]; error?: string }>;
  onAddRemark?: () => void;
}
```

**Usage:**
```tsx
import { UnifiedRemarksModal } from '../common';

<UnifiedRemarksModal
  isVisible={showRemarks}
  onClose={() => setShowRemarks(false)}
  entity={currentEntity}
  entityType="lead"
  onGetRemarks={getRemarks}
  onAddRemark={handleAddRemark}
/>
```

### 4. UnifiedAddRemarkModal
A modal for adding new remarks with type selection and consistent styling.

**Features:**
- Remark type selection (General, Follow Up, Important, Note)
- Entity type-specific styling
- Form validation
- Loading states
- Success/error handling

**Props:**
```typescript
interface UnifiedAddRemarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  entity: Entity | null;
  entityType: 'lead' | 'property' | 'note';
  onAddRemark: (data: { remark: string; type?: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
}
```

**Usage:**
```tsx
import { UnifiedAddRemarkModal } from '../common';

<UnifiedAddRemarkModal
  isVisible={showAddRemark}
  onClose={() => setShowAddRemark(false)}
  entity={currentEntity}
  entityType="lead"
  onAddRemark={addRemark}
/>
```

## Data Structure

### Remark Interface
```typescript
interface Remark {
  id: string;
  remark: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  type?: string;  // 'general' | 'followup' | 'important' | 'note'
}
```

### Entity Interface
```typescript
interface Entity {
  id?: string | number;
  name?: string;
  propertyName?: string;
  leadId?: string;
  propertyId?: number;
}
```

## Integration Examples

### For Leads
```tsx
// In LeadCard.tsx or LeadActions.tsx
import { UnifiedRemarksModal, UnifiedAddRemarkModal } from '../common';

const [showRemarks, setShowRemarks] = useState(false);
const [showAddRemark, setShowAddRemark] = useState(false);

// View remarks
<TouchableOpacity onPress={() => setShowRemarks(true)}>
  <Text>View Remarks</Text>
</TouchableOpacity>

// Add remark
<TouchableOpacity onPress={() => setShowAddRemark(true)}>
  <Text>Add Remark</Text>
</TouchableOpacity>

// Modals
<UnifiedRemarksModal
  isVisible={showRemarks}
  onClose={() => setShowRemarks(false)}
  entity={lead}
  entityType="lead"
  onGetRemarks={getLeadRemarks}
  onAddRemark={() => {
    setShowRemarks(false);
    setShowAddRemark(true);
  }}
/>

<UnifiedAddRemarkModal
  isVisible={showAddRemark}
  onClose={() => setShowAddRemark(false)}
  entity={lead}
  entityType="lead"
  onAddRemark={addLeadRemark}
/>
```

### For Properties
```tsx
// Similar structure, just change entityType to "property"
<UnifiedRemarksModal
  entityType="property"
  // ... other props
/>

<UnifiedAddRemarkModal
  entityType="property"
  // ... other props
/>
```

### For Notes
```tsx
// Similar structure, just change entityType to "note"
<UnifiedRemarksModal
  entityType="note"
  // ... other props
/>

<UnifiedAddRemarkModal
  entityType="note"
  // ... other props
/>
```

## Styling and Customization

The components use consistent styling with:
- **Leads**: Blue theme (#3b82f6)
- **Properties**: Green theme (#10b981)
- **Notes**: Purple theme (#8b5cf6)

You can customize colors by modifying the `getEntityTypeColor()` function in each component.

## Benefits

1. **Consistency**: Same look and feel across all modules
2. **Reusability**: Single component for multiple entity types
3. **Maintainability**: Centralized remark functionality
4. **User Experience**: Familiar interface across the app
5. **Code Reduction**: Eliminates duplicate remark components

## Demo Component

Use `RemarksDemo.tsx` to see all components in action and test their functionality.

## Migration Guide

To migrate existing remark modals to the unified components:

1. Replace existing remark modals with `UnifiedRemarksModal`
2. Replace existing add remark modals with `UnifiedAddRemarkModal`
3. Update entity type to match your use case
4. Ensure your data structure matches the expected interfaces
5. Test functionality and styling

## Support

For questions or issues with these components, refer to the existing remark implementations in:
- `src/components/leads/modals/`
- `src/components/property/modals/`
- `src/components/notes/modals/`
