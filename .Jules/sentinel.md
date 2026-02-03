## 2024-05-22 - Missing Edge Function Validation
**Vulnerability:** The `gemini-chat` edge function completely lacked input validation, despite documentation/memory claiming otherwise. It was accepting raw JSON and passing it to the AI model, creating DoS and Cost Injection risks.
**Learning:** Never trust "memory" or documentation about security controls. Always verify the code. The discrepancy between assumed state and actual state was 100%.
**Prevention:** Implement "Security as Code" - validation must be explicit in the codebase, not just described in docs.
