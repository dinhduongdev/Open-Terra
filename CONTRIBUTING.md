<!-- omit in toc -->
# Contributing to Open-Terra

First off, thanks for taking the time to contribute!

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [1. Fork & Clone](#1-fork--clone)
  - [2. Setup Development Environment](#2-setup-development-environment)
  - [3. Create Feature Branch](#3-create-feature-branch)
- [Development Workflow](#development-workflow)
  - [Branch Naming Convention](#branch-naming-convention)
  - [Commit Convention](#commit-convention)
  - [Push & Create PR](#push--create-pr)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Issues](#reporting-issues)
- [Review Process](#review-process)
- [Local Development Tips](#local-development-tips)
- [Community Guidelines](#community-guidelines)


## Code of Conduct

This project and everyone participating in it is governed by the
[Open-Terra Code of Conduct](https://github.com/dinhduongdev/Open-Terra/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <>.


## I Have a Question

<!-- > If you want to ask a question, we assume that you have read the available [Documentation](). -->

Before you ask a question, it is best to search for existing [Issues](https://github.com/dinhduongdev/Open-Terra/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/dinhduongdev/Open-Terra/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

<!--
You might want to create a separate issue tag for questions and include it in this description. People should then tag their issues accordingly.

Depending on how large the project is, you may want to outsource the questioning, e.g. to Stack Overflow or Gitter. You may add additional contact and information possibilities:
- IRC
- Slack
- Gitter
- Stack Overflow tag
- Blog
- FAQ
- Roadmap
- E-Mail List
- Forum
-->

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Open-Terra.git
cd Open-Terra

# Add upstream remote
git remote add upstream https://github.com/dinhduongdev/Open-Terra.git
```

### 2. Setup Development Environment

Refer to [Getting Started](https://github.com/dinhduongdev/Open-Terra/wiki/2.-Getting-Started) to set up the development environment for each component.

**Components:**
- `frontend/` - Next.js 16 + React 19 + TypeScript
- `crawler/` - FastAPI + Python 3.11+
- `context-broker/` - FIWARE Orion-LD + MongoDB + MQTT
- `dummy-iot-devices/` - Node.js IoT Simulator

### 3. Create Feature Branch

See [Branch Naming Convention](#branch-naming-convention) for detailed guidelines.

```bash
git checkout -b feat/<component>/<your-feature-name>
# or
git checkout -b fix/<bug-description>
```

## Development Workflow

### Branch Naming Convention

Branch names should follow this pattern:

```
<type>/<short-description>
```

**Branch Types:**

| Type | Purpose | Example |
|------|---------|----------|
| `feature/` | New features or enhancements | `feature/weather-data-normalizer` |
| `fix/` | Bug fixes | `fix/map-rendering-mobile` |
| `docs/` | Documentation updates | `docs/update-api-guide` |
| `refactor/` | Code refactoring | `refactor/crawler-data-pipeline` |
| `test/` | Adding or updating tests | `test/frontend-unit-tests` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `hotfix/` | Urgent production fixes | `hotfix/critical-auth-bug` |

**Guidelines:**

- Use lowercase with hyphens (kebab-case)
- Keep it short but descriptive (max 50 characters)
- Use imperative mood (e.g., `add-feature` not `adding-feature`)
- Include issue number if applicable: `feature/123-add-weather-api`

**Examples:**

```bash
# Good
feature/ngsi-ld-integration
fix/mqtt-connection-timeout
docs/deployment-guide
refactor/frontend-api-client

# Bad
feature/add_new_feature  # Use hyphens, not underscores
FIX/BUG                  # Use lowercase
my-branch                # Not descriptive
feature/this-is-a-very-long-branch-name-that-describes-everything  # Too long
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <description>
```

#### Commit Types

| Type | Description | When to Use |
|------|-------------|-------------|
| `feat` | New feature | Adding new functionality |
| `fix` | Bug fix | Fixing a bug or issue |
| `docs` | Documentation | Documentation only changes |
| `style` | Code style | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code refactoring | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance | Code change that improves performance |
| `test` | Tests | Adding or updating tests |
| `build` | Build system | Changes to build system or dependencies |
| `ci` | CI/CD | Changes to CI configuration files and scripts |
| `chore` | Maintenance | Other changes that don't modify src or test files |
| `revert` | Revert | Reverting a previous commit |

#### Best Practices

1. **One logical change per commit** - Don't mix unrelated changes
2. **Commit often** - Small, focused commits are easier to review
3. **Write meaningful messages** - Future you will thank you
4. **Test before committing** - Ensure code works and tests pass
5. **Reference issues** - Link commits to related issues/PRs

### Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with `main`

### PR Template

When creating a PR, GitHub will automatically use the [PR template](.github/pull_request_template.md)

## Reporting Issues

### Reporting Bugs

Use the [Bug Report template](https://github.com/dinhduongdev/Open-Terra/issues/new?template=bug_report.md):

- Clear bug description
- Steps to reproduce
- Expected vs Actual behavior
- Environment info (OS, Browser, Version)
- Screenshots/Logs (if applicable)

### Suggesting Enhancements

Use the [Feature Request template](https://github.com/dinhduongdev/Open-Terra/issues/new?template=feature_request.md):

- Feature description
- Use case / Problem solved
- Technical details
- Standards alignment (NGSI-LD, SOSA/SSN, FIWARE)

## Review Process

1. **Submit PR** → Automated checks run
2. **Code Review** → Maintainers review
3. **Address Feedback** → Update based on comments
4. **Merge** → When approved

## Local Development Tips

### Running Tests

```bash
# Crawler (Python)
cd crawler
uv run pytest

# Frontend (TypeScript)
cd frontend
npm test --if-present
npm run lint
```

### Pre-commit Hooks

```bash
# Install pre-commit (in crawler/)
cd crawler
pip install pre-commit
pre-commit install

# Run manually
pre-commit run --all-files
```

## Community Guidelines

- **Be respectful** - Respect all contributors
- **Be constructive** - Provide constructive feedback
- **Be patient** - Reviews may take time
- **Ask questions** - No question is a dumb question
