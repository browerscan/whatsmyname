import { z, ZodError } from "zod";

/**
 * Validation schemas for API requests
 */

/**
 * Secure username regex pattern
 *
 * Rules:
 * - Must start with a letter or number
 * - Can contain letters, numbers, underscores, and hyphens in the middle
 * - Must end with a letter or number (no trailing dots/hyphens/underscores)
 * - Minimum 1 character, maximum 100 characters
 *
 * This prevents:
 * - Usernames starting with special characters (., -, _)
 * - Usernames ending with special characters
 * - Path traversal attempts (../)
 * - Confusing look-alike usernames
 */
const SECURE_USERNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9_-]{0,98}[a-zA-Z0-9])?$/;

// Username search validation (used by WhatsMyName and Google search APIs)
export const usernameSearchSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username must be less than 100 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Username cannot be empty or whitespace only",
    })
    .refine((val) => !val.includes(".."), {
      message: "Username cannot contain consecutive dots",
    })
    .refine((val) => !/^[._-]/.test(val), {
      message: "Username cannot start with a dot, underscore, or hyphen",
    })
    .refine((val) => !/[._-]$/.test(val), {
      message: "Username cannot end with a dot, underscore, or hyphen",
    })
    .regex(
      SECURE_USERNAME_REGEX,
      "Username must start and end with a letter or number, and can only contain letters, numbers, hyphens, and underscores in between",
    )
    .transform((val) => val.trim()),
});

export type UsernameSearchRequest = z.infer<typeof usernameSearchSchema>;

// AI analyze validation - comprehensive limits to prevent abuse
export const aiAnalyzeSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .min(1, "Message content cannot be empty")
          .max(4000, "Message content must be less than 4000 characters"),
      }),
    )
    .min(1, "At least one message is required")
    .max(50, "Maximum 50 messages allowed per conversation")
    .refine(
      (messages) => {
        // Ensure the first message is from the user
        return messages[0]?.role === "user";
      },
      { message: "First message must be from the user" },
    )
    .refine(
      (messages) => {
        // Ensure alternating roles (user -> assistant -> user -> assistant)
        for (let i = 1; i < messages.length; i++) {
          const expectedRole =
            messages[i - 1].role === "user" ? "assistant" : "user";
          if (messages[i].role !== expectedRole) {
            return false;
          }
        }
        return true;
      },
      { message: "Messages must alternate between user and assistant" },
    ),
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username must be less than 100 characters")
    .optional(),
});

export type AIAnalyzeRequest = z.infer<typeof aiAnalyzeSchema>;

/**
 * Validates request data against a Zod schema
 * Returns validated data on success, or throws with detailed error messages
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      throw new Error(`Validation failed: ${messages.join(", ")}`);
    }
    throw error;
  }
}

/**
 * Validates request data and returns a safe result object
 * Useful for API routes that need to handle validation errors gracefully
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      return {
        success: false,
        error: `Validation failed: ${messages.join(", ")}`,
      };
    }
    return { success: false, error: "Unknown validation error" };
  }
}
