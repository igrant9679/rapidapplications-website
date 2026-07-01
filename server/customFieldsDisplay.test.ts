import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import * as customFields from "./customFields";
import { getDb } from "./db";
import { users, blogPosts, cmsPages } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Custom Fields Frontend Display", () => {
  let testAuthorId: number;
  let testPostId: number;
  let testPageId: number;
  let testFieldId: number;

  beforeAll(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    // Create test author
    const authorResult = await database.insert(users).values({
      openId: `test-author-${Date.now()}`,
      name: "Test Author",
      role: "author",
    });
    const authorInsertId = (authorResult as any)[0]?.insertId;
    testAuthorId = Number(authorInsertId);

    // Create test post
    const postResult = await database.insert(blogPosts).values({
      title: "Test Post with Custom Fields",
      slug: `test-post-cf-${Date.now()}`,
      content: "Test content",
      excerpt: "Test excerpt",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
    });
    const postInsertId = (postResult as any)[0]?.insertId;
    testPostId = Number(postInsertId);

    // Create test page
    const pageResult = await database.insert(cmsPages).values({
      title: "Test Page with Custom Fields",
      slug: `test-page-cf-${Date.now()}`,
      content: "Test page content",
      authorId: testAuthorId,
      status: "published",
    });
    const pageInsertId = (pageResult as any)[0]?.insertId;
    testPageId = Number(pageInsertId);

    // Create test custom field
    const fieldResult = await customFields.createCustomField({
      name: "Project URL",
      slug: "project-url",
      fieldType: "url",
      contentType: "post",
      description: "Link to the project",
      isRequired: 0,
      displayOrder: 1,
    });
    testFieldId = fieldResult.insertId;

    // Set field value for the test post
    await customFields.setCustomFieldValue({
      fieldId: testFieldId,
      contentId: testPostId,
      contentType: "post",
      value: "https://example.com/project",
    });
  });

  afterAll(async () => {
    const database = await getDb();
    if (!database) return;

    // Clean up test data
    await customFields.deleteCustomField(testFieldId);
    await database.delete(blogPosts).where(eq(blogPosts.id, testPostId));
    await database.delete(cmsPages).where(eq(cmsPages.id, testPageId));
    await database.delete(users).where(eq(users.id, testAuthorId));
  });

  it("should get custom fields by content type", async () => {
    const fields = await customFields.getCustomFieldsByContentType("post");
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
    
    // Find the specific field we created
    const testField = fields.find((f: any) => f.slug === "project-url");
    expect(testField).toBeDefined();
    expect(testField?.name).toBe("Project URL");
    expect(testField?.type).toBe("url");
  });

  it("should get custom field values by content", async () => {
    const values = await customFields.getCustomFieldValuesByContent(testPostId, "post");
    expect(values).toBeDefined();
    expect(Array.isArray(values)).toBe(true);
    
    const testValue = values.find((v: any) => v.fieldId === testFieldId);
    expect(testValue).toBeDefined();
    expect(testValue?.value).toBe("https://example.com/project");
  });

  it("should return empty array for content with no custom field values", async () => {
    const values = await customFields.getCustomFieldValuesByContent(testPageId, "page");
    expect(values).toBeDefined();
    expect(Array.isArray(values)).toBe(true);
    expect(values.length).toBe(0);
  });

  it("should handle multiple custom fields for same content type", async () => {
    // Create another field
    const field2Result = await customFields.createCustomField({
      name: "Project Date",
      slug: "project-date",
      fieldType: "date",
      contentType: "post",
      description: "Project start date",
      isRequired: 0,
      displayOrder: 2,
    });
    const field2Id = field2Result.insertId;

    // Set value for second field
    await customFields.setCustomFieldValue({
      fieldId: field2Id,
      contentId: testPostId,
      contentType: "post",
      value: "2026-01-23",
    });

    // Get all values
    const values = await customFields.getCustomFieldValuesByContent(testPostId, "post");
    expect(values.length).toBeGreaterThanOrEqual(2);

    const urlField = values.find((v: any) => v.fieldId === testFieldId);
    const dateField = values.find((v: any) => v.fieldId === field2Id);

    expect(urlField?.value).toBe("https://example.com/project");
    expect(dateField?.value).toBe("2026-01-23");

    // Clean up
    await customFields.deleteCustomField(field2Id);
  });

  it("should handle different field types correctly", async () => {
    const fieldTypes = [
      { name: "Text Field", slug: "text-field", type: "text", value: "Sample text" },
      { name: "Number Field", slug: "number-field", type: "number", value: "42" },
      { name: "Checkbox Field", slug: "checkbox-field", type: "checkbox", value: "true" },
      { name: "Email Field", slug: "email-field", type: "email", value: "test@example.com" },
    ];

    const createdFields: number[] = [];

    for (const fieldType of fieldTypes) {
      const result = await customFields.createCustomField({
        name: fieldType.name,
        slug: fieldType.slug,
        fieldType: fieldType.type as any,
        contentType: "page",
        isRequired: 0,
        displayOrder: 1,
      });
      createdFields.push(result.insertId);

      await customFields.setCustomFieldValue({
        fieldId: result.insertId,
        contentId: testPageId,
        contentType: "page",
        value: fieldType.value,
      });
    }

    const values = await customFields.getCustomFieldValuesByContent(testPageId, "page");
    expect(values.length).toBe(fieldTypes.length);

    // Verify each field type value
    for (let i = 0; i < fieldTypes.length; i++) {
      const value = values.find((v: any) => v.fieldId === createdFields[i]);
      expect(value?.value).toBe(fieldTypes[i].value);
    }

    // Clean up
    for (const fieldId of createdFields) {
      await customFields.deleteCustomField(fieldId);
    }
  });

  it("should filter fields by content type correctly", async () => {
    // Create fields for different content types
    const postField = await customFields.createCustomField({
      name: "Post Only Field",
      slug: "post-only",
      fieldType: "text",
      contentType: "post",
      isRequired: 0,
      displayOrder: 1,
    });

    const pageField = await customFields.createCustomField({
      name: "Page Only Field",
      slug: "page-only",
      fieldType: "text",
      contentType: "page",
      isRequired: 0,
      displayOrder: 1,
    });

    // Get post fields
    const postFields = await customFields.getCustomFieldsByContentType("post");
    const hasPostField = postFields.some((f: any) => f.id === postField.insertId);
    const hasPageField = postFields.some((f: any) => f.id === pageField.insertId);

    expect(hasPostField).toBe(true);
    expect(hasPageField).toBe(false);

    // Get page fields
    const pageFields = await customFields.getCustomFieldsByContentType("page");
    const hasPostFieldInPage = pageFields.some((f: any) => f.id === postField.insertId);
    const hasPageFieldInPage = pageFields.some((f: any) => f.id === pageField.insertId);

    expect(hasPostFieldInPage).toBe(false);
    expect(hasPageFieldInPage).toBe(true);

    // Clean up
    await customFields.deleteCustomField(postField.insertId);
    await customFields.deleteCustomField(pageField.insertId);
  });
});
