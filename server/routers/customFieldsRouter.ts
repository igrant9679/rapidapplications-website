import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import * as customFields from "../customFields";

export const customFieldsRouter = router({
  // Custom field definition management
  createField: adminProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        type: z.enum(["text", "textarea", "number", "select", "checkbox", "date", "file", "url", "email"]),
        description: z.string().optional(),
        contentType: z.string(),
        defaultValue: z.string().optional(),
        options: z.string().optional(),
        isRequired: z.number().default(0),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      return await customFields.createCustomField(input);
    }),

  listFields: adminProcedure
    .input(
      z.object({
        contentType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.contentType) {
        return await customFields.getCustomFieldsByContentType(input.contentType);
      }
      return await customFields.getAllCustomFields();
    }),

  getField: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await customFields.getCustomFieldById(input.id);
    }),

  updateField: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        type: z.enum(["text", "textarea", "number", "select", "checkbox", "date", "file", "url", "email"]).optional(),
        description: z.string().optional(),
        defaultValue: z.string().optional(),
        options: z.string().optional(),
        isRequired: z.number().optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await customFields.updateCustomField(id, data);
    }),

  deleteField: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await customFields.deleteCustomField(input.id);
    }),

  // Custom field values management
  getFieldValues: adminProcedure
    .input(
      z.object({
        entityType: z.enum(["post", "page", "custom_post_item"]),
        entityId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await customFields.getCustomFieldValuesByContent(input.entityId, input.entityType);
    }),

  setFieldValue: adminProcedure
    .input(
      z.object({
        fieldId: z.number(),
        entityType: z.enum(["post", "page", "custom_post_item"]),
        entityId: z.number(),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await customFields.setCustomFieldValue({
        fieldId: input.fieldId,
        contentType: input.entityType,
        contentId: input.entityId,
        value: input.value,
      });
    }),

  bulkSetFieldValues: adminProcedure
    .input(
      z.object({
        entityType: z.enum(["post", "page", "custom_post_item"]),
        entityId: z.number(),
        values: z.array(
          z.object({
            fieldId: z.number(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const valuesMap: Record<number, string> = {};
      input.values.forEach(v => {
        valuesMap[v.fieldId] = v.value;
      });
      return await customFields.bulkSetCustomFieldValues(
        input.entityId,
        input.entityType,
        valuesMap
      );
    }),

  // Public procedures for frontend display
  getFieldsByContentTypePublic: publicProcedure
    .input(
      z.object({
        contentType: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await customFields.getCustomFieldsByContentType(input.contentType);
    }),

  getFieldValuesByContentPublic: publicProcedure
    .input(
      z.object({
        entityType: z.enum(["post", "page", "custom_post_item"]),
        entityId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await customFields.getCustomFieldValuesByContent(input.entityId, input.entityType);
    }),
});
