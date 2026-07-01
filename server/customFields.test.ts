import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import * as customFields from "./customFields";

describe("Custom Fields System", () => {
  let testFieldId: number;
  let testFieldId2: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Clean up any existing test data
    await db.execute("DELETE FROM custom_field_values WHERE fieldId IN (SELECT id FROM custom_fields WHERE slug LIKE 'test_%')");
    await db.execute("DELETE FROM custom_fields WHERE slug LIKE 'test_%'");
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    await db.execute("DELETE FROM custom_field_values WHERE fieldId IN (SELECT id FROM custom_fields WHERE slug LIKE 'test_%')");
    await db.execute("DELETE FROM custom_fields WHERE slug LIKE 'test_%'");
  });

  describe("Custom Field Definition Management", () => {
    it("should create a custom field", async () => {
      const result = await customFields.createCustomField({
        name: "Test Project URL",
        slug: "test_project_url",
        type: "url",
        description: "URL to the project website",
        contentType: "post",
        defaultValue: "https://example.com",
        isRequired: 1,
        displayOrder: 1,
      });

      expect(result.id).toBeGreaterThan(0);
      testFieldId = result.id;
    });

    it("should create a select field with options", async () => {
      const result = await customFields.createCustomField({
        name: "Test Project Status",
        slug: "test_project_status",
        type: "select",
        description: "Current status of the project",
        contentType: "post",
        options: "Planning\nIn Progress\nCompleted\nOn Hold",
        isRequired: 0,
        displayOrder: 2,
      });

      expect(result.id).toBeGreaterThan(0);
      testFieldId2 = result.id;
    });

    it("should retrieve all custom fields", async () => {
      const fields = await customFields.getAllCustomFields();
      expect(fields.length).toBeGreaterThanOrEqual(2);
      
      const testFields = fields.filter(f => f.slug.startsWith("test_"));
      expect(testFields.length).toBeGreaterThanOrEqual(2);
    });

    it("should retrieve a custom field by id", async () => {
      const field = await customFields.getCustomFieldById(testFieldId);
      expect(field).toBeDefined();
      expect(field?.slug).toBe("test_project_url");
      expect(field?.type).toBe("url");
      expect(field?.isRequired).toBe(1);
    });

    it("should retrieve custom fields by content type", async () => {
      const fields = await customFields.getCustomFieldsByContentType("post");
      expect(fields.length).toBeGreaterThanOrEqual(2);
      
      const testFields = fields.filter(f => f.slug.startsWith("test_"));
      expect(testFields.length).toBeGreaterThanOrEqual(2);
    });

    it("should update a custom field", async () => {
      await customFields.updateCustomField(testFieldId, {
        description: "Updated description for project URL",
        isRequired: 0,
      });

      const field = await customFields.getCustomFieldById(testFieldId);
      expect(field?.description).toBe("Updated description for project URL");
      expect(field?.isRequired).toBe(0);
    });
  });

  describe("Custom Field Values Management", () => {
    const testContentId = 999; // Mock content ID
    const testContentType = "post";

    it("should set a custom field value", async () => {
      const result = await customFields.setCustomFieldValue({
        fieldId: testFieldId,
        contentType: testContentType,
        contentId: testContentId,
        value: "https://testproject.com",
      });

      expect(result.success).toBe(true);
    });

    it("should retrieve a custom field value", async () => {
      const value = await customFields.getCustomFieldValue(testFieldId, testContentId);
      expect(value).toBe("https://testproject.com");
    });

    it("should update an existing custom field value", async () => {
      await customFields.setCustomFieldValue({
        fieldId: testFieldId,
        contentType: testContentType,
        contentId: testContentId,
        value: "https://updatedproject.com",
      });

      const value = await customFields.getCustomFieldValue(testFieldId, testContentId);
      expect(value).toBe("https://updatedproject.com");
    });

    it("should set multiple field values at once", async () => {
      const values = {
        [testFieldId]: "https://bulkproject.com",
        [testFieldId2]: "In Progress",
      };

      const result = await customFields.bulkSetCustomFieldValues(
        testContentId,
        testContentType,
        values
      );

      expect(result.success).toBe(true);
    });

    it("should retrieve all field values for content", async () => {
      const values = await customFields.getCustomFieldValuesByContent(
        testContentId,
        testContentType
      );

      expect(values.length).toBeGreaterThanOrEqual(2);
      
      const urlField = values.find(v => v.fieldId === testFieldId);
      expect(urlField?.value).toBe("https://bulkproject.com");
      
      const statusField = values.find(v => v.fieldId === testFieldId2);
      expect(statusField?.value).toBe("In Progress");
    });

    it("should delete a custom field value", async () => {
      await customFields.deleteCustomFieldValue(testFieldId, testContentId);

      const value = await customFields.getCustomFieldValue(testFieldId, testContentId);
      expect(value).toBeNull();
    });
  });

  describe("Custom Field Deletion", () => {
    it("should delete a custom field and its values", async () => {
      // Create a new field for deletion test
      const newField = await customFields.createCustomField({
        name: "Test Delete Field",
        slug: "test_delete_field",
        type: "text",
        contentType: "post",
      });
      const deleteFieldId = Number(newField.id);
      expect(deleteFieldId).toBeGreaterThan(0);

      // Set a value first
      await customFields.setCustomFieldValue({
        fieldId: deleteFieldId,
        contentType: "post",
        contentId: 888,
        value: "Completed",
      });

      // Delete the field
      await customFields.deleteCustomField(deleteFieldId);

      // Field should not exist
      const field = await customFields.getCustomFieldById(deleteFieldId);
      expect(field).toBeNull();

      // Values should also be deleted
      const value = await customFields.getCustomFieldValue(deleteFieldId, 888);
      expect(value).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle non-existent field gracefully", async () => {
      const field = await customFields.getCustomFieldById(999999);
      expect(field).toBeNull();
    });

    it("should handle non-existent field value gracefully", async () => {
      const value = await customFields.getCustomFieldValue(999999, 999999);
      expect(value).toBeNull();
    });

    it("should handle empty content type filter", async () => {
      const fields = await customFields.getCustomFieldsByContentType("nonexistent_type");
      expect(fields).toEqual([]);
    });

    it("should handle bulk set with empty values", async () => {
      const result = await customFields.bulkSetCustomFieldValues(777, "post", {});
      expect(result.success).toBe(true);
    });
  });
});
