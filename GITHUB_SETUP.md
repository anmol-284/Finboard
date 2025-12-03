# GitHub Setup Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `finboard` or `finance-dashboard`)
5. Choose visibility (Public or Private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (GitHub default)
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files and commit history
3. Your commits will appear in the commit history with messages like:
   - "chore: initial project setup..."
   - "feat: core application structure..."
   - "feat: widget components and dashboard UI"
   - etc.

## Alternative: Using SSH (Recommended for frequent use)

If you have SSH keys set up with GitHub:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Updating the Repository

After making changes to your code:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "your commit message"

# Push to GitHub
git push
```

## Professional Commit Message Guidelines

Follow these conventions for professional commits:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

Example: `feat: add dark mode toggle button`

## Repository Settings (Optional but Recommended)

1. Go to your repository Settings
2. Enable "Issues" (for bug tracking)
3. Enable "Discussions" (for community engagement)
4. Set up branch protection rules if working in a team
5. Add repository topics: `nextjs`, `typescript`, `dashboard`, `finance`, `react`

## Adding a GitHub Actions Workflow (Optional)

You can add CI/CD with GitHub Actions. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npm run lint
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Use Personal Access Token** (recommended):
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use token as password when pushing

2. **Use GitHub CLI**:
   ```bash
   gh auth login
   ```

### Push Rejected

If push is rejected:
```bash
# Pull remote changes first
git pull origin main --rebase

# Then push again
git push
```

### Wrong Remote URL

To check or change remote URL:
```bash
# Check current remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
