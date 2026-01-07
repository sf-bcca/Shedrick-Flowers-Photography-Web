// Verification script for validation logic
// This runs in Node.js, so we import the local file directly.
// We need to use a slightly different import because of how Node handles imports vs Deno.
// But since we wrote validation.ts as pure TS, we can try to run it with a test runner or just compile it.

// Let's create a simple test file that imports validateInput and asserts behavior.

import { validateInput } from '../supabase/functions/gemini-chat/validation';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

console.log("Running validation tests...");

// Test 1: Valid input
const validResult = validateInput({
    messages: [
        { role: 'user', text: 'Hello' },
        { role: 'model', text: 'Hi' }
    ]
});
assert(validResult.isValid === true, 'Valid input should pass');
assert(validResult.sanitizedMessages?.length === 2, 'Should return sanitized messages');

// Test 2: Invalid JSON (not an object)
const invalidType = validateInput("string");
assert(invalidType.isValid === false, 'String input should fail');

// Test 3: Missing messages
const missingMessages = validateInput({});
assert(missingMessages.isValid === false, 'Missing messages should fail');

// Test 4: Messages not array
const messagesNotArray = validateInput({ messages: "hello" });
assert(messagesNotArray.isValid === false, 'Messages not array should fail');

// Test 5: Empty messages
const emptyMessages = validateInput({ messages: [] });
assert(emptyMessages.isValid === false, 'Empty messages should fail');

// Test 6: Invalid Role
const invalidRole = validateInput({
    messages: [{ role: 'admin', text: 'Sup' }]
});
assert(invalidRole.isValid === false, 'Invalid role should fail');

// Test 7: Missing Text
const missingText = validateInput({
    messages: [{ role: 'user' }]
});
assert(missingText.isValid === false, 'Missing text should fail');

// Test 8: Empty Text
const emptyText = validateInput({
    messages: [{ role: 'user', text: '   ' }]
});
assert(emptyText.isValid === false, 'Empty/whitespace text should fail');

// Test 9: Too long text
const longText = 'a'.repeat(2001);
const longTextResult = validateInput({
    messages: [{ role: 'user', text: longText }]
});
assert(longTextResult.isValid === false, 'Too long text should fail');

console.log("All tests passed!");
