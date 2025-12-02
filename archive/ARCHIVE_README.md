# ResuMate Legacy Test Pages - Archive

This directory contains legacy test pages that have been replaced by the unified workflow system.

## Archived on: 2025-12-02

## Why These Files Were Archived

ResuMate has migrated to a **single-page workflow system** located in `/workflow.html`. These individual test pages were part of the old multi-page architecture and are no longer actively maintained or linked from the navigation.

## Archived Files

### AI Tools
- `test-job-tailor.html` - Job tailoring functionality (now in workflow step 3)
- `test-ats-scanner.html` - ATS scanning (now in workflow step 2)
- `test-ai.html` - AI writing assistant
- `test-proofread.html` - Proofreading tool

### Export & Documents
- `test-export.html` - Export functionality (now in workflow step 5)
- `test-coverletter.html` - Cover letter generation
- `test-careerdocs.html` - Career documents (bios, brand statements)
- `test-templates.html` - Letter templates

### Other Tools
- `test-preview.html` - Live preview (integrated into index.html)
- `test-tracker.html` - Job application tracker
- `test-version-management.html` - Version management
- `test-workflow.html` - Old workflow prototype

## Migration Path

If you need functionality from these pages:

1. **Resume Building & Analysis**: Use `/workflow.html` - the unified workflow
2. **Job Tailoring**: Workflow Step 3 (Job Description Input)
3. **ATS Scanning**: Workflow Step 2 (Analysis)
4. **Export**: Workflow Step 5 (Export)
5. **Preview**: Available in `/index.html` with split-view editor

## Accessing Archived Pages

These pages are no longer linked in the navigation, but can still be accessed directly:
- Visit: `http://localhost:3101/archive/[filename].html`
- Example: `http://localhost:3101/archive/test-job-tailor.html`

## Server Redirects

The server (`server.js`) includes redirect rules that automatically redirect old URLs to the appropriate workflow steps:
- `/test-job-tailor.html` → `/workflow.html#step-3`
- `/test-ats-scanner.html` → `/workflow.html#step-2`
- `/test-coverletter.html` → `/workflow.html#step-4`
- `/test-careerdocs.html` → `/workflow.html#step-4`
- `/test-export.html` → `/workflow.html#step-5`

## Future Plans

These files may be permanently removed in a future release once the workflow system is fully validated and all functionality has been migrated.

## Restoration

If you need to restore these files to active use:
1. Move them back to the root directory
2. Re-add navigation links in `components/navigation.html`
3. Update `server.js` to remove redirects

---

For questions or issues, refer to the main README.md in the project root.
