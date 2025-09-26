// Admin configuration and utilities
export const ADMIN_CONFIG = {
  // Single admin credentials - change these in production
  ADMIN_EMAIL: 'admin@mockdrilling.com',
  ADMIN_PASSWORD: 'Admin@2024!Secure',
  ADMIN_UID: 'admin-uid-2024', // This will be set when admin account is created
}

// Check if user is admin
export function isAdmin(user) {
  if (!user) return false
  return user.email === ADMIN_CONFIG.ADMIN_EMAIL || user.uid === ADMIN_CONFIG.ADMIN_UID
}

// Admin-only middleware for API routes
export function requireAdmin(user) {
  if (!isAdmin(user)) {
    throw new Error('Admin access required')
  }
  return true
}

// Admin stats and data
export const ADMIN_FEATURES = {
  userManagement: true,
  interviewAnalytics: true,
  systemSettings: true,
  drillPointsManagement: true,
  feedbackModeration: true,
}
