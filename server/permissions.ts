import { TRPCError } from "@trpc/server";
import type { User } from "../drizzle/schema";

export type Role = "user" | "editor" | "contributor" | "viewer" | "admin";

export type Permission =
  | "blog:create"
  | "blog:edit:own"
  | "blog:edit:any"
  | "blog:delete:own"
  | "blog:delete:any"
  | "blog:publish"
  | "cms:create"
  | "cms:edit:own"
  | "cms:edit:any"
  | "cms:delete:own"
  | "cms:delete:any"
  | "cms:publish"
  | "comments:moderate"
  | "users:manage"
  | "categories:manage"
  | "tags:manage"
  | "subscribers:manage"
  | "analytics:view";

/**
 * Role-based permissions matrix
 */
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "blog:create",
    "blog:edit:own",
    "blog:edit:any",
    "blog:delete:own",
    "blog:delete:any",
    "blog:publish",
    "cms:create",
    "cms:edit:own",
    "cms:edit:any",
    "cms:delete:own",
    "cms:delete:any",
    "cms:publish",
    "comments:moderate",
    "users:manage",
    "categories:manage",
    "tags:manage",
    "subscribers:manage",
    "analytics:view",
  ],
  editor: [
    "blog:create",
    "blog:edit:own",
    "blog:edit:any",
    "blog:delete:own",
    "blog:publish",
    "cms:create",
    "cms:edit:own",
    "cms:edit:any",
    "cms:delete:own",
    "cms:publish",
    "comments:moderate",
    "categories:manage",
    "tags:manage",
    "analytics:view",
  ],
  contributor: [
    "blog:create",
    "blog:edit:own",
    "blog:delete:own",
    "cms:create",
    "cms:edit:own",
    "cms:delete:own",
  ],
  viewer: [
    "analytics:view",
  ],
  user: [],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
  const permissions = rolePermissions[user.role as Role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}

/**
 * Throw an error if user doesn't have permission
 */
export function requirePermission(user: User, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to perform this action. Required: ${permission}`,
    });
  }
}

/**
 * Throw an error if user doesn't have any of the permissions
 */
export function requireAnyPermission(user: User, permissions: Permission[]): void {
  if (!hasAnyPermission(user, permissions)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to perform this action. Required one of: ${permissions.join(", ")}`,
    });
  }
}

/**
 * Check if user is the owner of a resource
 */
export function isOwner(user: User, resourceOwnerId: number): boolean {
  return user.id === resourceOwnerId;
}

/**
 * Check if user can edit a resource (either owns it or has edit:any permission)
 */
export function canEdit(user: User, resourceOwnerId: number, resource: "blog" | "cms"): boolean {
  if (isOwner(user, resourceOwnerId)) {
    return hasPermission(user, `${resource}:edit:own` as Permission);
  }
  return hasPermission(user, `${resource}:edit:any` as Permission);
}

/**
 * Check if user can delete a resource (either owns it or has delete:any permission)
 */
export function canDelete(user: User, resourceOwnerId: number, resource: "blog" | "cms"): boolean {
  if (isOwner(user, resourceOwnerId)) {
    return hasPermission(user, `${resource}:delete:own` as Permission);
  }
  return hasPermission(user, `${resource}:delete:any` as Permission);
}
