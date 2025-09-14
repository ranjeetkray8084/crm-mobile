import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../src/shared/contexts/AuthContext';
import { CompanyService } from '../src/core/services';
import CompanyCardWithMenu from '../src/components/common/CompanyCardWithMenu';
import ViewCompanyModal from '../src/components/modals/ViewCompanyModal';
import EditCompanyModal from '../src/components/modals/EditCompanyModal';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  maxUsers: number;
  maxAdmins: number;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  totalUsers?: number;
  totalAdmins?: number;
}

export default function ViewCompaniesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Check if user is DEVELOPER role
  if (!user || user.role !== 'DEVELOPER') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedText}>Only Developer can access this screen.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loadCompanies = async () => {
    try {
      const result = await CompanyService.getAllCompanies();
      if (result.success) {
        setCompanies(result.data || []);
      } else {
        Alert.alert('Error', result.error || 'Failed to load companies');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load companies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCompanies();
  };

  const handleStatusChange = async (companyId: number, newStatus: boolean) => {
    try {
      const result = newStatus 
        ? await CompanyService.unrevokeCompany(companyId)
        : await CompanyService.revokeCompany(companyId);
      
      if (result.success) {
        Alert.alert('Success', `Company ${newStatus ? 'activated' : 'revoked'} successfully`);
        loadCompanies(); // Reload the list
      } else {
        Alert.alert('Error', result.error || 'Failed to update company status');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update company status');
    }
  };

  const handleDelete = async (companyId: number) => {
    try {
      const result = await CompanyService.deleteCompany(companyId);
      if (result.success) {
        Alert.alert('Success', 'Company deleted successfully');
        loadCompanies(); // Reload the list
      } else {
        Alert.alert('Error', result.error || 'Failed to delete company');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete company');
    }
  };

  const handleUpdate = (company: Company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSelectedCompany(null);
    loadCompanies();
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.email.toLowerCase().includes(query) ||
      company.phone.toLowerCase().includes(query)
    );
  });

  const handleRevoke = async (companyId: number) => {
    try {
      const result = await CompanyService.revokeCompany(companyId);
      if (result.success) {
        Alert.alert('Success', 'Company revoked successfully');
        loadCompanies(); // Reload the list
      } else {
        Alert.alert('Error', result.error || 'Failed to revoke company');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to revoke company');
    }
  };

  const handleUnrevoke = async (companyId: number) => {
    try {
      const result = await CompanyService.unrevokeCompany(companyId);
      if (result.success) {
        Alert.alert('Success', 'Company activated successfully');
        loadCompanies(); // Reload the list
      } else {
        Alert.alert('Error', result.error || 'Failed to activate company');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to activate company');
    }
  };

  const renderCompanyCard = ({ item }: { item: Company }) => (
    <CompanyCardWithMenu
      company={item}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onRevoke={handleRevoke}
      onUnrevoke={handleUnrevoke}
      onView={handleViewCompany}
      role={user.role}
      companyId={user.companyId}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="business-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>No Companies Found</Text>
      <Text style={styles.emptyStateText}>
        There are no companies to display at the moment.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Companies</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading companies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Companies</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search companies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Companies List */}
      <FlatList
        data={filteredCompanies}
        renderItem={renderCompanyCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Modals */}
      <ViewCompanyModal
        isVisible={showViewModal}
        onClose={handleCloseModals}
        company={selectedCompany}
      />

      <EditCompanyModal
        isVisible={showEditModal}
        onClose={handleCloseModals}
        company={selectedCompany}
        onUpdate={handleUpdateSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#0d9488',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
