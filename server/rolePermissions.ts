/**
 * Role-based permissions system for WordPress-style user roles
 * 
 * Roles hierarchy (from highest to lowest):
 * - Admin: Full access to everything
 * - Editor: Can publish and manage posts including posts of other users
 * - Author: Can publish and manage their own posts
 * - Contributor: Can write and manage their own posts but cannot publish
 * - Subscriber: Can only read content and manage their profile
 */

export type UserRole = "admin" | "editor" | "author" | "contributor" | "subscriber";

export interface RolePermissions {
  // Content permissions
  canPublishPosts: boolean;
  canEditOwnPosts: boolean;
  canEditOthersPosts: boolean;
  canDeleteOwnPosts: boolean;
  canDeleteOthersPosts: boolean;
  
  // Page permissions
  canPublishPages: boolean;
  canEditPages: boolean;
  canDeletePages: boolean;
  
  // Media permissions
  canUploadMedia: boolean;
  canDeleteOwnMedia: boolean;
  canDeleteOthersMedia: boolean;
  
  // Comment permissions
  canModerateComments: boolean;
  canEditComments: boolean;
  canDeleteComments: boolean;
  
  // Category & Tag permissions
  canManageCategories: boolean;
  canManageTags: boolean;
  
  // User permissions
  canListUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canChangeUserRoles: boolean;
  
  // System permissions
  canManageMenus: boolean;
  canManageCustomPostTypes: boolean;
  canManageCustomFields: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canImportContent: boolean;
  canExportContent: boolean;
}

const rolePermissionsMap: Record<UserRole, RolePermissions> = {
  admin: {
    canPublishPosts: true,
    canEditOwnPosts: true,
    canEditOthersPosts: true,
    canDeleteOwnPosts: true,
    canDeleteOthersPosts: true,
    canPublishPages: true,
    canEditPages: true,
    canDeletePages: true,
    canUploadMedia: true,
    canDeleteOwnMedia: true,
    canDeleteOthersMedia: true,
    canModerateComments: true,
    canEditComments: true,
    canDeleteComments: true,
    canManageCategories: true,
    canManageTags: true,
    canListUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canChangeUserRoles: true,
    canManageMenus: true,
    canManageCustomPostTypes: true,
    canManageCustomFields: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canImportContent: true,
    canExportContent: true,
  },
  editor: {
    canPublishPosts: true,
    canEditOwnPosts: true,
    canEditOthersPosts: true,
    canDeleteOwnPosts: true,
    canDeleteOthersPosts: true,
    canPublishPages: true,
    canEditPages: true,
    canDeletePages: false,
    canUploadMedia: true,
    canDeleteOwnMedia: true,
    canDeleteOthersMedia: false,
    canModerateComments: true,
    canEditComments: true,
    canDeleteComments: true,
    canManageCategories: true,
    canManageTags: true,
    canListUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canManageMenus: false,
    canManageCustomPostTypes: false,
    canManageCustomFields: false,
    canViewAnalytics: true,
    canManageSettings: false,
    canImportContent: true,
    canExportContent: true,
  },
  author: {
    canPublishPosts: true,
    canEditOwnPosts: true,
    canEditOthersPosts: false,
    canDeleteOwnPosts: true,
    canDeleteOthersPosts: false,
    canPublishPages: false,
    canEditPages: false,
    canDeletePages: false,
    canUploadMedia: true,
    canDeleteOwnMedia: true,
    canDeleteOthersMedia: false,
    canModerateComments: false,
    canEditComments: false,
    canDeleteComments: false,
    canManageCategories: false,
    canManageTags: false,
    canListUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canManageMenus: false,
    canManageCustomPostTypes: false,
    canManageCustomFields: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canImportContent: false,
    canExportContent: true,
  },
  contributor: {
    canPublishPosts: false,
    canEditOwnPosts: true,
    canEditOthersPosts: false,
    canDeleteOwnPosts: true,
    canDeleteOthersPosts: false,
    canPublishPages: false,
    canEditPages: false,
    canDeletePages: false,
    canUploadMedia: false,
    canDeleteOwnMedia: false,
    canDeleteOthersMedia: false,
    canModerateComments: false,
    canEditComments: false,
    canDeleteComments: false,
    canManageCategories: false,
    canManageTags: false,
    canListUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canManageMenus: false,
    canManageCustomPostTypes: false,
    canManageCustomFields: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canImportContent: false,
    canExportContent: false,
  },
  subscriber: {
    canPublishPosts: false,
    canEditOwnPosts: false,
    canEditOthersPosts: false,
    canDeleteOwnPosts: false,
    canDeleteOthersPosts: false,
    canPublishPages: false,
    canEditPages: false,
    canDeletePages: false,
    canUploadMedia: false,
    canDeleteOwnMedia: false,
    canDeleteOthersMedia: false,
    canModerateComments: false,
    canEditComments: false,
    canDeleteComments: false,
    canManageCategories: false,
    canManageTags: false,
    canListUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canManageMenus: false,
    canManageCustomPostTypes: false,
    canManageCustomFields: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canImportContent: false,
    canExportContent: false,
  },
};

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  return rolePermissionsMap[role];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissionsMap[role][permission];
}

/**
 * Check if a user can edit a specific post
 */
export function canEditPost(userRole: UserRole, userId: number, postAuthorId: number): boolean {
  const permissions = getRolePermissions(userRole);
  
  if (permissions.canEditOthersPosts) {
    return true;
  }
  
  if (permissions.canEditOwnPosts && userId === postAuthorId) {
    return true;
  }
  
  return false;
}

/**
 * Check if a user can delete a specific post
 */
export function canDeletePost(userRole: UserRole, userId: number, postAuthorId: number): boolean {
  const permissions = getRolePermissions(userRole);
  
  if (permissions.canDeleteOthersPosts) {
    return true;
  }
  
  if (permissions.canDeleteOwnPosts && userId === postAuthorId) {
    return true;
  }
  
  return false;
}

/**
 * Check if a user can delete specific media
 */
export function canDeleteMedia(userRole: UserRole, userId: number, mediaOwnerId: number): boolean {
  const permissions = getRolePermissions(userRole);
  
  if (permissions.canDeleteOthersMedia) {
    return true;
  }
  
  if (permissions.canDeleteOwnMedia && userId === mediaOwnerId) {
    return true;
  }
  
  return false;
}

/**
 * Get all available roles with descriptions
 */
export function getAllRoles(): Array<{ value: UserRole; label: string; description: string }> {
  return [
    {
      value: "admin",
      label: "Administrator",
      description: "Full access to all features and settings",
    },
    {
      value: "editor",
      label: "Editor",
      description: "Can publish and manage posts including posts of other users",
    },
    {
      value: "author",
      label: "Author",
      description: "Can publish and manage their own posts",
    },
    {
      value: "contributor",
      label: "Contributor",
      description: "Can write and manage their own posts but cannot publish",
    },
    {
      value: "subscriber",
      label: "Subscriber",
      description: "Can only read content and manage their profile",
    },
  ];
}
