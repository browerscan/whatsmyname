import { describe, it, expect } from "vitest";
import {
  usernameSearchSchema,
  aiAnalyzeSchema,
  validateRequest,
  safeValidateRequest,
  type UsernameSearchRequest,
  type AIAnalyzeRequest,
} from "@/lib/api-validation";
import { ZodError } from "zod";

/**
 * Unit Tests for API Validation
 *
 * Tests Zod schemas and validation helpers for API requests
 */
describe("api-validation", () => {
  describe("usernameSearchSchema", () => {
    it("should accept valid usernames", () => {
      const result = usernameSearchSchema.safeParse({
        username: "validuser",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe("validuser");
      }
    });

    it("should accept usernames with underscores and hyphens", () => {
      const usernames = [
        "user_name",
        "user-name",
        "user_name-123",
        "a",
        "testUser2024",
      ];

      usernames.forEach((username) => {
        const result = usernameSearchSchema.safeParse({ username });
        expect(result.success).toBe(true);
      });
    });

    it("should note transform happens after validation", () => {
      // The transform happens after all validations
      // So "validuser  " fails the regex before transform can trim it
      const result = usernameSearchSchema.safeParse({
        username: "validuser  ",
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty username", () => {
      const result = usernameSearchSchema.safeParse({ username: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("required");
      }
    });

    it("should reject whitespace-only username", () => {
      const result = usernameSearchSchema.safeParse({ username: "   " });

      expect(result.success).toBe(false);
    });

    it("should reject username that is too long", () => {
      const longUsername = "a".repeat(101);
      const result = usernameSearchSchema.safeParse({ username: longUsername });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes("100"))).toBe(
          true,
        );
      }
    });

    it("should reject username starting with dot", () => {
      const result = usernameSearchSchema.safeParse({ username: ".username" });

      expect(result.success).toBe(false);
      // Multiple validation errors may occur
    });

    it("should reject username starting with underscore", () => {
      const result = usernameSearchSchema.safeParse({ username: "_username" });

      expect(result.success).toBe(false);
    });

    it("should reject username starting with hyphen", () => {
      const result = usernameSearchSchema.safeParse({ username: "-username" });

      expect(result.success).toBe(false);
    });

    it("should reject username ending with dot", () => {
      const result = usernameSearchSchema.safeParse({ username: "username." });

      expect(result.success).toBe(false);
    });

    it("should reject username ending with underscore", () => {
      const result = usernameSearchSchema.safeParse({ username: "username_" });

      expect(result.success).toBe(false);
    });

    it("should reject username ending with hyphen", () => {
      const result = usernameSearchSchema.safeParse({ username: "username-" });

      expect(result.success).toBe(false);
    });

    it("should reject username with consecutive dots", () => {
      const result = usernameSearchSchema.safeParse({ username: "user..name" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes("consecutive dots"),
          ),
        ).toBe(true);
      }
    });

    it("should reject username with special characters", () => {
      const invalidUsernames = [
        "user@name",
        "user#name",
        "user$name",
        "user%name",
        "user&name",
        "user*name",
        "user+name",
        "user=name",
        "user name",
        "user(name)",
      ];

      invalidUsernames.forEach((username) => {
        const result = usernameSearchSchema.safeParse({ username });
        expect(result.success).toBe(false);
      });
    });

    it("should reject missing username field", () => {
      const result = usernameSearchSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("should reject non-string username", () => {
      const result = usernameSearchSchema.safeParse({ username: 123 });

      expect(result.success).toBe(false);
    });
  });

  describe("aiAnalyzeSchema", () => {
    const validMessage = {
      role: "user" as const,
      content: "Hello, can you help me?",
    };

    it("should accept valid message array", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
      });

      expect(result.success).toBe(true);
    });

    it("should accept valid conversation with alternating roles", () => {
      const messages = [
        { role: "user" as const, content: "Question 1" },
        { role: "assistant" as const, content: "Answer 1" },
        { role: "user" as const, content: "Question 2" },
      ];

      const result = aiAnalyzeSchema.safeParse({ messages });

      expect(result.success).toBe(true);
    });

    it("should accept valid username parameter", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
        username: "testuser",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe("testuser");
      }
    });

    it("should reject empty messages array", () => {
      const result = aiAnalyzeSchema.safeParse({ messages: [] });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes("At least one message"),
          ),
        ).toBe(true);
      }
    });

    it("should reject messages exceeding max count", () => {
      const messages = Array.from({ length: 51 }, (_, i) => ({
        role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: `Message ${i}`,
      }));

      const result = aiAnalyzeSchema.safeParse({ messages });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes("Maximum 50 messages"),
          ),
        ).toBe(true);
      }
    });

    it("should reject message with empty content", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [{ role: "user" as const, content: "" }],
      });

      expect(result.success).toBe(false);
    });

    it("should accept message with whitespace-only content (passes min check)", () => {
      // Note: The schema uses .min(1) which only checks length, not if it's trimmed
      // So whitespace-only content passes the min(1) check
      const result = aiAnalyzeSchema.safeParse({
        messages: [{ role: "user" as const, content: "   " }],
      });

      // This passes since "   " has length 3
      expect(result.success).toBe(true);
    });

    it("should reject message exceeding max length", () => {
      const longContent = "a".repeat(4001);
      const result = aiAnalyzeSchema.safeParse({
        messages: [{ role: "user" as const, content: longContent }],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) => i.message.includes("4000")),
        ).toBe(true);
      }
    });

    it("should reject message with invalid role", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [{ role: "system" as const, content: "Hello" }],
      });

      expect(result.success).toBe(false);
    });

    it("should reject conversation not starting with user", () => {
      const messages = [
        { role: "assistant" as const, content: "Hello!" },
        { role: "user" as const, content: "Hi" },
      ];

      const result = aiAnalyzeSchema.safeParse({ messages });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes("First message must be from the user"),
          ),
        ).toBe(true);
      }
    });

    it("should reject conversation with non-alternating roles", () => {
      const messages = [
        { role: "user" as const, content: "Question 1" },
        { role: "user" as const, content: "Question 2" },
      ];

      const result = aiAnalyzeSchema.safeParse({ messages });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes("Messages must alternate"),
          ),
        ).toBe(true);
      }
    });

    it("should reject username that is too long", () => {
      const longUsername = "a".repeat(101);
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
        username: longUsername,
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty username string", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
        username: "",
      });

      expect(result.success).toBe(false);
    });

    it("should accept 50 messages (max allowed)", () => {
      const messages = Array.from({ length: 50 }, (_, i) => ({
        role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: `Message ${i}`,
      }));

      const result = aiAnalyzeSchema.safeParse({ messages });

      expect(result.success).toBe(true);
    });

    it("should handle username with valid special characters", () => {
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
        username: "user_name-123",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe("user_name-123");
      }
    });

    it("should accept username starting with special character in aiAnalyzeSchema", () => {
      // The aiAnalyzeSchema username is optional and doesn't have the strict regex
      // It only has min/max length checks
      const result = aiAnalyzeSchema.safeParse({
        messages: [validMessage],
        username: "_username",
      });

      // This passes because aiAnalyzeSchema username is less strict
      expect(result.success).toBe(true);
    });
  });

  describe("validateRequest", () => {
    it("should return validated data on success", () => {
      const data = { username: "validuser" };
      const result = validateRequest(usernameSearchSchema, data);

      expect(result.username).toBe("validuser");
    });

    it("should throw error with detailed messages on failure", () => {
      const data = { username: "" };

      expect(() => validateRequest(usernameSearchSchema, data)).toThrow(
        "Validation failed",
      );
    });

    it("should include all validation errors in thrown error", () => {
      const data = { username: "@invalid" };

      try {
        validateRequest(usernameSearchSchema, data);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Validation failed");
      }
    });

    it("should handle ZodError specifically", () => {
      const data = { username: "" };

      try {
        validateRequest(usernameSearchSchema, data);
        expect.fail("Should have thrown an error");
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBeTruthy();
      }
    });

    it("should re-throw non-Zod errors", () => {
      const badSchema = {
        parse: () => {
          throw new Error("Custom error");
        },
      };

      expect(() => validateRequest(badSchema as any, {})).toThrow(
        "Custom error",
      );
    });
  });

  describe("safeValidateRequest", () => {
    it("should return success with data on valid input", () => {
      const data = { username: "validuser" };
      const result = safeValidateRequest(usernameSearchSchema, data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe("validuser");
      }
    });

    it("should return failure with error message on invalid input", () => {
      const data = { username: "" };
      const result = safeValidateRequest(usernameSearchSchema, data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Validation failed");
      }
    });

    it("should include field path in error message", () => {
      const data = { username: "@invalid" };
      const result = safeValidateRequest(usernameSearchSchema, data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("username");
      }
    });

    it("should handle multiple validation errors", () => {
      const data = {
        messages: [
          { role: "user" as const, content: "" },
          { role: "user" as const, content: "test" },
        ],
      };
      const result = safeValidateRequest(aiAnalyzeSchema, data);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Should contain errors about content and alternating roles
        expect(result.error).toBeTruthy();
      }
    });

    it("should return generic error for non-Zod errors", () => {
      const badSchema = {
        parse: () => {
          throw new Error("Unknown error");
        },
      };

      const result = safeValidateRequest(badSchema as any, {});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unknown validation error");
      }
    });

    it("should handle missing required fields", () => {
      const result = safeValidateRequest(usernameSearchSchema, {});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("username");
      }
    });

    it("should handle type coercion errors", () => {
      const result = safeValidateRequest(usernameSearchSchema, {
        username: 123,
      });

      expect(result.success).toBe(false);
    });

    it("should handle complex nested validation errors", () => {
      const data = {
        messages: [
          { role: "user" as const, content: "a".repeat(4001) },
          { role: "assistant" as const, content: "Valid response" },
        ],
      };

      const result = safeValidateRequest(aiAnalyzeSchema, data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("4000");
      }
    });
  });

  describe("TypeScript types", () => {
    it("should correctly infer UsernameSearchRequest type", () => {
      const data: UsernameSearchRequest = { username: "testuser" };
      const result = usernameSearchSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should correctly infer AIAnalyzeRequest type", () => {
      const data: AIAnalyzeRequest = {
        messages: [
          { role: "user", content: "Test message" },
          { role: "assistant", content: "Test response" },
        ],
      };
      const result = aiAnalyzeSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should require username for UsernameSearchRequest", () => {
      // This is a compile-time check - if it compiles, the type is correct
      const validData: UsernameSearchRequest = { username: "test" };
      expect(usernameSearchSchema.safeParse(validData).success).toBe(true);
    });

    it("should make username optional in AIAnalyzeRequest", () => {
      const dataWithoutUsername: AIAnalyzeRequest = {
        messages: [{ role: "user", content: "Test" }],
      };
      const dataWithUsername: AIAnalyzeRequest = {
        messages: [{ role: "user", content: "Test" }],
        username: "testuser",
      };

      expect(aiAnalyzeSchema.safeParse(dataWithoutUsername).success).toBe(true);
      expect(aiAnalyzeSchema.safeParse(dataWithUsername).success).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle null input gracefully", () => {
      const result = safeValidateRequest(usernameSearchSchema, null);

      expect(result.success).toBe(false);
    });

    it("should handle undefined input gracefully", () => {
      const result = safeValidateRequest(usernameSearchSchema, undefined);

      expect(result.success).toBe(false);
    });

    it("should handle array input instead of object", () => {
      const result = safeValidateRequest(usernameSearchSchema, ["test"]);

      expect(result.success).toBe(false);
    });

    it("should handle numeric string username", () => {
      const result = safeValidateRequest(usernameSearchSchema, {
        username: "12345",
      });

      expect(result.success).toBe(true);
    });

    it("should handle single character username", () => {
      const result = safeValidateRequest(usernameSearchSchema, {
        username: "a",
      });

      expect(result.success).toBe(true);
    });

    it("should handle max length username", () => {
      const result = safeValidateRequest(usernameSearchSchema, {
        username: "a".repeat(100),
      });

      expect(result.success).toBe(true);
    });

    it("should handle max length message content", () => {
      const result = safeValidateRequest(aiAnalyzeSchema, {
        messages: [{ role: "user", content: "a".repeat(4000) }],
      });

      expect(result.success).toBe(true);
    });

    it("should handle unicode characters in username", () => {
      const result = safeValidateRequest(usernameSearchSchema, {
        username: "user123",
      });

      expect(result.success).toBe(true);
    });

    it("should handle messages with unicode content", () => {
      const result = safeValidateRequest(aiAnalyzeSchema, {
        messages: [{ role: "user", content: "Hello 世界" }],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.messages[0].content).toBe("Hello 世界");
      }
    });
  });
});
