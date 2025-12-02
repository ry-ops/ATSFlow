# ResuMate Debug & Testing Guide

Quick reference for testing and debugging the ResuMate workflow.

## Debug Helpers Quick Start

### 1. Load Debug Tools

Open the workflow page in your browser:
```
http://localhost:3101/workflow.html
```

Open the browser console (F12 or Cmd+Option+I), then type:
```javascript
ResuMateDebug.help()
```

---

## Common Debugging Tasks

### Check Current State
```javascript
// View complete state
ResuMateDebug.inspectState()

// Outputs:
// - LocalStorage data (API key, resume, job)
// - Workflow state object
// - Current step visibility
```

### Fill Test Data Quickly
```javascript
// Auto-fill resume and job description
ResuMateDebug.simulateUpload()

// This sets:
// - Resume text (sample software engineer resume)
// - Job description (sample job posting)
// - Saves to localStorage
```

### Test API Endpoints
```javascript
// Test analysis endpoint
ResuMateDebug.testAPI('/api/analyze', {
  resumeText: 'My resume...',
  jobText: 'Job description...',
  apiKey: 'sk-ant-...'
})

// Test job fetching
ResuMateDebug.testAPI('/api/fetch-job', {
  url: 'https://linkedin.com/jobs/view/12345',
  site: 'linkedin'
})

// Test content generation
ResuMateDebug.testAPI('/api/generate', {
  prompt: 'Generate a professional bio...',
  apiKey: 'sk-ant-...'
})
```

### Validate Workflow Steps
```javascript
// Check if step 1 is valid (has resume)
ResuMateDebug.validateStep(1)

// Check if step 2 is valid (has job + API key)
ResuMateDebug.validateStep(2)

// Check if step 3 is valid (has analysis)
ResuMateDebug.validateStep(3)
```

### Reset Workflow
```javascript
// Clear all data except API key
ResuMateDebug.resetWorkflow()

// Note: This will reload the page
```

### Export/Import State
```javascript
// Export current state to clipboard
const state = ResuMateDebug.exportState()

// Import previously exported state
ResuMateDebug.importState(state)
```

### Monitor API Calls
```javascript
// Start monitoring all fetch requests
ResuMateDebug.startAPIMonitoring()

// Now all API calls will be logged with:
// - URL
// - Method
// - Payload
// - Response status
// - Duration

// Stop monitoring
ResuMateDebug.stopAPIMonitoring()
```

### System Health Check
```javascript
// Check if everything is working
ResuMateDebug.checkHealth()

// Checks:
// - localStorage availability
// - API server connectivity
// - Required DOM elements
// - Global JavaScript objects
```

---

## Testing Scenarios

### Scenario 1: Complete Happy Path
```javascript
// 1. Fill test data
ResuMateDebug.simulateUpload()

// 2. Check state
ResuMateDebug.inspectState()

// 3. Validate step 1
ResuMateDebug.validateStep(1)

// 4. Click "Continue" button manually

// 5. Add API key in UI (if not already set)

// 6. Run analysis manually

// 7. Continue through remaining steps
```

### Scenario 2: Test Without API Key
```javascript
// 1. Clear API key
localStorage.removeItem('claude_api_key')

// 2. Fill test data
ResuMateDebug.simulateUpload()

// 3. Try to analyze (should show error)
ResuMateDebug.validateStep(2)  // Should fail

// 4. Add API key
localStorage.setItem('claude_api_key', 'sk-ant-...')

// 5. Validate again
ResuMateDebug.validateStep(2)  // Should pass
```

### Scenario 3: Test State Persistence
```javascript
// 1. Fill test data
ResuMateDebug.simulateUpload()

// 2. Export state
const state = ResuMateDebug.exportState()

// 3. Refresh page (Cmd+R)

// 4. Check state
ResuMateDebug.inspectState()
// Note: API key should persist, resume/job should be cleared

// 5. Import state back
ResuMateDebug.importState(state)

// 6. Verify
ResuMateDebug.inspectState()
```

### Scenario 4: Test Error Handling
```javascript
// Test with invalid API key
ResuMateDebug.testAPI('/api/analyze', {
  resumeText: 'Test resume',
  jobText: 'Test job',
  apiKey: 'invalid-key'
})

// Test with missing data
ResuMateDebug.testAPI('/api/analyze', {
  resumeText: '',
  jobText: '',
  apiKey: 'sk-ant-test'
})

// Test with invalid URL
ResuMateDebug.testAPI('/api/fetch-job', {
  url: 'https://malicious-site.com/job',
  site: 'unknown'
})
```

### Scenario 5: Performance Testing
```javascript
// Monitor API calls
ResuMateDebug.startAPIMonitoring()

// Fill data
ResuMateDebug.simulateUpload()

// Run through workflow
// All API calls will show timing in console

// Stop monitoring
ResuMateDebug.stopAPIMonitoring()
```

---

## Running Automated Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test tests/workflow-e2e.test.js
npm test tests/e2e-journey.test.js
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

---

## Manual Testing Checklist

### Step 1: Upload
- [ ] Paste resume text
- [ ] Upload resume file (PDF)
- [ ] Paste job description
- [ ] Import job from URL
- [ ] "Continue" button enables when data is present

