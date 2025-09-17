# Git Commands for R&D Dashboard

## Quick Push Commands

### 1. Add All Changes
```bash
git add .
```

### 2. Commit Changes with Message
```bash
git commit -m "Your commit message here"
```

### 3. Push to GitHub
```bash
git push origin master
```

## Complete Workflow (All in One)

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add new feature or fix bug"

# Push to GitHub
git push origin master
```

## Example Commit Messages

```bash
# Adding new features
git commit -m "Add project checklist with milestone tracking"
git commit -m "Add KPI section with real-time statistics"
git commit -m "Add dark theme and Matrix logo"

# Fixing bugs
git commit -m "Fix responsive design for mobile devices"
git commit -m "Fix progress calculation bug"
git commit -m "Fix team member display issue"

# Updating styling
git commit -m "Update project card styling"
git commit -m "Improve button hover effects"
git commit -m "Add responsive design for tablets"
```

## Check Status Before Pushing

```bash
# See what files have changed
git status

# See what changes were made
git diff

# See commit history
git log --oneline
```

## If You Need to Pull First

```bash
# Pull latest changes from GitHub
git pull origin master

# Then add, commit, and push your changes
git add .
git commit -m "Your message"
git push origin master
```

## Your Repository
- **GitHub URL**: https://github.com/hadefuwa/dev-dashboard
- **Branch**: master
- **Live Site**: https://hadefuwa.github.io/dev-dashboard

## Notes
- Always run `git add .` before committing
- Write clear, descriptive commit messages
- The dashboard will update on GitHub Pages within a few minutes after pushing
- If you get errors, try `git pull origin master` first to get latest changes
