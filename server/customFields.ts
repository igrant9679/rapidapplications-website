import { getDb } from "./db";
import { customFields, customFieldValues } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Custom Field Management
export async function createCustomField(data: {
  name: string;
  slug: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "file" | "url" | "email";
  description?: string;
  defaultValue?: string;
  options?: string;
  isRequired?: number;
  contentType: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const result = await db.insert(customFields).values(data);
  const insertId = Number((result as any).insertId || (result as any)[0]?.insertId || 0);
  if (insertId === 0 || isNaN(insertId)) {
    throw new Error("Failed to get insert ID for custom field");
  }
  return { success: true, insertId };
}

export async function getAllCustomFields() {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return await db.select().from(customFields);
}

export async function getCustomFieldById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const results = await db.select().from(customFields).where(eq(customFields.id, id));
  return results[0] || null;
}

export async function getCustomFieldsByContentType(contentType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return await db.select().from(customFields).where(eq(customFields.contentType, contentType));
}

export async function updateCustomField(id: number, data: Partial<{
  name: string;
  slug: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "file" | "url" | "email";
  description: string;
  defaultValue: string;
  options: string;
  isRequired: number;
  contentType: string;
  displayOrder: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(customFields).set(data as any).where(eq(customFields.id, id));
  return { success: true };
}

export async function deleteCustomField(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  // Delete all values first
  await db.delete(customFieldValues).where(eq(customFieldValues.fieldId, id));
  // Then delete the field
  await db.delete(customFields).where(eq(customFields.id, id));
  return { success: true };
}

// Custom Field Values Management
export async function setCustomFieldValue(data: {
  fieldId: number;
  contentId: number;
  contentType: string;
  value: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  // Check if value already exists
  const existing = await db.select().from(customFieldValues).where(
    and(
      eq(customFieldValues.fieldId, data.fieldId),
      eq(customFieldValues.contentId, data.contentId)
    )
  );

  if (existing.length > 0) {
    // Update existing value
    await db.update(customFieldValues)
      .set({ value: data.value, updatedAt: new Date() })
      .where(eq(customFieldValues.id, existing[0].id));
    return { success: true, id: existing[0].id };
  } else {
    // Insert new value
    const result = await db.insert(customFieldValues).values(data);
    const insertId = Number((result as any).insertId || (result as any)[0]?.insertId || 0);
    if (insertId === 0 || isNaN(insertId)) {
      throw new Error("Failed to get insert ID for custom field value");
    }
    return { success: true, id: insertId };
  }
}

export async function getCustomFieldValue(fieldId: number, contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const results = await db.select().from(customFieldValues).where(
    and(
      eq(customFieldValues.fieldId, fieldId),
      eq(customFieldValues.contentId, contentId)
    )
  );
  return results[0]?.value || null;
}

export async function getCustomFieldValuesByContent(contentId: number, contentType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return await db.select().from(customFieldValues).where(
    and(
      eq(customFieldValues.contentId, contentId),
      eq(customFieldValues.contentType, contentType)
    )
  );
}

export async function deleteCustomFieldValue(fieldId: number, contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(customFieldValues).where(
    and(
      eq(customFieldValues.fieldId, fieldId),
      eq(customFieldValues.contentId, contentId)
    )
  );
  return { success: true };
}

export async function bulkSetCustomFieldValues(contentId: number, contentType: string, values: Record<number, string>) {
  const promises = Object.entries(values).map(([fieldId, value]) =>
    setCustomFieldValue({
      fieldId: Number(fieldId),
      contentId,
      contentType,
      value,
    })
  );
  await Promise.all(promises);
  return { success: true };
}
