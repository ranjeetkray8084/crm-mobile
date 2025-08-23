import { DashboardService } from '../services/dashboard.service';

export const testClosedLeadsAPI = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!user.companyId || !user.id || !token) {
      return;
    }
    
    const result = await DashboardService.getClosedLeadsCountByAdmin(user.companyId, user.id);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add this to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testClosedLeadsAPI = testClosedLeadsAPI;
}