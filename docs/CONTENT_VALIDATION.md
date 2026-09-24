# Content Validation & Task Management

Automated content quality validation with automatic task creation in Sanity Studio.

## Quick Start

```bash
# Just validate (reports only)
npm run validate

# Validate AND create tasks in Sanity
npm run validate:tasks
```

## What Gets Validated

### 1. **SEO Metadata** 🔍

- Checks: product, campaign, page, post, membershipPage
- Severity: **Critical**
- Issue: Missing `seo.title` field

### 2. **Incomplete Translations** 🌐

- Checks: Documents with `showTranslationFields = true`
- Languages: Spanish, French, German, Japanese
- Severity: **Warning**
- Issue: Missing translations in enabled fields

### 3. **Broken References** 🔗

- Checks: Page content blocks
- Severity: **Critical**
- Issue: References pointing to deleted documents

### 4. **Missing Images** 🖼️

- Checks: product, campaign
- Severity: **Warning**
- Issue: Missing featured image

## Validation Tasks in Sanity Studio

### Automatic Task Creation

When you run `npm run validate:tasks`, the script:

1. ✅ Scans all content for issues
2. ✅ Removes old open validation tasks
3. ✅ Creates new tasks with:
   - Reference to problematic document
   - List of specific issues
   - Severity level (critical/warning)
   - Status (open/in_progress/resolved/ignored)
4. ✅ Organizes tasks in Studio sidebar

### Viewing Tasks

Navigate to: **✅ Validation Tasks** in Sanity Studio sidebar

**Views Available:**

- 🔴 **Open Tasks** - Needs attention
- 🟡 **In Progress** - Being worked on
- 🔴 **Critical Issues** - High priority (SEO, broken refs)
- 📋 **All Tasks** - Complete history

### Task Fields

Each validation task includes:

| Field                | Description                       | Editable     |
| -------------------- | --------------------------------- | ------------ |
| **Title**            | Auto-generated summary            | ❌ Read-only |
| **Description**      | Issue details                     | ❌ Read-only |
| **Severity**         | critical/warning/info             | ❌ Read-only |
| **Related Document** | Direct link to document           | ❌ Read-only |
| **Issues Found**     | List of specific problems         | ❌ Read-only |
| **Status**           | open/in_progress/resolved/ignored | ✅ Editable  |
| **Assigned To**      | Person responsible                | ✅ Editable  |
| **Notes**            | Fix progress notes                | ✅ Editable  |
| **Created At**       | When found                        | ❌ Read-only |
| **Resolved At**      | When fixed                        | ❌ Read-only |

## Workflow

### 1. Run Validation

```bash
npm run validate:tasks
```

### 2. Check Tasks in Studio

- Open Sanity Studio at `http://localhost:3333`
- Navigate to **✅ Validation Tasks → 🔴 Open Tasks**

### 3. Assign & Track

- Click a task
- Set **Assigned To** field
- Change **Status** to "in_progress"
- Add **Notes** about your progress

### 4. Fix Issues

- Click **Related Document** to open the document
- Fix the issues listed
- Come back to task

### 5. Mark Resolved

- Change **Status** to "resolved"
- Task moves out of open tasks

### 6. Re-run Validation

```bash
npm run validate:tasks
```

- Old open tasks are cleared
- Only new issues create tasks
- Resolved tasks remain for history

## Environment Requirements

### Read-Only Mode (Reports Only)

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

```bash
npm run validate  # ✅ Works - reports only
```

### Write Mode (Create Tasks)

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="sk..."  # ⚠️ Required for task creation
```

```bash
npm run validate:tasks  # ✅ Works - creates tasks
```

## Pre-Deployment Validation

Before deploying to production:

```bash
npm run validate:pre-deploy
```

Runs:

1. ✅ Content validation
2. ✅ TypeScript type-checking
3. ✅ Production build

If any step fails, deployment is blocked.

## Integration with CI/CD

Add to your GitHub Actions workflow:

```yaml
- name: Validate Content Quality
  run: npm run validate
  env:
    NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
    NEXT_PUBLIC_SANITY_DATASET: production
```

## Tips

### Batch Fix Issues

1. Filter by severity: **🔴 Critical Issues**
2. Assign all to yourself
3. Fix in order of impact:
   - SEO metadata (affects search ranking)
   - Broken references (breaks pages)
   - Missing images (visual quality)
   - Incomplete translations (user experience)

### Ignore False Positives

- Change **Status** to "ignored"
- Add **Notes** explaining why
- Task won't show in open tasks

### Track Team Progress

- Use **Assigned To** to distribute work
- Filter tasks by assignee
- Monitor **In Progress** view

---

**Created**: January 8, 2026  
**Time Savings**: 5-10 hours/week catching issues early
