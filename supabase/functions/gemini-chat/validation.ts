// Pure TypeScript validation logic, no Deno dependencies
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedMessages?: Message[];
}

const MAX_MESSAGES = 20; // Allow a bit more than client's 10 for safety
const MAX_TEXT_LENGTH = 2000; // Reasonable limit for a chat message

export function validateInput(input: any): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { isValid: false, error: 'Invalid input: body must be a JSON object' };
  }

  const { messages } = input;

  if (!Array.isArray(messages)) {
    return { isValid: false, error: 'Invalid input: messages must be an array' };
  }

  if (messages.length === 0) {
    return { isValid: false, error: 'Invalid input: messages array cannot be empty' };
  }

  if (messages.length > MAX_MESSAGES) {
    return { isValid: false, error: `Invalid input: too many messages (max ${MAX_MESSAGES})` };
  }

  const sanitizedMessages: Message[] = [];

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { isValid: false, error: 'Invalid input: message must be an object' };
    }

    // Validate Role
    let role = msg.role;
    if (role !== 'user' && role !== 'model') {
       // Permissive fallback or strict? Let's be strict but helpful.
       // Client sends 'user' or 'model'.
       return { isValid: false, error: `Invalid input: role must be 'user' or 'model', got '${role}'` };
    }

    // Validate Text
    let text = msg.text;
    if (typeof text !== 'string') {
      return { isValid: false, error: 'Invalid input: text must be a string' };
    }

    text = text.trim();
    if (text.length === 0) {
       // Skip empty messages or error? Let's error to be safe against weird payloads.
       return { isValid: false, error: 'Invalid input: message text cannot be empty' };
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return { isValid: false, error: `Invalid input: message text too long (max ${MAX_TEXT_LENGTH} chars)` };
    }

    sanitizedMessages.push({ role, text });
  }

  return { isValid: true, sanitizedMessages };
}
