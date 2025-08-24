import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/shared/contexts/AuthContext";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import AuthGuard from "../../src/components/AuthGuard";
import FloatingActionButton from "../../src/components/common/FloatingActionButton";

export default function TabsLayout() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Check if user is DEVELOPER role
  const isDeveloper = user?.role === 'DEVELOPER';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleAddAction = (actionId: string) => {
    switch (actionId) {
      case 'User':
        // Navigate to user creation or user management
        router.push('/(tabs)/add?action=User');
        break;
      case 'Lead':
        // Navigate to lead creation
        router.push('/(tabs)/add?action=Lead');
        break;
      case 'Properties':
        // Navigate to property creation
        router.push('/(tabs)/add?action=Properties');
        break;
      case 'Notes':
        // Navigate to notes/event creation
        router.push('/(tabs)/add?action=Notes');
        break;
      case 'Task':
        // Navigate to task/calling data
        router.push('/(tabs)/add?action=Task');
        break;
      default:
        // Default to add screen
        router.push('/(tabs)/add');
        break;
    }
  };

  return (
    <AuthGuard>
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#1c69ff",
            tabBarInactiveTintColor: "#64748b",
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 0,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
              zIndex: 1000,
              // Hide bottom tabs for DEVELOPER users
              display: isDeveloper ? 'none' : 'flex',
              paddingHorizontal: 0,
            },
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 4,
            },
            tabBarIconStyle: {
              marginBottom: 2,
            },
            tabBarItemStyle: {
              paddingVertical: 4,
              paddingHorizontal: 0,
              flex: 1,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.tabIconContainer}>
                  <Ionicons 
                    name="grid-outline" 
                    size={24} 
                    color={color} 
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="leads"
            options={{
              title: "Leads",
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.tabIconContainer}>
                  <Ionicons 
                    name="people-outline" 
                    size={24} 
                    color={color} 
                  />
                </View>
              ),
            }}
          />

          {/* Add tab removed - replaced with FloatingActionButton */}
          <Tabs.Screen
            name="property"
            options={{
              title: "Property",
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.tabIconContainer}>
                  <Ionicons 
                    name="business-outline" 
                    size={24} 
                    color={color} 
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="tasks"
            options={{
              title: "Calls",
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.tabIconContainer}>
                  <Ionicons 
                    name="call-outline" 
                    size={24} 
                    color={color} 
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="notes"
            options={{
              title: "Notes",
              tabBarIcon: ({ color, focused }) => (
                <View style={styles.tabIconContainer}>
                  <Ionicons 
                    name="document-text-outline" 
                    size={24} 
                    color={color} 
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: "Add",
              tabBarButton: () => null, // Hide this tab from the tab bar
            }}
          />
        </Tabs>
        
        {/* Floating Action Button - only show for non-DEVELOPER users */}
        {!isDeveloper && (
          <FloatingActionButton onAddAction={handleAddAction} />
        )}
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
  },
});
