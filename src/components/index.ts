// src/components/index.ts
// Centralized exports for all components
// Using explicit exports (no "export *") to avoid conflicts

// Main
export { default as Dashboard } from "./Dashboard";

// Common
export { default as Sidebar } from "./common/Sidebar";
export { default as NotificationDropdown } from "./common/NotificationDropdown";
export { default as CompanyCard } from "./common/CompanyCard";
export { default as UserCard } from "./common/UserCard";
export { default as NotificationCard } from "./common/NotificationCard";
export { default as ThreeDotMenu } from "./common/ThreeDotMenu";
export { default as ConfirmModal } from "./common/ConfirmModal";
export { default as FloatingActionButton } from "./common/FloatingActionButton";
export { default as TabScreenWrapper } from "./common/TabScreenWrapper";
export { default as Logo } from "./common/Logo";

// Dashboard
export { default as DashboardStats } from "./dashboard/DashboardStats";
export { default as DashboardEvents } from "./dashboard/DashboardEvents";
export { default as DashboardFollowUps } from "./dashboard/DashboardFollowUps";

// Leads
export { default as AddLeadForm } from "./leads/AddLeadForm";

// Notifications
export { default as NotificationsSection } from "./notifications/NotificationsSection";

// Users
export { default as UserSection } from "./users/UserSection";

// Admins
export { default as AdminSection } from "./admins/AdminSection";

// Tasks
export { default as TaskCard } from "./tasks/TaskCard";
export { default as TaskUploadForm } from "./tasks/TaskUploadForm";

// Notes
export { default as NoteCard } from "./notes/NoteCard";
export { default as NotesList } from "./notes/NotesList";
export { default as NotesSection } from "./notes/NotesSection";
export { default as NotesFilters } from "./notes/NotesFilters";
export { default as NotesToolbar } from "./notes/NotesToolbar";
