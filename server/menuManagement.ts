import { getDb } from "./db";
import { menus, menuItems, InsertMenu, InsertMenuItem } from "../drizzle/schema";
import { eq, and, isNull, asc } from "drizzle-orm";

// Menu Management
export async function createMenu(data: InsertMenu) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(menus).values(data);
  return { id: Number((result as any).insertId) };
}

export async function getAllMenus() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(menus).orderBy(menus.name);
}

export async function getMenuById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(menus).where(eq(menus.id, id)).limit(1);
  return results[0] || null;
}

export async function getMenuBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(menus).where(eq(menus.slug, slug)).limit(1);
  return results[0] || null;
}

export async function getMenuByLocation(location: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(menus).where(eq(menus.location, location)).limit(1);
  return results[0] || null;
}

export async function updateMenu(id: number, data: Partial<InsertMenu>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(menus).set(data).where(eq(menus.id, id));
  return { success: true };
}

export async function deleteMenu(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Menu items will be cascade deleted automatically
  await db.delete(menus).where(eq(menus.id, id));
  return { success: true };
}

// Menu Item Management
export async function createMenuItem(data: InsertMenuItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(menuItems).values(data);
  return { id: Number((result as any).insertId) };
}

export async function getMenuItems(menuId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all items for this menu, ordered by menuOrder
  return await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.menuId, menuId))
    .orderBy(asc(menuItems.menuOrder));
}

export async function getMenuItemsHierarchical(menuId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all items
  const allItems = await getMenuItems(menuId);
  
  // Build hierarchical structure
  const itemMap = new Map();
  const rootItems: any[] = [];
  
  // First pass: create map of all items
  allItems.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  
  // Second pass: build hierarchy
  allItems.forEach(item => {
    const itemWithChildren = itemMap.get(item.id);
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(itemWithChildren);
      } else {
        // Parent not found, treat as root
        rootItems.push(itemWithChildren);
      }
    } else {
      rootItems.push(itemWithChildren);
    }
  });
  
  return rootItems;
}

export async function getMenuItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
  return results[0] || null;
}

export async function updateMenuItem(id: number, data: Partial<InsertMenuItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(menuItems).set(data).where(eq(menuItems.id, id));
  return { success: true };
}

export async function deleteMenuItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get children and update their parentId to null
  const children = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.parentId, id));
  
  for (const child of children) {
    await db.update(menuItems).set({ parentId: null }).where(eq(menuItems.id, child.id));
  }
  
  // Delete the item
  await db.delete(menuItems).where(eq(menuItems.id, id));
  return { success: true };
}

export async function reorderMenuItems(items: Array<{ id: number; menuOrder: number; parentId?: number | null }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update each item's order and parent
  for (const item of items) {
    await db
      .update(menuItems)
      .set({
        menuOrder: item.menuOrder,
        parentId: item.parentId ?? null,
      })
      .where(eq(menuItems.id, item.id));
  }
  
  return { success: true };
}

export async function bulkDeleteMenuItems(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const id of ids) {
    await deleteMenuItem(id);
  }
  
  return { success: true };
}

// Helper function to get menu with all items in hierarchical structure
export async function getMenuWithItems(menuId: number) {
  const menu = await getMenuById(menuId);
  if (!menu) return null;
  
  const items = await getMenuItemsHierarchical(menuId);
  
  return {
    ...menu,
    items,
  };
}

export async function getMenuWithItemsBySlug(slug: string) {
  const menu = await getMenuBySlug(slug);
  if (!menu) return null;
  
  const items = await getMenuItemsHierarchical(menu.id);
  
  return {
    ...menu,
    items,
  };
}

export async function getMenuWithItemsByLocation(location: string) {
  const menu = await getMenuByLocation(location);
  if (!menu) return null;
  
  const items = await getMenuItemsHierarchical(menu.id);
  
  return {
    ...menu,
    items,
  };
}
