# Contributing to webext-reactive-store

Thank you for your interest in contributing! This guide will help you get started with development.

## How to Fork and Clone

1. **Fork the repository** - Click the "Fork" button on the [GitHub repository](https://github.com/theluckystrike/webext-reactive-store)
2. **Clone your fork** - Run the following command in your terminal:
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-reactive-store.git
   cd webext-reactive-store
   ```
3. **Add the upstream remote** (optional but recommended):
   ```bash
   git remote add upstream https://github.com/theluckystrike/webext-reactive-store.git
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

### Project Structure

- `src/` - TypeScript source code
- `dist/` - Compiled JavaScript output
- `.github/` - GitHub workflows and templates

## Code Style Guidelines

- **Language**: TypeScript (strict mode)
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**: Use camelCase for variables and functions, PascalCase for classes and types
- **Comments**: Add JSDoc comments for public APIs
- **Testing**: Write tests for new features using Vitest
- **Commits**: Write clear, descriptive commit messages

## How to Submit PRs

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-description
   ```

2. **Make your changes** - Ensure all tests pass and the build succeeds

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** - Go to the original repository and click "New Pull Request"
   - Target branch: `main`
   - Provide a clear description of your changes
   - Link any related issues

6. **Respond to feedback** - Be responsive to review comments and make necessary changes

## Issue Reporting Guidelines

When reporting issues, please include:

- **Clear title** describing the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (Node version, browser, OS)
- **Code samples** or minimal reproduction repo if applicable
- **Screenshots** if applicable

### Issue Types

- 🐛 **Bug** - Something isn't working as expected
- 💡 **Feature** - Request a new feature or enhancement
- 📖 **Documentation** - Improvements or corrections to docs
- ❓ **Question** - General questions about the project

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
