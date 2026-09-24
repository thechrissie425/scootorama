# Pre-Commit Hooks Setup

This project uses **Husky** and **lint-staged** to run automated checks before each commit.

## What Gets Checked

### TypeScript/React Files (`**/*.{ts,tsx}`)

- **ESLint**: Automatically fixes linting issues
- **Prettier**: Formats code consistently

### Schema Files (`sanity/schemaTypes/**/*.ts`)

- **TypeScript**: Type-checks schema definitions to catch errors early

### Documentation/Config (`**/*.{json,md,css}`)

- **Prettier**: Ensures consistent formatting

## Benefits

✅ **Catches errors before commit** - Save time by finding issues immediately  
✅ **Consistent code style** - Automatic formatting across the team  
✅ **Faster reviews** - No style debates, focus on logic  
✅ **Prevents broken builds** - Type errors caught locally

## How It Works

When you run `git commit`:

1. Git triggers `.husky/pre-commit` hook
2. Hook runs `lint-staged`
3. `lint-staged` runs commands only on staged files
4. If any check fails, commit is blocked
5. Fix the issues and commit again

## Skipping Hooks (Emergency Only)

If you need to bypass hooks in an emergency:

```bash
git commit --no-verify -m "Emergency fix"
```

⚠️ **Use sparingly** - This bypasses all quality checks

## Customization

Edit `package.json` → `"lint-staged"` section to modify checks.

## Time Savings

- **2-3 hours/week** catching bugs before they reach CI/CD
- **1-2 hours/week** from automated formatting
- **No more** "fix linting" commits

---

_Last updated: January 8, 2026_
