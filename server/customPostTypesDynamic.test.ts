import { describe, it, expect, beforeAll } from "vitest";
import * as customPostTypes from "./customPostTypes";

describe("Custom Post Types Dynamic Pages", () => {
  let postTypeId: number;
  const testSlug = `test-portfolio-${Date.now()}`;

  beforeAll(async () => {
    // Create a test post type
    const result = await customPostTypes.createCustomPostType({
      name: "Test Portfolio",
      slug: testSlug,
      singularName: "Portfolio Item",
      pluralName: "Portfolio Items",
      description: "Test portfolio post type",
      icon: "briefcase",
      isPublic: 1,
      hasArchive: 1,
      hierarchical: 0,
      supportsTitle: 1,
      supportsContent: 1,
      supportsExcerpt: 1,
      supportsFeaturedImage: 1,
      supportsComments: 0,
      supportsCategories: 0,
      supportsTags: 0,
      menuPosition: 25,
    });
    postTypeId = result.id;
  });

  it("should retrieve post type by slug", async () => {
    const postType = await customPostTypes.getCustomPostTypeBySlug(testSlug);
    expect(postType).toBeDefined();
    expect(postType?.name).toBe("Test Portfolio");
    expect(postType?.slug).toBe(testSlug);
  });

  it("should have correct supported features", async () => {
    const postType = await customPostTypes.getCustomPostTypeBySlug(testSlug);
    expect(postType?.supportsTitle).toBe(1);
    expect(postType?.supportsContent).toBe(1);
    expect(postType?.supportsExcerpt).toBe(1);
    expect(postType?.supportsFeaturedImage).toBe(1);
  });
});