### Step 2: Analyze
- [ ] Add API key
- [ ] Click "Analyze Resume"
- [ ] Loading spinner shows
- [ ] Analysis results display
- [ ] Match score shows (0-100)
- [ ] Strengths and gaps listed
- [ ] "Continue" button enables after analysis

### Step 3: Tailor
- [ ] Tailoring suggestions display
- [ ] Apply suggestions button works
- [ ] Resume updates with suggestions
- [ ] Skip button works
- [ ] "Continue" button enables

### Step 4: Edit
- [ ] Resume editor loads with content
- [ ] Live preview updates
- [ ] Template selector works
- [ ] Formatting buttons work
- [ ] "Continue" button enables

### Step 5: Export
- [ ] Export options display
- [ ] PDF export works
- [ ] DOCX export works
- [ ] TXT export works
- [ ] "Start New Resume" button works

### Navigation
- [ ] No page loads during workflow
- [ ] Back button works
- [ ] Progress dots show current step
- [ ] Hash updates in URL
- [ ] Browser back/forward works

### Error Handling
- [ ] Network error shows message
- [ ] Invalid API key shows error
- [ ] Invalid file type rejected
- [ ] Large file shows size error
- [ ] Rate limiting shows retry time

### Accessibility
- [ ] Tab key navigation works
- [ ] Screen reader announcements
- [ ] Keyboard shortcuts work
- [ ] Focus indicators visible
- [ ] Error messages readable

---

## Common Issues & Solutions

### Issue: "API key not set"
**Solution:**
```javascript
localStorage.setItem('claude_api_key', 'sk-ant-your-key-here')
ResuMateDebug.inspectState()  // Verify
```

### Issue: "Resume not uploading"
**Solution:**
```javascript
// Check if text is saved
ResuMateDebug.inspectState()

// Manually set
localStorage.setItem('resumate_resume_text', 'Your resume...')

// Or use simulator
ResuMateDebug.simulateUpload()
```

### Issue: "Analysis not working"
**Solution:**
```javascript
// Check requirements
ResuMateDebug.validateStep(2)

// Manually test endpoint
ResuMateDebug.testAPI('/api/analyze', {
  resumeText: 'Test',
  jobText: 'Test',
  apiKey: localStorage.getItem('claude_api_key')
})
```

### Issue: "State lost on refresh"
**Solution:**
```javascript
// Export before refresh
const state = ResuMateDebug.exportState()

// After refresh, import
ResuMateDebug.importState(state)
```

### Issue: "Tests failing"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Run tests again
npm test

# Check specific test
npm test -- tests/workflow-e2e.test.js --verbose
```

---

## Environment Variables

### Required for API Testing
```bash
# Create secrets.env file
CLAUDE_API_KEY=sk-ant-your-key-here
PORT=3101
```

### Testing Without API Key
The workflow supports client-side API keys, so tests will pass even without a server-side key configured.

---

## Browser Console Shortcuts

### Quick Commands
```javascript
// Alias for common commands
const debug = ResuMateDebug;

// Now you can use:
debug.help()
debug.inspectState()
debug.simulateUpload()
debug.validateStep(1)
```

### Custom Test Data
```javascript
// Set custom resume
localStorage.setItem('resumate_resume_text', `
Your Name
Your Title
email@example.com

EXPERIENCE
Your experience here...
`)

// Set custom job
localStorage.setItem('resumate_job_text', `
Job Title
Company Name

Requirements:
- Requirement 1
- Requirement 2
`)

// Verify
ResuMateDebug.inspectState()
```

---

## Performance Profiling

### Measure Step Load Time
```javascript
console.time('step-load')
// Click to next step
console.timeEnd('step-load')
```

### Measure API Call Time
```javascript
ResuMateDebug.startAPIMonitoring()
// Make API calls
// Times will be logged automatically
ResuMateDebug.stopAPIMonitoring()
```

### Check localStorage Size
```javascript
let total = 0
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    total += localStorage[key].length
  }
}
console.log('Total localStorage:', (total / 1024).toFixed(2) + ' KB')
```

---

## Advanced Debugging

### Simulate Network Failure
```javascript
// Backup original fetch
window._fetch = window.fetch

// Replace with failing version
window.fetch = () => Promise.reject(new Error('Network error'))

// Test error handling
// ...

// Restore
window.fetch = window._fetch
```

### Simulate Slow API
```javascript
window._fetch = window.fetch
window.fetch = async (...args) => {
  await new Promise(r => setTimeout(r, 5000)) // 5 second delay
  return window._fetch(...args)
}
```

### Inspect Network Requests
```javascript
// Open Network tab in DevTools
// Filter by 'api'
// Watch requests in real-time
```

---

## Support & Documentation

### Files:
- `/INTEGRATION_TEST_REPORT.md` - Complete test results
- `/tests/workflow-e2e.test.js` - Test source code
- `/js/utils/debug-helpers.js` - Debug tool source

### Resources:
- Workflow HTML: `/workflow.html`
- Server API: `/server.js`
- State Management: `/js/core/workflow-state.js`

---

**Happy Debugging!**

For questions or issues, check the integration test report or examine the debug helper source code.
