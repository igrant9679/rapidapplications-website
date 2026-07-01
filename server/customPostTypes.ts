import { getDb } from "./db";
import { customPostTypes, customPostItems, InsertCustomPostType, InsertCustomPostItem } from "../drizzle/schema";
import { eq, desc, and, like, or } from "drizzle-orm";

// Custom Post Type Management
export async function createCustomPostType(data: InsertCustomPostType) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customPostTypes).values(data);
  return { id: Number((result as any).insertId) };
}

export async function getAllCustomPostTypes() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customPostTypes).orderBy(customPostTypes.menuPosition, customPostTypes.name);
}

export async function getCustomPostTypeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(customPostTypes).where(eq(customPostTypes.id, id)).limit(1);
  return results[0] || null;
}

export async function getCustomPostTypeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(customPostTypes).where(eq(customPostTypes.slug, slug)).limit(1);
  return results[0] || null;
}

export async function updateCustomPostType(id: number, data: Partial<InsertCustomPostType>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(customPostTypes).set(data).where(eq(customPostTypes.id, id));
  return { success: true };
}

export async function deleteCustomPostType(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete all items of this type first
  await db.delete(customPostItems).where(eq(customPostItems.postTypeId, id));
  
  // Then delete the post type
  await db.delete(customPostTypes).where(eq(customPostTypes.id, id));
  return { success: true };
}

// Custom Post Item Management
export async function createCustomPostItem(data: InsertCustomPostItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customPostItems).values(data);
  return { id: Number((result as any).insertId) };
}

export async function getCustomPostItemsByType(postTypeId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(customPostItems.postTypeId, postTypeId)];
  if (status) {
    conditions.push(eq(customPostItems.status, status as any));
  }
  
  return await db
    .select()
    .from(customPostItems)
    .where(and(...conditions))
    .orderBy(desc(customPostItems.createdAt));
}

export async function getCustomPostItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(customPostItems).where(eq(customPostItems.id, id)).limit(1);
  return results[0] || null;
}

export async function getCustomPostItemBySlug(postTypeSlug: string, itemSlug: string) {
  const db = await getDb();
  if (!db) return null;
  
  // First get the post type
  const postType = await getCustomPostTypeBySlug(postTypeSlug);
  if (!postType) return null;
  
  // Then get the item
  const results = await db
    .select()
    .from(customPostItems)
    .where(
      and(
        eq(customPostItems.postTypeId, postType.id),
        eq(customPostItems.slug, itemSlug)
      )
    )
    .limit(1);
  
  return results[0] || null;
}

export async function updateCustomPostItem(id: number, data: Partial<InsertCustomPostItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(customPostItems).set(data).where(eq(customPostItems.id, id));
  return { success: true };
}

export async function deleteCustomPostItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(customPostItems).where(eq(customPostItems.id, id));
  return { success: true };
}

export async function searchCustomPostItems(postTypeId: number, query: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(customPostItems)
    .where(
      and(
        eq(customPostItems.postTypeId, postTypeId),
        or(
          like(customPostItems.title, `%${query}%`),
          like(customPostItems.content, `%${query}%`)
        )
      )
    )
    .orderBy(desc(customPostItems.createdAt))
    .limit(50);
}

export async function bulkUpdateCustomPostItemStatus(ids: number[], status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const id of ids) {
    await db.update(customPostItems).set({ status: status as any }).where(eq(customPostItems.id, id));
  }
  
  return { success: true };
}

export async function bulkDeleteCustomPostItems(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const id of ids) {
    await db.delete(customPostItems).where(eq(customPostItems.id, id));
  }
  
  return { success: true };
}
