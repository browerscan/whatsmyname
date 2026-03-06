/**
 * Validation helpers for API requests.
 *
 * Keep the runtime lightweight for Cloudflare Workers while preserving the
 * Zod-like contract used by tests and route handlers.
 */

type Issue = {
  path: Array<string | number>;
  message: string;
};

type SafeParseSuccess<T> = { success: true; data: T };
type SafeParseFailure = { success: false; error: { issues: Issue[] } };
type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure;

type Schema<T> = {
  _brand: string;
  parse(data: unknown): T;
  safeParse(data: unknown): SafeParseResult<T>;
};

const USERNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9_.-]{0,98}[a-zA-Z0-9])?$/;

export interface UsernameSearchRequest {
  username: string;
}

export interface AIAnalyzeRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  username?: string;
}

type ValidationOk<T> = { success: true; data: T };
type ValidationErr = { success: false; error: string };
type ValidationResult<T> = ValidationOk<T> | ValidationErr;

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function formatPath(path: Array<string | number>): string {
  if (path.length === 0) return "root";
  return path
    .map((segment) =>
      typeof segment === "number" ? `[${segment}]` : String(segment),
    )
    .join(".")
    .replace(".[", "[");
}

function formatIssues(issues: Issue[]): string {
  return `Validation failed: ${issues
    .map((issue) => `${formatPath(issue.path)}: ${issue.message}`)
    .join(", ")}`;
}

function safeParseWith<T>(
  validator: (data: unknown) => { issues: Issue[]; data?: T },
  data: unknown,
): SafeParseResult<T> {
  const result = validator(data);

  if (result.issues.length > 0) {
    return {
      success: false,
      error: {
        issues: result.issues,
      },
    };
  }

  return {
    success: true,
    data: result.data as T,
  };
}

function parseWith<T>(
  validator: (data: unknown) => { issues: Issue[]; data?: T },
  data: unknown,
): T {
  const result = safeParseWith(validator, data);

  if (!result.success) {
    throw new ValidationError(formatIssues(result.error.issues));
  }

  return result.data;
}

function validateUsernameInput(
  raw: unknown,
): { issues: Issue[]; data?: UsernameSearchRequest } {
  const issues: Issue[] = [];
  const username =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).username
      : undefined;

  if (typeof username !== "string") {
    issues.push({
      path: ["username"],
      message: "Username is required",
    });
    return { issues };
  }

  if (username.length === 0) {
    issues.push({
      path: ["username"],
      message: "Username is required",
    });
  }

  if (username.trim().length === 0) {
    issues.push({
      path: ["username"],
      message: "Username cannot be empty or whitespace only",
    });
  }

  if (username.length > 100) {
    issues.push({
      path: ["username"],
      message: "Username must be less than 100 characters",
    });
  }

  if (username.includes("..")) {
    issues.push({
      path: ["username"],
      message: "Username cannot contain consecutive dots",
    });
  }

  if (/^[._-]/.test(username)) {
    issues.push({
      path: ["username"],
      message: "Username cannot start with a dot, underscore, or hyphen",
    });
  }

  if (/[._-]$/.test(username)) {
    issues.push({
      path: ["username"],
      message: "Username cannot end with a dot, underscore, or hyphen",
    });
  }

  if (!USERNAME_REGEX.test(username)) {
    issues.push({
      path: ["username"],
      message:
        "Username must start and end with a letter or number, and can only contain letters, numbers, dots, hyphens, and underscores in between",
    });
  }

  if (issues.length > 0) {
    return { issues };
  }

  return {
    issues,
    data: { username },
  };
}

function validateAIAnalyzeInput(
  raw: unknown,
): { issues: Issue[]; data?: AIAnalyzeRequest } {
  const issues: Issue[] = [];

  if (!raw || typeof raw !== "object") {
    return {
      issues: [{ path: [], message: "Invalid request body" }],
    };
  }

  const { messages, username } = raw as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    issues.push({
      path: ["messages"],
      message: "At least one message is required",
    });
    return { issues };
  }

  if (messages.length > 50) {
    issues.push({
      path: ["messages"],
      message: "Maximum 50 messages allowed per conversation",
    });
  }

  messages.forEach((message, index) => {
    if (!message || typeof message !== "object") {
      issues.push({
        path: ["messages", index],
        message: `Message ${index} is invalid`,
      });
      return;
    }

    const { role, content } = message as Record<string, unknown>;

    if (role !== "user" && role !== "assistant") {
      issues.push({
        path: ["messages", index, "role"],
        message: `Message ${index}: role must be \"user\" or \"assistant\"`,
      });
    }

    if (typeof content !== "string" || content.length === 0) {
      issues.push({
        path: ["messages", index, "content"],
        message: `Message ${index}: content cannot be empty`,
      });
    }

    if (typeof content === "string" && content.length > 4000) {
      issues.push({
        path: ["messages", index, "content"],
        message: `Message ${index}: content must be less than 4000 characters`,
      });
    }
  });

  if (
    messages.length > 0 &&
    typeof messages[0] === "object" &&
    messages[0] !== null &&
    (messages[0] as { role?: string }).role !== "user"
  ) {
    issues.push({
      path: ["messages", 0, "role"],
      message: "First message must be from the user",
    });
  }

  for (let index = 1; index < messages.length; index++) {
    const previous =
      typeof messages[index - 1] === "object" && messages[index - 1] !== null
        ? (messages[index - 1] as { role?: string }).role
        : undefined;
    const current =
      typeof messages[index] === "object" && messages[index] !== null
        ? (messages[index] as { role?: string }).role
        : undefined;

    if (previous && current) {
      const expected = previous === "user" ? "assistant" : "user";
      if (current !== expected) {
        issues.push({
          path: ["messages", index, "role"],
          message: "Messages must alternate between user and assistant",
        });
        break;
      }
    }
  }

  if (username !== undefined) {
    if (typeof username !== "string" || username.length === 0) {
      issues.push({
        path: ["username"],
        message: "Invalid username",
      });
    } else if (username.length > 100) {
      issues.push({
        path: ["username"],
        message: "Username must be less than 100 characters",
      });
    }
  }

  if (issues.length > 0) {
    return { issues };
  }

  return {
    issues,
    data: {
      messages: messages as AIAnalyzeRequest["messages"],
      username: typeof username === "string" ? username : undefined,
    },
  };
}

function createSchema<T>(
  brand: string,
  validator: (data: unknown) => { issues: Issue[]; data?: T },
): Schema<T> {
  return {
    _brand: brand,
    parse(data: unknown) {
      return parseWith(validator, data);
    },
    safeParse(data: unknown) {
      return safeParseWith(validator, data);
    },
  };
}

export const usernameSearchSchema = createSchema<UsernameSearchRequest>(
  "username",
  validateUsernameInput,
);

export const aiAnalyzeSchema = createSchema<AIAnalyzeRequest>(
  "ai",
  validateAIAnalyzeInput,
);

export function validateRequest<T>(schema: { parse(data: unknown): T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown validation error");
  }
}

function fail(error: string): ValidationErr {
  return { success: false, error };
}

export function safeValidateRequest<T>(
  schema: { parse(data: unknown): T },
  data: unknown,
): ValidationResult<T> {
  try {
    return {
      success: true,
      data: schema.parse(data),
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return fail(error.message);
    }
    return fail("Unknown validation error");
  }
}
