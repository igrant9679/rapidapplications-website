import { getDb } from "./db";
import { auditLogs, type InsertAuditLog } from "../drizzle/schema";
import type { User } from "../drizzle/schema";

export type AuditAction =
  | "blog:create"
  | "blog:update"
  | "blog:delete"
  | "blog:publish"
  | "cms:create"
  | "cms:update"
  | "cms:delete"
  | "cms:publish"
  | "comment:create"
  | "comment:approve"
  | "comment:reject"
  | "comment:delete"
  | "user:role_change"
  | "user:login"
  | "category:create"
  | "category:update"
  | "category:delete"
  | "tag:create"
  | "tag:update"
  | "tag:delete";

export type AuditEntityType =
  | "blog_post"
  | "cms_page"
  | "comment"
  | "user"
  | "category"
  | "tag";

interface AuditLogParams {
  userId: number;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Audit] Database not available");
      return;
    }

    const logEntry: InsertAuditLog = {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details ? JSON.stringify(params.details) : null,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    };

    await db.insert(auditLogs).values(logEntry);
  } catch (error) {
    console.error("[Audit] Failed to log audit event:", error);
    // Don't throw - audit logging should not break the main operation
  }
}

/**
 * Get audit logs with optional filtering
 */
export async function getAuditLogs(filters?: {
  userId?: number;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db.select().from(auditLogs);

  // Apply filters (simplified - in production use drizzle's where clauses)
  const results = await query;
  
  let filtered = results;

  if (filters?.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId);
  }

  if (filters?.action) {
    filtered = filtered.filter(log => log.action === filters.action);
  }

  if (filters?.entityType) {
    filtered = filtered.filter(log => log.entityType === filters.entityType);
  }

  if (filters?.entityId) {
    filtered = filtered.filter(log => log.entityId === filters.entityId);
  }

  if (filters?.startDate) {
    filtered = filtered.filter(log => new Date(log.createdAt) >= filters.startDate!);
  }

  if (filters?.endDate) {
    filtered = filtered.filter(log => new Date(log.createdAt) <= filters.endDate!);
  }

  // Sort by most recent first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply limit
  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}

/**
 * Helper to extract IP address from request
 */
export function getIpAddress(req: any): string | undefined {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress
  );
}

/**
 * Helper to get user agent from request
 */
export function getUserAgent(req: any): string | undefined {
  return req.headers["user-agent"];
}
