# State Management Developer Guide

## Quick Start

### Reading State

```javascript
// Get entire state
const state = workflowState.getState();

// Get specific value with dot notation
const resumeText = workflowState.get('inputs.resume.text');
const apiKey = workflowState.get('inputs.preferences.apiKey');
const score = workflowState.get('analysis.score', 0); // with default value
```

### Writing State

```javascript
// Set single value
workflowState.set('inputs.resume.text', 'My resume text...');

// Set multiple values atomically
workflowState.update({
    'inputs.resume.text': 'My resume...',
    'inputs.resume.fileName': 'resume.pdf',
    'inputs.resume.uploadedAt': new Date().toISOString()
});

// Merge object at path
workflowState.merge('analysis', {
    score: 85,
    timestamp: new Date().toISOString()
});
```

### Listening to Changes

```javascript
// Subscribe to state changes
const unsubscribe = workflowState.on('change', (data) => {
    console.log('State changed:', data.path, data.value);
    console.log('New state:', data.state);
});

// Unsubscribe when done
unsubscribe();
```

## Storage Behavior

### Session Storage (Temporary)
Cleared on browser restart. Use for:
- Resume text
- Job descriptions
- Analysis results
- Workflow progress
- Temporary UI state

```javascript
// These go to sessionStorage automatically
workflowState.set('inputs.resume.text', text);
workflowState.set('inputs.job.description', text);
workflowState.set('analysis.score', 85);
```

### Local Storage (Persistent)
Survives browser restarts. Use for:
- API key
- User preferences
- Theme settings

```javascript
// These go to localStorage automatically
workflowState.set('inputs.preferences.apiKey', key);
workflowState.set('inputs.preferences.theme', 'dark');
workflowState.set('inputs.preferences.autoSave', true);
```

## State Schema

```javascript
{
  metadata: {
    version: 1,
    created: '2025-12-02T...',
    lastModified: '2025-12-02T...',
    sessionId: 'session_...'
  },

  currentStep: 1, // 1-5

  steps: {
    1: { completed: false, timestamp: null, data: {} },
    2: { completed: false, timestamp: null, data: {} },
    3: { completed: false, timestamp: null, data: {} },
    4: { completed: false, timestamp: null, data: {} },
    5: { completed: false, timestamp: null, data: {} }
  },

  inputs: {
    resume: {
      text: '',
      fileName: null,
      format: 'text',
      uploadedAt: null
    },
    job: {
      description: '',
      title: '',
      company: '',
      url: '',
      uploadedAt: null
    },
    preferences: {
      apiKey: '',      // PERSISTENT
      theme: 'light',  // PERSISTENT
      autoSave: true   // PERSISTENT
    }
  },

  analysis: {
    score: null,
    matchData: null,
    suggestions: [],
    tailoringSuggestions: [],
    keywords: [],
    gaps: [],
    strengths: [],
    timestamp: null
  },

  ats: {
    score: null,
    issues: [],
    recommendations: [],
    keywords: [],
    formatting: { valid: true, issues: [] },
    timestamp: null
  },

  documents: {
    resume: null,
    coverLetter: null,
    executiveBio: null,
    brandStatement: null,
    statusInquiry: null
  },

  validation: {
    errors: [],
    warnings: []
  },

  ui: {
    loading: false,
    activePanel: null,
    modals: { export: false, settings: false }
  }
}
```

## Common Patterns

### Updating Resume

```javascript
// When user types
function handleResumeInput() {
    const text = document.getElementById('resume-text').value;
    workflowState.set('inputs.resume.text', text);
    // Listeners automatically update preview, onboarding, etc.
}

// When user uploads file
async function handleResumeUpload(file) {
    const text = await parseFile(file);
    workflowState.update({
        'inputs.resume.text': text,
        'inputs.resume.fileName': file.name,
        'inputs.resume.uploadedAt': new Date().toISOString()
    });
}
```

### Checking Completion

```javascript
// Check if step is complete
if (workflowState.isStepComplete(1)) {
    console.log('Step 1 is done!');
}

// Get overall progress
const progress = workflowState.getProgress(); // 0-100

// Mark step complete
workflowState.completeStep(1, {
    resumeUploaded: true,
    jobUploaded: true
});
```

### Validation

```javascript
// Validate current state
const validation = workflowState.validate();

if (validation.valid) {
    console.log('All good!');
} else {
    console.error('Errors:', validation.errors);
    console.warn('Warnings:', validation.warnings);
}
```

### Getting Summary

```javascript
// Get summary for debugging
const summary = workflowState.getSummary();
console.log(summary);
// {
//   currentStep: 1,
//   progress: 20,
//   stepsCompleted: 1,
//   hasResume: true,
//   hasJob: false,
//   hasAnalysis: false,
//   hasAtsScore: false,
//   documentsCount: 0,
//   validation: { valid: false, errors: [...], warnings: [...] }
// }
```

