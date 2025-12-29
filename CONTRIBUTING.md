# Contributing Guide

Thank you for your interest in contributing to the Shedrick Flowers Photography Web project! We welcome contributions from developers to help improve the site.

## How to Report a Bug

If you find a bug, please create a GitHub Issue with the following details:

1.  **Title**: Clear and descriptive title.
2.  **Description**: Detailed explanation of what is happening.
3.  **Steps to Reproduce**: Numbered list of steps to make the bug appear.
4.  **Expected Behavior**: What you expected to happen.
5.  **Screenshots**: If applicable.
6.  **Environment**: Browser version, OS, Node version.

## How to Suggest a Feature

Open a GitHub Issue with the label `enhancement`. Describe the feature, why it is needed, and how it should work.

## Local Development Setup

1.  Follow the detailed instructions in [INSTALL.md](INSTALL.md) to set up your local environment, including database and environment variables.
2.  **Install Dependencies**: Due to React 19 dependencies, you must use the legacy peer deps flag:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Ensure you have the correct `.env` variables set up (see `INSTALL.md`).

## Documentation Standards

We maintain a high standard of documentation to ensure the project remains maintainable and accessible.

*   **Role**: "Scribe" (Technical Writer).
*   **Priorities**: Accuracy > Completeness > Developer Experience > Polish.
*   **JSDoc**: All complex functions and services (especially in `src/services/`) must have JSDoc comments explaining parameters, return values, and side effects.
*   **Markdown**: Use relative links, verify code blocks, and keep the Table of Contents updated.

## Pull Request (PR) Process

We follow a standard Git workflow:

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** your fork locally.
3.  **Create a Branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-new-feature
    # or
    git checkout -b fix/bug-description
    ```
4.  **Make Changes**: Write your code.
5.  **Test**: Ensure the application runs without errors (`npm run dev`) and builds successfully (`npm run build`).
6.  **Commit**: Use descriptive commit messages.
    ```bash
    git commit -m "Add new photo filter component"
    ```
7.  **Push** to your fork:
    ```bash
    git push origin feature/amazing-new-feature
    ```
8.  **Submit a Pull Request**: Go to the original repository and click "Compare & pull request".

### Coding Guidelines

*   **Style**: We use standard React/TypeScript best practices.
*   **Formatting**: Keep code clean and readable.
*   **Linting**: While we include `eslint`, we currently do not enforce a strict linting pipeline. Please rely on your IDE's formatting and linting suggestions.
*   **Types**: Avoid using `any` whenever possible; define interfaces in `src/types.ts`.
*   **Components**: Create reusable components in `src/components/`.

## License
By contributing, you agree that your contributions will be licensed under the project's MIT License.
