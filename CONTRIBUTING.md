# Contributing to svgs-to-icons

Thank you for your interest in contributing to svgs-to-icons! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm (comes with Node.js)
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/svgs-to-icons.git
   cd svgs-to-icons
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Test the setup:**
   ```bash
   npm test
   node svgs-to-icons.js ./examples/chair-icons
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes:**
   ```bash
   npm test
   # Test with example icons
   node svgs-to-icons.js ./examples/chair-icons
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

### Commit Message Format

Use conventional commits format:
- `Add:` for new features
- `Fix:` for bug fixes  
- `Update:` for improvements to existing features
- `Docs:` for documentation changes
- `Test:` for test-related changes

Examples:
- `Add: support for custom CSS variable names`
- `Fix: collision handling for numeric filenames`
- `Update: improve SVG optimization settings`

## Types of Contributions

### 🐛 Bug Reports

- Use the GitHub issue template
- Include clear reproduction steps
- Provide sample SVG files if relevant
- Mention your Node.js version and OS

### ✨ Feature Requests

- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider backward compatibility
- Be open to alternative approaches

### 📝 Documentation

- Fix typos, improve clarity
- Add examples for unclear sections
- Update outdated information
- Improve code comments

### 🧪 Code Contributions

**Areas where help is welcome:**
- Additional output formats (e.g., SCSS, CSS modules)
- Performance optimizations
- Better error handling and validation
- Cross-platform compatibility improvements
- Additional CLI options

## Code Standards

### Style Guidelines

- Use tabs for indentation (existing codebase standard)
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and small

### Testing

- Add tests for new features
- Ensure existing tests still pass
- Test with various SVG inputs
- Test CLI options and edge cases

### Documentation

- Update README.md for new features
- Add entries to CHANGELOG.md
- Include code comments for complex logic
- Update CLI help text if adding options

## Project Structure

```
svgs-to-icons/
├── svgs-to-icons.js          # CLI entry point
├── svgs-to-icons-core.js     # Core processing logic
├── templates/                # HTML/CSS templates
│   ├── demo-template.js      # Demo page generator
│   └── colors.js            # Color palette for demos
├── examples/                 # Example SVG files
├── test/                     # Test files
└── docs/                     # Additional documentation
```

## Getting Help

- **Questions?** Open a GitHub discussion
- **Found a bug?** Open an issue with reproduction steps
- **Need clarification?** Comment on existing issues or PRs

## Review Process

1. **Submit a pull request** against the `main` branch
2. **Automated tests** will run via GitHub Actions
3. **Maintainer review** - we'll provide feedback
4. **Address feedback** if needed
5. **Merge** once approved

## Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes for significant contributions
- Credited in the CHANGELOG.md

## Code of Conduct

- Be respectful and inclusive
- Focus on what's best for the project
- Help others learn and contribute
- Give constructive feedback

Thank you for contributing! 🎉