## Event System

### Available Events

- `change` - Any state change
- `reset` - State reset
- `import` - State imported

### Subscribe Pattern

```javascript
class MyComponent {
    constructor() {
        this.unsubscribers = [];
    }

    initialize() {
        // Subscribe to changes
        const unsub = workflowState.on('change', (data) => {
            this.handleStateChange(data);
        });

        this.unsubscribers.push(unsub);
    }

    handleStateChange(data) {
        // React to state changes
        if (data.path === 'inputs.resume.text') {
            this.updatePreview(data.value);
        }
    }

    destroy() {
        // Cleanup subscriptions
        this.unsubscribers.forEach(unsub => unsub());
    }
}
```

## Migration from Old Code

### Before (Old localStorage)

```javascript
// Old way - direct localStorage
localStorage.setItem('claude_api_key', apiKey);
const apiKey = localStorage.getItem('claude_api_key');

// Old way - manual DataBridge
dataBridge.saveResume(text);
const resume = dataBridge.getField('resume.text');
```

### After (New WorkflowState)

```javascript
// New way - unified state
workflowState.set('inputs.preferences.apiKey', apiKey);
const apiKey = workflowState.get('inputs.preferences.apiKey');

// New way - automatic propagation
workflowState.set('inputs.resume.text', text);
// All listeners automatically notified
```

## Best Practices

### DO

✅ Use `workflowState.set()` for single updates
✅ Use `workflowState.update()` for multiple related updates
✅ Subscribe to `change` events for reactive UI
✅ Use dot notation for nested paths
✅ Provide default values when getting data
✅ Clean up event listeners when components unmount

### DON'T

❌ Modify state directly (`workflowState.state.foo = 'bar'`)
❌ Store large binary data in state
❌ Subscribe without unsubscribing
❌ Use localStorage directly for new features
❌ Bypass state system with direct DOM manipulation

## Debugging

### Check Current State

```javascript
// In browser console
console.log(workflowState.getSummary());
console.log(workflowState.getState());
console.log(workflowState.get('inputs.resume.text'));
```

### Check Storage

```javascript
// In browser console
console.log('Session:', sessionStorage.getItem('resumate_session_state'));
console.log('Persistent:', localStorage.getItem('resumate_persistent_data'));
```

### Clear Everything

```javascript
// Reset to fresh state (keeps API key)
workflowState.reset(true);

// Reset everything including API key
workflowState.reset(false);

// Clear all storage (hard reset)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Migration

```javascript
// Check if migration ran
stateMigration.hasMigrated(); // true/false

// Force re-run migration (testing only)
stateMigration.resetMigration();
stateMigration.migrate();
```

### Enable Detailed Logging

```javascript
// All state management classes log to console with prefixes:
// [WorkflowState] - Core state operations
// [StateMigration] - Migration operations
// [StateInit] - Initialization sequence
// [Onboarding] - Progress tracking
// [Preview] - Preview updates

// Filter in console:
// [WorkflowState]
// [StateMigration]
// etc.
```

## Common Issues

### Issue: State not persisting
**Check**: Is it session or persistent data?
- Session data clears on browser restart (expected)
- Persistent data (API key) should survive

### Issue: UI not updating
**Check**: Are you listening to state changes?
```javascript
workflowState.on('change', (data) => {
    this.updateUI(data);
});
```

### Issue: Preview blank
**Check**: Is resume text in state?
```javascript
const text = workflowState.get('inputs.resume.text');
console.log('Resume text:', text);
```

### Issue: Old data still showing
**Solution**: Clear migration flag and reload
```javascript
localStorage.removeItem('resumate_migration_completed');
location.reload();
```

## Testing

### Unit Test Example

```javascript
describe('WorkflowState', () => {
    beforeEach(() => {
        // Clear storage before each test
        sessionStorage.clear();
        localStorage.clear();
    });

    it('should persist API key across sessions', () => {
        workflowState.set('inputs.preferences.apiKey', 'test-key');

        // Simulate browser restart
        sessionStorage.clear();

        const newState = new WorkflowState();
        expect(newState.get('inputs.preferences.apiKey')).toBe('test-key');
    });

    it('should clear session data on reset', () => {
        workflowState.set('inputs.resume.text', 'My resume');
        workflowState.reset(true);

        expect(workflowState.get('inputs.resume.text')).toBe('');
    });
});
```

## Performance Tips

1. **Batch updates**: Use `update()` instead of multiple `set()` calls
2. **Debounce rapid changes**: Preview uses 300ms debounce
3. **Unsubscribe when done**: Prevent memory leaks
4. **Use default values**: Avoid null checks everywhere

## Support

For questions or issues:
1. Check browser console for `[WorkflowState]` logs
2. Verify script load order in index.html
3. Test with storage cleared (hard refresh)
4. Review STATE_MANAGEMENT_FIXES.md for architecture details

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
