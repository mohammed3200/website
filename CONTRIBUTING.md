# Contributing Guidelines

Thank you for your interest in contributing to the Misurata Center for Entrepreneurship & Business Incubators platform! We welcome contributions of all kinds—from bug reports and feature requests to code, documentation, and design improvements.

## 1. How to Contribute

1. **Fork the repository**
   - Click the **Fork** button on the top right of the repository page.
   - Clone your fork locally:
     ```bash
     git clone https://github.com/mohammed3200/website.git
     cd website
     ```
2. **Create a branch**
   - Name it descriptively, e.g., `feature/add-search` or `bugfix/fix-typo`:
     ```bash
     git checkout -b feature/your-feature-name
     ```
3. **Install dependencies & test**
   ```bash
   bun install
   bun test
   ```
4. **Make your changes**
   - Follow the existing code style (Prettier, ESLint).
   - Write clear, concise commit messages.
   - Add tests for new functionality or bugs fixed.
5. **Run the project locally**
   ```bash
   bun run dev
   ```
6. **Commit & push**
   ```bash
   git add .
   git commit -m "feat: add full-text search integration"
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request (PR)**
   - Go to your fork on GitHub and click **Compare & pull request**.
   - Provide a clear title and description of your changes.
   - Reference any related issues by number, e.g., `Fixes #123`.

## 2. Code Standards

- **Language & Framework**: TypeScript, React, Next.js
- **Formatting**: Use Prettier for code formatting. Do not commit changes that cause linting errors.
- **Linting**: Ensure `bun run lint` passes without errors.
- **Testing**: Aim for good test coverage. Use Jest and React Testing Library for unit and integration tests.

## 3. Issue Reporting

When reporting a bug or requesting a feature, please include:

- A descriptive title
- Steps to reproduce (for bugs)
- Expected behavior vs. actual behavior
- Screenshots or logs (if applicable)
- Your environment details (OS, Node.js version)

## 4. Communication

- **Discussions**: Use GitHub Discussions for general questions and proposals.
- **Code Review**: Be respectful and constructive. All contributions will be reviewed by maintainers before merging.
- **Labels**:
  - `good first issue` – suitable for newcomers
  - `help wanted` – areas where help is needed
  - `documentation` – docs-related contributions

## 5. Contributor License Agreement (CLA)

By contributing, you agree that your contributions will be licensed under the project’s [MIT License](LICENSE).

---

Thank you for helping make our platform better! 🎉
