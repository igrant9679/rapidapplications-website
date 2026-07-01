import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submitDemo", () => {
  it("sends demo request email with correct data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock successful axios post
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const input = {
      name: "John Doe",
      email: "john@example.com",
      organization: "Test Org",
      phone: "555-1234",
      message: "I want to see a demo",
    };

    const result = await caller.contact.submitDemo(input);

    expect(result.success).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/v1/notification/send"),
      expect.objectContaining({
        to: "sales@communityforce.com",
        subject: expect.stringContaining("Demo Request from John Doe"),
        content: expect.stringContaining("John Doe"),
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );
  });

  it("handles missing optional fields gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const input = {
      name: "Jane Smith",
      email: "jane@example.com",
      organization: "Another Org",
    };

    const result = await caller.contact.submitDemo(input);

    expect(result.success).toBe(true);
  });
});

describe("contact.submitExpert", () => {
  it("sends expert consultation request email with correct data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const input = {
      name: "Alice Johnson",
      email: "alice@example.com",
      organization: "Expert Seekers Inc",
      phone: "555-5678",
      message: "Need help with grant management",
    };

    const result = await caller.contact.submitExpert(input);

    expect(result.success).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/v1/notification/send"),
      expect.objectContaining({
        to: "sales@communityforce.com",
        subject: expect.stringContaining("Expert Consultation Request from Alice Johnson"),
        content: expect.stringContaining("Alice Johnson"),
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );
  });

  it("handles API errors gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

    const input = {
      name: "Bob Wilson",
      email: "bob@example.com",
      organization: "Test Company",
    };

    await expect(caller.contact.submitExpert(input)).rejects.toThrow();
  });
});
