import { router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAuditLogs } from "./auditLog";
import { requirePermission } from "./permissions";
import * as db from "./db";

export const auditLogRouter = router({
  /**
   * Get audit logs with optional filtering
   */
  list: adminProcedure
    .input(z.object({
      userId: z.number().optional(),
      action: z.string().optional(),
      entityType: z.string().optional(),
      entityId: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().default(100),
    }).optional())
    .query(async ({ input, ctx }) => {
      // Only admins can view audit logs
      requirePermission(ctx.user, "users:manage");

      const filters = input ? {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        action: input.action as any,
        entityType: input.entityType as any,
      } : undefined;

      const logs = await getAuditLogs(filters);

      // Enrich with user information
      const allUsers = await db.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      return logs.map(log => ({
        ...log,
        user: userMap.get(log.userId),
        details: log.details ? JSON.parse(log.details as string) : null,
      }));
    }),

  /**
   * Get audit log statistics
   */
  stats: adminProcedure
    .query(async ({ ctx }) => {
      requirePermission(ctx.user, "users:manage");

      const logs = await getAuditLogs({ limit: 1000 });

      // Count by action type
      const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count by user
      const userCounts = logs.reduce((acc, log) => {
        acc[log.userId] = (acc[log.userId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Recent activity (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLogs = logs.filter(log => new Date(log.createdAt) >= oneDayAgo);

      return {
        totalLogs: logs.length,
        actionCounts,
        userCounts,
        recentActivityCount: recentLogs.length,
        mostActiveUsers: Object.entries(userCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([userId, count]) => ({ userId: parseInt(userId), count })),
      };
    }),

  /**
   * Export audit logs to CSV or JSON
   */
  export: adminProcedure
    .input(z.object({
      format: z.enum(['csv', 'json']),
      userId: z.number().optional(),
      action: z.string().optional(),
      entityType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      requirePermission(ctx.user, "users:manage");

      const filters = {
        userId: input.userId,
        action: input.action as any,
        entityType: input.entityType as any,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        limit: 10000, // Higher limit for exports
      };

      const logs = await getAuditLogs(filters);

      // Enrich with user information
      const allUsers = await db.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      const enrichedLogs = logs.map(log => ({
        id: log.id,
        userId: log.userId,
        userName: userMap.get(log.userId)?.name || 'Unknown',
        userEmail: userMap.get(log.userId)?.email || '',
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        details: log.details ? JSON.parse(log.details as string) : null,
        createdAt: log.createdAt,
      }));

      if (input.format === 'json') {
        return {
          format: 'json',
          data: JSON.stringify(enrichedLogs, null, 2),
          filename: `audit-log-${new Date().toISOString().split('T')[0]}.json`,
        };
      } else {
        // CSV format
        const headers = ['ID', 'User ID', 'User Name', 'User Email', 'Action', 'Entity Type', 'Entity ID', 'IP Address', 'User Agent', 'Details', 'Created At'];
        const rows = enrichedLogs.map(log => [
          log.id,
          log.userId,
          log.userName,
          log.userEmail,
          log.action,
          log.entityType || '',
          log.entityId || '',
          log.ipAddress || '',
          log.userAgent || '',
          JSON.stringify(log.details || {}),
          new Date(log.createdAt).toISOString(),
        ]);

        const csv = [headers, ...rows]
          .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
          .join('\n');

        return {
          format: 'csv',
          data: csv,
          filename: `audit-log-${new Date().toISOString().split('T')[0]}.csv`,
        };
      }
    }),
});
