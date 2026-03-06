/**
 * Validation for API requests (no zod — CF Workers bundle compatibility)
 */

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

function fail(msg: string): ValidationErr {
  return { success: false, error: msg };
}

export function validateUsername(
  raw: unknown,
): ValidationResult<UsernameSearchRequest> {
  const username =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).username
      : undefined;

  if (typeof username !== "string" || username.length === 0)
    return fail("Username is required");
  if (username.length > 100)
    return fail("Username must be less than 100 characters");
  if (!USERNAME_REGEX.test(username))
    return fail(
      "Username must start and end with a letter or number, and can only contain letters, numbers, dots, hyphens, and underscores in between",
    );

  return { success: true, data: { username } };
}

export function validateAIAnalyze(
  data: unknown,
): ValidationResult<AIAnalyzeRequest> {
  if (!data || typeof data !== "object") return fail("Invalid request body");
  const { messages, username } = data as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0)
    return fail("At least one message is required");
  if (messages.length > 50)
    return fail("Maximum 50 messages allowed per conversation");

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== "object") return fail(`Message ${i} is invalid`);
    const { role, content } = msg as Record<string, unknown>;
    if (role !== "user" && role !== "assistant")
      return fail(`Message ${i}: role must be "user" or "assistant"`);
    if (typeof content !== "string" || content.length === 0)
      return fail(`Message ${i}: content cannot be empty`);
    if (content.length > 4000)
      return fail(`Message ${i}: content must be less than 4000 characters`);
  }

  if ((messages[0] as { role: string }).role !== "user")
    return fail("First message must be from the user");

  for (let i = 1; i < messages.length; i++) {
    const prev = (messages[i - 1] as { role: string }).role;
    const curr = (messages[i] as { role: string }).role;
    const expected = prev === "user" ? "assistant" : "user";
    if (curr !== expected)
      return fail("Messages must alternate between user and assistant");
  }

  if (
    username !== undefined &&
    (typeof username !== "string" ||
      username.length === 0 ||
      username.length > 100)
  ) {
    return fail("Invalid username");
  }

  return {
    success: true,
    data: {
      messages: messages as AIAnalyzeRequest["messages"],
      username: typeof username === "string" ? username : undefined,
    },
  };
}

// Backwards-compatible schema aliases used by route handlers
export const usernameSearchSchema = { _brand: "username" as const };
export const aiAnalyzeSchema = { _brand: "ai" as const };

export function safeValidateRequest<T>(
  schema: { _brand: string },
  data: unknown,
): ValidationResult<T> {
  if (schema._brand === "username")
    return validateUsername(data) as ValidationResult<T>;
  if (schema._brand === "ai")
    return validateAIAnalyze(data) as ValidationResult<T>;
  return fail("Unknown schema");
}
