import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mysql from "mysql2/promise";
import * as customFields from "./customFields";

let conn: mysql.Connection;

beforeAll(async () => {
  conn = await mysql.createConnection(process.env.DATABASE_URL!);
});

afterAll(async () => {
  await conn.end();
});

describe("Custom Fields Editor Integration", () => {
  let testFieldId: number;
  let testPostId: number;
  let testPageId: number;

  it("should create a custom field for blog posts", async () => {
    const result = await customFields.createCustomField({
      name: "Project URL",
      slug: "project-url",
      type: "url",
      description: "Link to the project repository or website",
      contentType: "post",
      isRequired: 0,
      displayOrder: 1,
    });

    expect(result.success).toBe(true);
    testFieldId = result.insertId!;
  });

  it("should fetch custom fields by content type", async () => {
    const fields = await customFields.getCustomFieldsByContentType("post");
    
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
    
    const projectUrlField = fields.find((f: any) => f.slug === "project-url");
    expect(projectUrlField).toBeDefined();
    expect(projectUrlField?.name).toBe("Project URL");
    expect(projectUrlField?.type).toBe("url");
  });

  it("should save custom field value for a blog post", async () => {
    // Create a test blog post
    const [postResult] = await conn.query(
      `INSERT INTO blog_posts (title, slug, content, authorId, status) VALUES (?, ?, ?, ?, ?)`,
      ["Test Post with Custom Fields", "test-post-custom-fields", "Test content", 1, "draft"]
    );
    testPostId = (postResult as any).insertId;

    // Set custom field value
    const result = await customFields.setCustomFieldValue({
      fieldId: testFieldId,
      contentType: "post",
      contentId: testPostId,
      value: "https://github.com/test/project",
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve custom field values for a blog post", async () => {
    const values = await customFields.getCustomFieldValuesByContent(testPostId, "post");
    
    expect(Array.isArray(values)).toBe(true);
    expect(values.length).toBeGreaterThan(0);
    
    const projectUrlValue = values.find((v: any) => v.fieldId === testFieldId);
    expect(projectUrlValue).toBeDefined();
    expect(projectUrlValue?.value).toBe("https://github.com/test/project");
  });

  it("should bulk set custom field values", async () => {
    // Create another test field
    const field2Result = await customFields.createCustomField({
      name: "Project Status",
      slug: "project-status",
      type: "select",
      description: "Current status of the project",
      contentType: "post",
      options: JSON.stringify(["Planning", "In Progress", "Completed"]),
      isRequired: 0,
      displayOrder: 2,
    });

    expect(field2Result.success).toBe(true);
    expect(field2Result.insertId).toBeDefined();
    const field2Id = field2Result.insertId!;

    // Bulk set values - ensure IDs are numbers
    const valuesMap: Record<number, string> = {};
    valuesMap[Number(testFieldId)] = "https://github.com/test/updated-project";
    valuesMap[Number(field2Id)] = "In Progress";

    const result = await customFields.bulkSetCustomFieldValues(testPostId, "post", valuesMap);
    expect(result.success).toBe(true);

    // Verify values were set
    const values = await customFields.getCustomFieldValuesByContent(testPostId, "post");
    expect(values.length).toBe(2);

    const urlValue = values.find((v: any) => v.fieldId === testFieldId);
    expect(urlValue?.value).toBe("https://github.com/test/updated-project");

    const statusValue = values.find((v: any) => v.fieldId === field2Id);
    expect(statusValue?.value).toBe("In Progress");

    // Cleanup
    await customFields.deleteCustomField(field2Id);
  });

  it("should create a custom field for pages", async () => {
    const result = await customFields.createCustomField({
      name: "Page Template",
      slug: "page-template",
      type: "select",
      description: "Layout template for the page",
      contentType: "page",
      options: JSON.stringify(["Default", "Full Width", "Sidebar"]),
      isRequired: 0,
      displayOrder: 1,
    });

    expect(result.success).toBe(true);
    const pageFieldId = result.insertId!;

    // Create a test page
    const [pageResult] = await conn.query(
      `INSERT INTO cms_pages (title, slug, content, status, authorId) VALUES (?, ?, ?, ?, ?)`,
      ["Test Page with Custom Fields", "test-page-custom-fields", "Test content", "draft", 1]
    );
    testPageId = (pageResult as any).insertId;

    // Set custom field value
    const setResult = await customFields.setCustomFieldValue({
      fieldId: pageFieldId,
      contentType: "page",
      contentId: testPageId,
      value: "Full Width",
    });

    expect(setResult.success).toBe(true);

    // Verify value was set
    const values = await customFields.getCustomFieldValuesByContent(testPageId, "page");
    expect(values.length).toBe(1);
    expect(values[0].value).toBe("Full Width");

    // Cleanup
    await customFields.deleteCustomField(pageFieldId);
  });

  it("should handle empty custom fields gracefully", async () => {
    const fields = await customFields.getCustomFieldsByContentType("nonexistent-type");
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBe(0);
  });

  it("should handle missing content ID gracefully", async () => {
    const values = await customFields.getCustomFieldValuesByContent(99999, "post");
    expect(Array.isArray(values)).toBe(true);
    expect(values.length).toBe(0);
  });

  // Cleanup
  afterAll(async () => {
    // Delete test data
    if (testPostId) {
      await conn.query("DELETE FROM custom_field_values WHERE contentId = ? AND contentType = ?", [testPostId, "post"]);
      await conn.query("DELETE FROM blog_posts WHERE id = ?", [testPostId]);
    }
    if (testPageId) {
      await conn.query("DELETE FROM custom_field_values WHERE contentId = ? AND contentType = ?", [testPageId, "page"]);
      await conn.query("DELETE FROM cms_pages WHERE id = ?", [testPageId]);
    }
    if (testFieldId) {
      await customFields.deleteCustomField(testFieldId);
    }
  });
});
