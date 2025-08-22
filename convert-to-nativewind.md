# NativeWind Conversion Guide

## Components Already Converted ✅
- Topbar.tsx
- Sidebar.tsx  
- BottomNavigation.tsx
- NotificationDropdown.tsx
- CustomAlert.tsx

## Components Still Need Conversion 🔄
- Dashboard.tsx
- HapticTab.tsx
- ThreeDotMenu.tsx
- HighlightText.tsx
- ResponsiveGrid.tsx
- ResponsiveContainer.tsx
- ConfirmModal.tsx

## Conversion Steps

### 1. Remove StyleSheet Import
```tsx
// Remove this line:
import { StyleSheet } from 'react-native';
```

### 2. Replace style={styles.xxx} with className="..."
```tsx
// Before:
<View style={styles.container}>

// After:
<View className="bg-white p-4 rounded-lg">
```

### 3. Remove StyleSheet.create({...}) at the bottom

### 4. Common Tailwind Classes for React Native

#### Layout
- `flex-1` = `flex: 1`
- `flex-row` = `flexDirection: 'row'`
- `items-center` = `alignItems: 'center'`
- `justify-center` = `justifyContent: 'center'`
- `justify-between` = `justifyContent: 'space-between'`

#### Spacing
- `p-4` = `padding: 16`
- `px-4` = `paddingHorizontal: 16`
- `py-2` = `paddingVertical: 8`
- `m-2` = `margin: 8`
- `mx-4` = `marginHorizontal: 16`

#### Colors
- `bg-white` = `backgroundColor: '#ffffff'`
- `text-gray-800` = `color: '#1f2937'`
- `border-gray-200` = `borderColor: '#e5e7eb'`

#### Typography
- `text-lg` = `fontSize: 18`
- `text-xl` = `fontSize: 20`
- `font-bold` = `fontWeight: 'bold'`
- `text-center` = `textAlign: 'center'`

#### Borders & Radius
- `rounded-lg` = `borderRadius: 8`
- `rounded-full` = `borderRadius: 9999`
- `border` = `borderWidth: 1`
- `border-t` = `borderTopWidth: 1`

#### Shadows
- `shadow-sm` = `shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2`
- `shadow-lg` = `shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 15`

## Example Conversion

### Before (StyleSheet):
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
```

### After (NativeWind):
```tsx
<View className="flex-1 p-4 bg-white">
  <Text className="text-2xl font-bold text-gray-800">Hello World</Text>
</View>
```

## Notes
- Keep `style` prop for dynamic values (colors, transforms, etc.)
- Use `className` for static styling
- Some complex styles might need to stay as `style` prop
- Test each component after conversion
