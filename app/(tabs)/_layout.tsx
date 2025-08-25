import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/shared/contexts/AuthContext";
import { TouchableOpacity, Text, StyleSheet, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from "../../src/components/AuthGuard";
import FloatingActionButton from "../../src/components/common/FloatingActionButton";
import { NotesProvider } from "../../src/shared/contexts/NotesContext";
import { useCallback, useEffect } from "react";

export default function TabsLayout() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Check if user is DEVELOPER role
  const isDeveloper = user?.role === 'DEVELOPER';

  console.log('TabsLayout: User role:', user?.role, 'isDeveloper:', isDeveloper);

  useEffect(() => {
    console.log('TabsLayout: About to render tabs with isDeveloper:', isDeveloper);
  }, [isDeveloper]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleAddAction = useCallback((actionId: string) => {
    try {
      console.log('TabLayout: handleAddAction called with actionId:', actionId);
      
      // Ensure router is available and valid
      if (!router || typeof router.push !== 'function') {
        console.error('TabLayout: Router is not available or invalid');
        return;
      }

      let targetRoute: string;
      
      switch (actionId) {
        case 'User':
          targetRoute = '/add?action=User';
          break;
        case 'Lead':
          targetRoute = '/add?action=Lead';
          break;
        case 'Properties':
          targetRoute = '/add?action=Properties';
          break;
        case 'Notes':
          targetRoute = '/add?action=Notes';
          break;
        case 'Task':
          targetRoute = '/add?action=Task';
          break;
        default:
          targetRoute = '/add';
          break;
      }

      // Navigate directly without setTimeout to avoid Hermes issues
      try {
        router.push(targetRoute);
      } catch (navError) {
        console.error('TabLayout: Navigation error:', navError);
      }

    } catch (error) {
      console.error('TabLayout: handleAddAction error:', error);
    }
  }, [router]);

  return (
    <AuthGuard>
      <NotesProvider>
        <View style={styles.container}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: "#1c69ff",
              tabBarInactiveTintColor: "#64748b",
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 0,
                paddingBottom: Math.max(insets.bottom, 8),
                paddingTop: 8,
                height: 70 + Math.max(insets.bottom, 8),
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
              // Add Hermes compatibility options
              tabBarHideOnKeyboard: true,
              tabBarShowLabel: true,
            }}
          >
            {/* Dashboard Tab - First Tab */}
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
            {/* Leads Tab - Second Tab */}
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
            {/* Property Tab - Third Tab */}
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
            {/* Calls Tab - Fourth Tab */}
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
            {/* Notes Tab - Fifth Tab */}
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
          </Tabs>
          
          {/* Floating Action Button - only show for non-DEVELOPER users */}
          {!isDeveloper && (
            <FloatingActionButton onAddAction={handleAddAction} />
          )}
        </View>
      </NotesProvider>
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
