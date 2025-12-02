# ResuMate Feature Demo Guide

**Welcome to ResuMate!** This comprehensive guide will walk you through all features of the AI-powered resume optimization platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Wave 1: Core Features](#wave-1-core-features)
   - [Visual Resume Builder](#1-visual-resume-builder)
   - [Real-Time Preview System](#2-real-time-preview-system)
   - [Template System](#3-template-system)
   - [AI Resume Writer](#4-ai-resume-writer)
   - [Resume Parser](#5-resume-parser)
3. [Wave 2: Advanced Features](#wave-2-advanced-features)
   - [Job Tailoring Engine](#6-job-tailoring-engine)
   - [AI Proofreading Suite](#7-ai-proofreading-suite)
   - [ATS Scanner](#8-ats-scanner)
   - [Export Engine](#9-export-engine)
4. [Wave 3: Premium Features](#wave-3-premium-features)
   - [Cover Letter Writer](#10-cover-letter-writer)
   - [Cover Letter Templates](#11-cover-letter-templates)
   - [Version Management](#12-version-management)
   - [LinkedIn Integration](#13-linkedin-integration)
   - [Application Tracker](#14-application-tracker)
5. [Tips & Tricks](#tips--tricks)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Claude API key (get one from [Anthropic Console](https://console.anthropic.com/))
- Your resume (PDF, DOCX, DOC, or TXT format)
- Job description you're targeting (optional but recommended)

### Quick Start
1. **Access ResuMate:** Open http://localhost:3101/index.html
2. **Upload Resume:** Click the upload area or paste resume text
3. **Add Job Description:** Paste the job description you're applying for
4. **Enter API Key:** Input your Claude API key (stored locally, never sent to our servers)
5. **Click Analyze:** Let AI analyze and optimize your resume

### Navigation
- **Main Entry Point:** index.html - Your starting point for quick resume analysis
- **Resume Builder:** builder.html - Build resumes from scratch with 23 section types
- **All Test Pages:** Access individual features through their dedicated test pages

---

## Wave 1: Core Features

### 1. Visual Resume Builder
**Page:** http://localhost:3101/builder.html
**Purpose:** Build professional resumes from scratch with drag-and-drop functionality

#### Key Features
- **23 Section Types:** Choose from headers, summaries, experience, education, skills, and more
- **Drag-and-Drop:** Reorder sections by dragging them
- **Undo/Redo:** Full history tracking with keyboard shortcuts
- **Auto-Save:** Your work is automatically saved every 30 seconds
- **Content Editing:** Click any section to edit inline

#### How to Use

**Step 1: Access the Builder**
```
1. Navigate to http://localhost:3101/builder.html
2. Wait for initialization (you'll see a full-screen builder interface)
3. Check the browser console for confirmation: "ResuMate Resume Builder initialized successfully!"
```

**Step 2: Add Sections**
```
1. Look for the "Add Section" button or section menu
2. Choose from 23 available section types:
   - Header (required - name, contact info)
   - Professional Summary
   - Work Experience
   - Education
   - Skills
   - Certifications
   - Projects
   - Awards
   - Publications
   - Languages
   - Volunteer Work
   - And 12 more...
3. Click to add the section to your resume
```

**Step 3: Edit Content**
```
1. Click on any section to edit
2. Fill in your information
3. Changes are tracked in real-time
4. Auto-save runs every 30 seconds
```

**Step 4: Reorder Sections**
```
1. Click and hold on a section header
2. Drag to new position
3. Drop to reorder
4. Layout updates automatically
```

**Step 5: Use Keyboard Shortcuts**
```
- Cmd/Ctrl + Z: Undo last change
- Cmd/Ctrl + Shift + Z: Redo
- Cmd/Ctrl + Y: Redo (alternative)
```

**Step 6: Save and Export**
```
1. Click "Save Resume" to force immediate save
2. Click "Export Resume" to download as JSON
3. Data is also saved to localStorage automatically
```

#### Developer Commands (Browser Console)
```javascript
// Get current resume state
resumeBuilder.getState()

// Get history manager
resumeBuilder.getHistory()

// Get auto-save manager
resumeBuilder.getAutoSave()

// Force save
resumeBuilder.saveResume()

// Export to JSON
resumeBuilder.exportResume()
```

#### Tips
- Start with the Header section (it's required)
- Add Summary before Experience for better flow
- Use drag-and-drop to optimize section order for ATS
- Watch the console for auto-save confirmations
- Maximum 50 undo states are kept

---

### 2. Real-Time Preview System
**Page:** http://localhost:3101/test-preview.html
**Purpose:** See your resume rendered in real-time as you make changes

#### Key Features
- **3 View Modes:** Split view, Preview only, Editor only
- **Print Preview:** See exactly how your resume will print
- **Page Size Options:** Switch between A4 and US Letter
- **Real-Time Updates:** Preview updates within 500ms of changes
- **Performance Metrics:** Track rendering performance
- **Sample Resumes:** Load pre-built examples to test

#### How to Use

**Step 1: Load the Preview System**
```
1. Navigate to http://localhost:3101/test-preview.html
2. System automatically loads with sample resume
3. Preview appears on the right, controls on the left
```

**Step 2: Choose View Mode**
```
1. Split View (default): See editor and preview side-by-side
2. Preview Only: Full-screen preview
3. Editor Only: Full-screen editor
4. Click the toolbar buttons to switch modes
```

**Step 3: Load Sample Resumes**
```
1. Click "Load Minimal Resume" - Simple 2-section resume
2. Click "Load Sample Resume" - Standard 5-section resume
3. Click "Load Complex Resume" - Advanced 8-section resume
4. Click "Clear" to start fresh
```

**Step 4: Adjust Page Size**
```
1. Click "A4" for international standard (210 x 297mm)
2. Click "Letter" for US standard (8.5 x 11 inches)
3. Preview adjusts automatically
```

**Step 5: Test Performance**
```
1. Click "Test Performance" button
2. System runs 10 rendering iterations
3. Results show average, min, and max render times
4. Target: <500ms per render (should PASS)
```

**Step 6: Monitor Metrics**
```
Watch the metrics panel for:
- Last Update: Time taken for most recent render
- Update Count: Total number of renders
- Average Time: Average render time across all updates
```

#### Sample Resume Types

**Minimal Resume:**
- Header (name, title, contact)
- Professional Summary
- Perfect for testing basic rendering

**Sample Resume:**
- Header
- Professional Summary
- Work Experience (2 jobs)
- Education (2 degrees)
- Skills
- Great for testing standard layouts

**Complex Resume:**
- Header
- Professional Summary
- Professional Experience (2 positions)
- Education (2 degrees)
- Publications (3 papers)
- Awards & Honors (3 awards)
- Technical Skills
- Languages (3 languages)
- Excellent for stress-testing the renderer

#### Tips
- Use Split View for editing and previewing simultaneously
- Switch to Preview Only before exporting
- Use Print Preview to check page breaks
- Test Performance regularly to ensure speed
- Sample resumes demonstrate best practices

---

### 3. Template System
**Page:** http://localhost:3101/template-test.html
**Purpose:** Apply professional templates to transform your resume's appearance

#### Key Features
- **3 Templates Available:** Classic, Modern, Creative (6 planned total)
- **Color Presets:** 6 professional color schemes
- **Typography Presets:** 5 font combinations
- **Spacing Presets:** Compact, Normal, Spacious
- **Page Size Control:** A4 or US Letter
- **Live Preview:** See changes instantly
- **Template Info:** View technical details about current template

#### How to Use

**Step 1: Access Template System**
```
1. Navigate to http://localhost:3101/template-test.html
2. Page loads with Classic template applied
3. Sample resume content displays automatically
```

**Step 2: Switch Templates**
```
1. Click template buttons to switch:
   - Classic: Traditional, professional, high ATS score
   - Modern: Clean lines, contemporary design
   - Creative: Bold, eye-catching, creative roles
2. Active template button is highlighted
3. Preview updates within 200ms
4. Status notification confirms switch
```

**Step 3: Apply Color Presets**
```
1. Select from Color Presets dropdown:
   - Professional Blue: Corporate standard
   - Executive Navy: Leadership roles
   - Creative Purple: Design/creative fields
   - Modern Green: Tech/sustainable industries
   - Minimal Gray: Conservative industries
   - Warm Orange: Approachable/friendly roles
2. Colors apply immediately to preview
3. Status shows "Applied [preset name] color preset"
```

**Step 4: Apply Typography Presets**
```
1. Select from Typography Presets dropdown:
   - Classic Serif: Traditional, formal
   - Modern Sans: Clean, contemporary
   - Professional: Balanced, versatile
   - Creative Mix: Unique, standout
   - Technical: Monospace accents, tech roles
2. Fonts change across entire resume
3. Status confirms application
```

**Step 5: Apply Spacing Presets**
```
1. Select from Spacing Presets dropdown:
   - Compact: Fit more content (1-page resumes)
   - Normal: Balanced spacing (recommended)
   - Spacious: Emphasize white space (shorter resumes)
2. Spacing adjusts throughout document
3. Useful for fitting content to page limits
```

**Step 6: Set Page Size**
```
1. Click "US Letter" for American standard (8.5" x 11")
2. Click "A4" for international standard (210mm x 297mm)
3. Critical for proper printing
```

**Step 7: View Template Info**
```
1. Click "Show Info" button
2. Panel displays JSON with:
   - Current template details
   - Active customizations
   - Available templates
   - Registry statistics
3. Useful for debugging and verification
```

**Step 8: Reset Customizations**
```
1. Click "Reset All" button
2. Returns to default template settings
3. All dropdowns reset to empty
4. Useful for starting fresh
```

#### Template Descriptions

**Classic Template**
- **Best For:** Traditional industries (finance, law, healthcare)
- **Style:** Serif fonts, conservative colors, clean structure
- **ATS Score:** 85/100 (expected)
- **Page Layout:** Single column, clear sections

**Modern Template**
- **Best For:** Tech, startups, contemporary companies
- **Style:** Sans-serif fonts, modern spacing, clean lines
- **ATS Score:** 80/100 (expected)
- **Page Layout:** Minimalist, emphasizes content

**Creative Template**
- **Best For:** Design, marketing, creative agencies
- **Style:** Bold typography, unique layouts, standout design
- **ATS Score:** 70/100 (expected)
- **Page Layout:** Two-column option, visual hierarchy

**Coming Soon:**
- Executive Template: Leadership roles, C-suite positions
- Technical Template: Engineers, developers, technical roles
- Minimal Template: Ultra-clean, maximum ATS optimization

#### Tips
- Start with Classic for highest ATS compatibility
- Use Modern for tech companies
- Creative is best for portfolio-driven roles
- Compact spacing helps fit content on one page
- Professional color preset works for 90% of applications
- Always export in both A4 and Letter for international applications
- Test print preview before finalizing

---

### 4. AI Resume Writer
**Page:** http://localhost:3101/test-ai.html
**Purpose:** Use AI to generate, improve, and optimize resume content

#### Key Features
- **10 Generation Methods** (4 visible in test UI)
- **Claude AI Integration:** Powered by Sonnet 4
- **Context-Aware:** Generates content based on your background
- **Quality Focused:** Professional, ATS-optimized output
- **Instant Results:** Fast AI-powered generation

#### How to Use

**Step 1: Setup API Key**
```
1. Navigate to http://localhost:3101/test-ai.html
2. Locate "Setup" section at top
3. Enter your Claude API key (starts with sk-ant-)
4. Key is stored in session only
5. Never shared with external servers
```

**Step 2: Generate Professional Summary**
```
1. Scroll to "Test 1: Generate Professional Summary"
2. Fill in fields:
   - Job Title: e.g., "Senior Software Engineer"
   - Years of Experience: e.g., "8"
   - Skills: e.g., "Python, JavaScript, React, Node.js, AWS"
   - Target Role: e.g., "Tech Lead"
3. Click "Generate Summary"
4. Wait for AI response (5-15 seconds)
5. Review generated professional summary
6. Copy to your resume
```

**Example Output:**
```
Results-driven Senior Software Engineer with 8+ years of experience
building scalable web applications and leading technical teams. Expert
in Python, JavaScript, React, Node.js, and AWS with a proven track
record of delivering high-impact solutions. Seeking Tech Lead role to
leverage technical expertise and leadership skills to drive innovation
and mentor engineering teams.
```

**Step 3: Expand Bullet Points**
```
1. Navigate to "Test 2: Expand Bullet Point"
2. Enter brief bullet: e.g., "Led team project"
3. Click "Expand Bullet"
4. AI generates detailed, quantified bullet:
   "Led cross-functional team of 8 engineers in delivering
    mission-critical project 2 weeks ahead of schedule, resulting
    in 25% improvement in system performance and $500K cost savings"
5. Use for weak or incomplete bullets
```

**Step 4: Suggest Action Verbs**
```
1. Navigate to "Test 3: Suggest Action Verbs"
2. Enter context: e.g., "Improved system performance"
3. Click "Suggest Verbs"
4. AI provides stronger alternatives:
   - Optimized system performance
   - Accelerated system performance
   - Enhanced system performance
   - Amplified system performance
5. Replace weak verbs with power verbs
```

**Step 5: Quantify Achievements**
```
1. Navigate to "Test 4: Quantify Achievement"
2. Enter achievement: e.g., "Improved application performance by optimizing database queries"
3. Click "Quantify"
4. AI suggests quantification strategies:
   "Improved application performance by 45%, reducing query response
    time from 800ms to 440ms through database indexing and query
    optimization, impacting 10,000+ daily active users"
5. Add metrics to increase impact
```

#### Additional Generation Methods (Not Visible in Test UI)

**5. Rewrite for ATS**
- Optimizes content for Applicant Tracking Systems
- Adds relevant keywords
- Improves formatting for parsing

**6. Generate Skills Section**
- Creates categorized skills list
- Balances technical and soft skills
- Tailors to job requirements

**7. Optimize Job Titles**
- Aligns job titles with industry standards
- Improves searchability
- Maintains accuracy

**8. Generate Career Objective**
- Creates compelling objective statements
- Tailors to specific roles
- Emphasizes value proposition

**9. Improve Formatting**
- Suggests structural improvements
- Optimizes section order
- Enhances readability

**10. Tailor to Job Description**
- Matches resume to job requirements
- Incorporates job-specific keywords
- Highlights relevant experience

#### Best Practices
- Always review AI-generated content for accuracy
- Customize output to match your voice
- Verify quantifications are truthful
- Use action verbs consistently
- Keep summaries to 3-4 sentences
- Quantify achievements whenever possible
- Test different prompt variations
- Iterate on output for best results

#### Tips
- More specific inputs yield better outputs
- Provide context for better results
- Combine multiple generation methods
- Use suggest verbs to strengthen weak bullets
- Quantification adds credibility and impact
- Professional summaries should be concise but compelling
- Review for clichés and buzzwords

---

### 5. Resume Parser
**Page:** http://localhost:3101/parser-demo.html
**Purpose:** Extract and structure information from existing resumes

#### Key Features
- **Multi-Format Support:** PDF, DOCX, DOC, TXT
- **AI-Powered Extraction:** 87-90% accuracy
- **Section Detection:** Automatically identifies resume sections
- **Batch Processing:** Upload multiple resumes (API supports)
- **Drag-and-Drop:** Easy file upload
- **Structured Output:** Clean, organized resume data

#### How to Use

**Step 1: Access Parser**
```
1. Navigate to http://localhost:3101/parser-demo.html
2. Beautiful purple gradient interface loads
3. Large upload area visible with dashed border
```

**Step 2: Upload Resume**

**Option A: Drag and Drop**
```
1. Locate resume file on your computer
2. Drag file over upload area
3. Upload area highlights (light blue background)
4. Drop file to upload
5. Processing begins automatically
```

**Option B: Click to Upload**
```
1. Click anywhere in upload area
2. File browser opens
3. Select resume file (PDF, DOCX, DOC, or TXT)
4. Click "Open"
5. Processing begins
```

**Step 3: Configure Parser Options**
```
1. Locate "Options" panel below upload area
2. Toggle options:
   - Use AI Extraction: Enable for higher accuracy (requires API key)
   - Extract Sections: Identify resume sections automatically
   - Structure Data: Organize into clean format
3. Enter API key if using AI extraction
```

**Step 4: Parse Resume**
```
1. After file upload, parser processes automatically
2. Watch for progress indicator
3. Results appear in structured format:
   - Personal Information
   - Professional Summary
   - Work Experience (with dates, companies, bullets)
   - Education (degrees, institutions, dates)
   - Skills (categorized if possible)
   - Additional sections as detected
```

**Step 5: Review Results**
```
1. Check accuracy of extracted information
2. Verify section detection
3. Review structured data format
4. Use parsed data to populate resume builder
```

**Step 6: Handle Errors**
```
Common issues:
- File too large (>10MB): Compress PDF or split document
- Unsupported format: Convert to PDF, DOCX, or TXT
- Corrupted file: Try re-exporting from original software
- Low accuracy: Enable AI extraction with API key
```

#### Supported File Formats

**PDF (Recommended)**
- Best compatibility
- Preserves formatting
- Works with most resume PDFs
- Max size: 10MB

**DOCX (Microsoft Word)**
- High accuracy
- Editable format
- Modern Word format
- Max size: 10MB

**DOC (Legacy Word)**
- Supported for compatibility
- Older Word format
- May have parsing limitations
- Max size: 10MB

**TXT (Plain Text)**
- Fastest parsing
- No formatting preserved
- 100% compatible
- Max size: 10MB

#### Expected Accuracy

**Without AI (Basic Parsing)**
- Text extraction: 95%+
- Section detection: 70-80%
- Data structuring: 60-70%

**With AI (Claude-Powered)**
- Text extraction: 98%+
- Section detection: 87-90%
- Data structuring: 85-90%
- Semantic understanding: 80-85%

#### What Gets Extracted

**Personal Information:**
- Full name
- Email address
- Phone number
- Location (city, state)
- LinkedIn profile
- Personal website
- GitHub profile

**Professional Summary:**
- Summary/objective text
- Career highlights
- Key qualifications

**Work Experience:**
- Job titles
- Company names
- Employment dates (start and end)
- Location
- Job descriptions
- Bullet points (achievements)

**Education:**
- Degrees earned
- Institutions
- Graduation dates
- GPA (if present)
- Honors/distinctions

**Skills:**
- Technical skills
- Soft skills
- Tools and technologies
- Languages
- Certifications

**Additional Sections:**
- Certifications and licenses
- Projects
- Publications
- Awards and honors
- Volunteer work
- Languages
- Interests

#### Tips
- Use well-formatted resumes for best results
- Enable AI extraction for complex layouts
- PDF format recommended for best compatibility
- Standard resume templates parse more accurately
- Verify extracted data before using
- Two-column layouts may require AI extraction
- Creative templates may reduce accuracy
- Tables and graphics don't parse well
- Test with sample resume first

---

## Wave 2: Advanced Features

### 6. Job Tailoring Engine
**Page:** http://localhost:3101/test-job-tailor.html
**Purpose:** Customize your resume to match specific job descriptions

#### Key Features
- **Job Description Analysis:** AI parses job requirements
- **Resume Matching:** Calculates compatibility score
- **Keyword Optimization:** Identifies missing keywords
- **Before/After Comparison:** Visual diff viewer
- **Selective Changes:** Apply specific suggestions
- **Batch Processing:** Tailor for multiple jobs

#### How to Use

**Step 1: Access Tailoring Engine**
```
1. Navigate to http://localhost:3101/test-job-tailor.html
2. Clean interface with modern purple gradient
3. Input areas for resume and job description
```

**Step 2: Enter Your Resume**
```
1. Locate "Resume" textarea (first input section)
2. Options:
   A. Paste your current resume text
   B. Load from resume builder
   C. Import from parser
3. Include all sections (summary, experience, skills, etc.)
```

**Step 3: Enter Job Description**
```
1. Locate "Job Description" textarea (second input)
2. Copy entire job posting
3. Include:
   - Job title
   - Required qualifications
   - Preferred qualifications
   - Responsibilities
   - Skills and technologies
   - Education requirements
4. More complete description = better tailoring
```

**Step 4: Enter API Key**
```
1. Locate API Key input (password field)
2. Enter your Claude API key
3. Key required for AI-powered tailoring
```

**Step 5: Run Tailoring Analysis**
```
1. Click "Tailor Resume" button
2. AI analyzes both documents
3. Processing takes 15-30 seconds
4. Status updates show progress
```

**Step 6: Review Match Score** (Expected - UI may need update)
```
1. Match percentage displays (e.g., "75% Match")
2. Color coding:
   - Green (80-100%): Excellent match
   - Yellow (60-79%): Good match, improvements possible
   - Red (0-59%): Significant gap, major tailoring needed
3. Breakdown shows:
   - Matched keywords
   - Missing keywords
   - Recommended additions
```

**Step 7: Review Suggested Changes**
```
1. Diff viewer shows before/after comparison
2. Changes highlighted:
   - Green: Additions (new keywords, phrases)
   - Red: Removals (less relevant content)
   - Yellow: Modifications (rephrased for better match)
3. Each suggestion explained with rationale
```

**Step 8: Apply Changes** (Expected - UI may need update)
```
1. Review each suggestion individually
2. Select changes to apply (checkboxes)
3. Options:
   - Apply All: Accept all suggestions
   - Apply Selected: Choose specific changes
   - Reject: Dismiss suggestions
4. Updated resume generates automatically
```

**Step 9: Iterate and Refine**
```
1. Re-run analysis on updated resume
2. Check new match score
3. Apply additional refinements
4. Repeat until satisfied (target: 85%+ match)
```

#### Tailoring Strategies

**Keyword Optimization:**
- Match exact job description keywords
- Use industry-standard terminology
- Include technical skills mentioned
- Mirror job title variations

**Experience Highlighting:**
- Emphasize relevant experience
- De-emphasize unrelated roles
- Quantify achievements matching job metrics
- Use similar bullet point structure

**Skills Alignment:**
- Prioritize required skills
- Add missing critical skills
- Categorize skills to match job
- Include skill proficiency levels

**Summary Customization:**
- Incorporate job title in summary
- Mention specific company/role
- Highlight matching qualifications
- Use keywords from job description

#### Common Use Cases

**Scenario 1: High Match Score (85%+)**
- Already well-aligned resume
- Minor keyword adjustments needed
- Focus on summary customization
- Emphasize most relevant experience

**Scenario 2: Medium Match Score (65-84%)**
- Moderate tailoring required
- Add missing keywords strategically
- Reorder experience to prioritize relevant roles
- Expand on matching skills

**Scenario 3: Low Match Score (<65%)**
- Significant gap between resume and job
- Consider if you're qualified
- Major restructuring needed
- May need additional experience/skills

#### Tips
- Always start with most recent resume version
- Copy entire job description for best results
- Run tailoring before every application
- Don't sacrifice accuracy for keywords
- Keep multiple tailored versions (see Version Management)
- Target 80-85% match score (100% is suspicious)
- Natural keyword integration is key
- Verify changes maintain truthfulness

---

### 7. AI Proofreading Suite
**Page:** http://localhost:3101/test-proofread.html
**Purpose:** Polish your resume to perfection with AI-powered proofreading

#### Key Features
- **Grammar Detection:** Identifies errors and typos
- **Cliché Detection:** Flags 19+ overused phrases
- **Weak Verb Detection:** Finds 17+ weak verbs to replace
- **Passive Voice Flagging:** Promotes active voice
- **Tone Analysis:** Ensures professional tone
- **Consistency Checks:** Verifies formatting uniformity
- **Polish Score:** 0-100 rating of resume quality

#### How to Use

**Step 1: Access Proofreading Suite**
```
1. Navigate to http://localhost:3101/test-proofread.html
2. Clean, professional interface loads
3. Test sections for each proofreading type
```

**Step 2: Input Resume Content**
```
1. Paste resume text into sample content areas
2. Or load from builder/parser
3. Each test section has its own input area
```

**Step 3: Run Grammar Check**
```
1. Locate "Grammar Detection" section
2. Paste resume text
3. Click "Check Grammar"
4. Review issues:
   - Spelling errors highlighted
   - Grammar mistakes explained
   - Suggested corrections provided
5. Apply fixes manually or automatically
```

**Step 4: Detect Clichés**
```
1. Locate "Cliché Detection" section
2. AI scans for 19+ common resume clichés:
   - "Team player"
   - "Hard worker"
   - "Go-getter"
   - "Think outside the box"
   - "Synergy"
   - "Best of breed"
   - "Results-driven" (overused)
   - And 12+ more...
3. Each cliché highlighted with alternative suggestions
4. Replace with specific, quantified achievements
```

**Example Replacements:**
```
Before: "Team player who works well with others"
After: "Collaborated with cross-functional team of 12 to deliver project 3 weeks ahead of schedule"

Before: "Detail-oriented professional"
After: "Reduced error rate by 35% through implementation of quality assurance protocols"

Before: "Excellent communication skills"
After: "Presented quarterly results to C-suite executives and led training for 50+ employees"
```

**Step 5: Find Weak Verbs**
```
1. Locate "Weak Verb Detection" section
2. AI identifies 17+ weak verbs:
   - "Helped" → "Facilitated, Enabled, Drove"
   - "Worked on" → "Developed, Engineered, Built"
   - "Responsible for" → "Managed, Led, Directed"
   - "Did" → "Executed, Implemented, Delivered"
   - "Made" → "Created, Produced, Generated"
   - "Got" → "Achieved, Secured, Obtained"
   - And 11+ more...
3. Power verb suggestions provided
4. Replace for stronger impact
```

**Step 6: Flag Passive Voice**
```
1. Locate "Passive Voice" section
2. AI finds passive constructions:
   - "Was responsible for" → "Managed"
   - "Were created by" → "Created"
   - "Was improved" → "Improved"
3. Active voice alternatives suggested
4. Strengthens bullet points significantly
```

**Step 7: Analyze Tone**
```
1. Locate "Tone Analysis" section
2. AI evaluates overall tone:
   - Professional (target)
   - Too casual
   - Too formal
   - Inconsistent
3. Recommendations for adjustment
4. Examples of desired tone
```

**Step 8: Run Consistency Checks**
```
1. Locate "Consistency Checks" section
2. AI verifies:
   - Date formats (MM/YYYY vs Month YYYY)
   - Bullet point punctuation
   - Tense usage (present for current role, past for previous)
   - Capitalization
   - Spacing and indentation
3. Inconsistencies highlighted
4. Standardization suggestions provided
```

**Step 9: Review Polish Score**
```
1. Overall score calculated (0-100)
2. Score breakdown:
   - Grammar: 20 points
   - Clarity: 20 points
   - Impact: 20 points
   - Consistency: 20 points
   - ATS Optimization: 20 points
3. Target: 85+ for professional resumes
4. Action items to improve score
```

#### Proofreading Checklist

**Grammar & Spelling (20% of score)**
- [ ] No spelling errors
- [ ] Correct grammar throughout
- [ ] Proper punctuation
- [ ] No typos or transpositions

**Clarity (20% of score)**
- [ ] No clichés or buzzwords
- [ ] Strong action verbs
- [ ] Active voice used
- [ ] Clear, concise language

**Impact (20% of score)**
- [ ] Quantified achievements
- [ ] Specific examples
- [ ] Results-oriented bullets
- [ ] Power verbs throughout

**Consistency (20% of score)**
- [ ] Uniform date formats
- [ ] Consistent bullet punctuation
- [ ] Proper tense usage
- [ ] Aligned formatting

**ATS Optimization (20% of score)**
- [ ] Relevant keywords
- [ ] Standard section headers
- [ ] Simple formatting
- [ ] No graphics or tables

#### Common Issues and Fixes

**Issue 1: Low Grammar Score**
```
Problem: Spelling errors, grammar mistakes
Fix: Run spell check, review grammar rules
Tools: Grammarly integration, manual review
```

**Issue 2: Cliché Overload**
```
Problem: Generic phrases like "team player"
Fix: Replace with specific, quantified achievements
Example: "Collaborated with 5-person team to increase revenue by 30%"
```

**Issue 3: Weak Verbs**
```
Problem: "Responsible for," "Helped with," "Worked on"
Fix: Use power verbs - "Led," "Developed," "Optimized"
Impact: Increases perceived competence and impact
```

**Issue 4: Passive Voice**
```
Problem: "Project was completed" instead of "Completed project"
Fix: Convert to active voice for stronger impact
Benefit: More direct, powerful, engaging
```

**Issue 5: Inconsistent Formatting**
```
Problem: Mixed date formats (Jan 2020, 01/2020, January 2020)
Fix: Standardize to one format throughout
Recommendation: "Month YYYY" format (e.g., "January 2020")
```

#### Tips
- Run proofreading AFTER tailoring
- Aim for polish score of 85+
- Zero tolerance for spelling errors
- Replace ALL weak verbs with power verbs
- Eliminate clichés completely
- Use active voice 95%+ of time
- Be consistent with formatting
- Have human reviewer check final version
- Print and read aloud to catch errors
- Check on multiple devices for formatting

---

### 8. ATS Scanner
**Page:** http://localhost:3101/test-ats-scanner.html
**Purpose:** Ensure your resume passes Applicant Tracking Systems

#### Key Features
- **30+ ATS Checks:** Comprehensive scanning
- **5 Category Scoring:** Formatting, Structure, Content, Keywords, Overall
- **Letter Grade:** A-F rating system
- **Detailed Recommendations:** Specific improvements
- **Score Breakdown:** Category-by-category analysis
- **Historical Tracking:** Monitor score improvements over time

#### How to Use

**Step 1: Access ATS Scanner**
```
1. Navigate to http://localhost:3101/test-ats-scanner.html
2. Professional scanning interface loads
3. Upload or paste resume
```

**Step 2: Upload Resume**
```
1. Click upload area or paste text
2. Supported formats: PDF, DOCX, TXT
3. Resume processes automatically
```

**Step 3: Run ATS Scan**
```
1. Click "Scan Resume" button
2. 30+ checks run automatically:

   FORMATTING CHECKS (Category 1):
   - File format compatibility
   - Font compatibility (standard fonts only)
   - No headers/footers
   - No text boxes
   - No columns
   - No graphics/images
   - No tables (or simple tables only)
   - Consistent spacing
   - Proper margins

   STRUCTURE CHECKS (Category 2):
   - Standard section headers
   - Logical section order
   - Contact info at top
   - Reverse chronological order
   - One-page or two-page standard
   - No page breaks mid-section

   CONTENT CHECKS (Category 3):
   - Relevant keywords present
   - Quantified achievements
   - Dates for all experience
   - Complete contact information
   - No personal pronouns
   - Professional email address
   - No photos or personal info

   KEYWORD CHECKS (Category 4):
   - Job-specific keywords
   - Industry terminology
   - Technical skills
   - Soft skills
   - Action verbs
   - Relevant certifications

   OVERALL CHECKS (Category 5):
   - Length appropriate
   - Readability score
   - Keyword density
   - White space balance
   - Professional tone
```

**Step 4: Review Score Breakdown**
```
1. Overall ATS Score displayed (0-100)
2. Letter grade assigned:
   - A (90-100): Excellent, highly likely to pass
   - B (80-89): Good, will likely pass
   - C (70-79): Average, may pass depending on system
   - D (60-69): Below average, improvements needed
   - F (<60): Poor, unlikely to pass

3. Category scores shown:
   - Formatting: X/20
   - Structure: X/20
   - Content: X/20
   - Keywords: X/20
   - Overall: X/20
```

**Step 5: Review Detailed Recommendations**
```
1. Recommendations engine provides specific fixes:

   HIGH PRIORITY:
   - Remove tables (replace with bullet points)
   - Use standard section headers (e.g., "Work Experience" not "My Journey")
   - Add missing contact information
   - Convert two-column to single-column

   MEDIUM PRIORITY:
   - Replace fancy fonts with Arial/Calibri/Times New Roman
   - Add more relevant keywords
   - Quantify achievements with metrics
   - Expand on technical skills

   LOW PRIORITY:
   - Adjust margins for consistency
   - Improve white space distribution
   - Optimize keyword density
   - Refine professional summary
```

**Step 6: Implement Fixes**
```
1. Prioritize high-priority issues first
2. Make recommended changes
3. Re-scan to verify improvements
4. Iterate until score reaches 85+
```

**Step 7: Track Score History** (Expected feature)
```
1. View score improvement over time
2. Compare versions
3. See which changes had biggest impact
4. Monitor before/after tailoring
```

#### ATS Pass/Fail Criteria

**Automatic Failures (Score <60):**
- Non-standard file format (not PDF/DOCX)
- Heavy use of graphics/images
- Complex tables or columns
- Header/footer with critical information
- Non-standard fonts throughout
- Missing contact information
- No clear section headers

**Strong Pass (Score 85+):**
- Standard PDF or DOCX format
- Single-column layout
- Standard fonts (Arial, Calibri, Times New Roman)
- Clear section headers
- Reverse chronological order
- Quantified achievements
- Relevant keywords present
- Complete contact information
- Professional email
- Consistent formatting
- Appropriate length (1-2 pages)

#### Category Scoring Details

**Formatting (20 points):**
- File format: 5 points
- Font compatibility: 5 points
- No graphics/tables: 5 points
- Consistent spacing: 5 points

**Structure (20 points):**
- Standard headers: 5 points
- Logical order: 5 points
- Contact info placement: 5 points
- Chronological order: 5 points

**Content (20 points):**
- Complete contact info: 5 points
- Quantified achievements: 5 points
- Dates present: 5 points
- Professional presentation: 5 points

**Keywords (20 points):**
- Job-relevant keywords: 10 points
- Industry terminology: 5 points
- Skills present: 5 points

**Overall (20 points):**
- Appropriate length: 5 points
- Readability: 5 points
- Keyword density: 5 points
- Professional tone: 5 points

#### Common ATS Failures

**1. Complex Formatting**
```
Problem: Tables, columns, text boxes
Why it fails: ATS can't parse complex layouts
Fix: Convert to simple single-column format
```

**2. Non-Standard Headers**
```
Problem: "My Professional Journey" instead of "Work Experience"
Why it fails: ATS looks for specific header keywords
Fix: Use standard headers (Work Experience, Education, Skills)
```

**3. Graphics and Images**
```
Problem: Logo, photo, charts, icons
Why it fails: ATS can't read image content
Fix: Remove all graphics, use text only
```

**4. Header/Footer Information**
```
Problem: Name/contact in header/footer
Why it fails: Many ATS ignore headers/footers
Fix: Move all information to document body
```

**5. Unusual Fonts**
```
Problem: Decorative or script fonts
Why it fails: ATS may not recognize characters
Fix: Use Arial, Calibri, Times New Roman, or Helvetica
```

**6. Missing Keywords**
```
Problem: Generic descriptions without job-specific terms
Why it fails: ATS ranks by keyword matches
Fix: Include keywords from job description naturally
```

#### Tips
- Target ATS score of 85+ (90+ ideal)
- Scan BEFORE applying to jobs
- Use simple, clean formatting
- Stick to standard section headers
- Single-column layout only
- Standard fonts only (Arial, Calibri, Times New Roman)
- No graphics, photos, or charts
- Include relevant keywords naturally
- Quantify all achievements
- Proofread for accuracy
- Test with multiple ATS scanners if possible
- Save as .docx for maximum compatibility (PDF second choice)

---

### 9. Export Engine
**Page:** http://localhost:3101/test-export.html (also integrated in index.html)
**Purpose:** Export your resume in multiple professional formats

#### Key Features
- **5 Export Formats:** PDF, DOCX, TXT, JSON, HTML
- **High-Quality PDF:** Print-ready output
- **Editable DOCX:** Microsoft Word compatible
- **Template Preservation:** Maintains styling across formats
- **Page Break Optimization:** Intelligent formatting
- **Batch Export:** Multiple formats simultaneously

#### How to Use

**Step 1: Access Export Engine**
```
Option A: From index.html
1. Build or load your resume in main interface
2. Click "Export" button in preview toolbar
3. Export modal opens

Option B: From test-export.html
1. Navigate to http://localhost:3101/test-export.html
2. Dedicated export testing interface
3. Load resume to export
```

**Step 2: Choose Export Format**
```
Select from 5 formats:

1. PDF (Recommended for applications)
   - High-quality print output
   - Preserves all formatting
   - Universal compatibility
   - Read-only (prevents editing)
   - Best for final submissions

2. DOCX (Microsoft Word)
   - Fully editable format
   - Compatible with Word 2007+
   - Maintains structure
   - Allows recruiter edits
   - Good for ATS systems

3. TXT (Plain Text)
   - No formatting
   - Maximum compatibility
   - Smallest file size
   - Copy-paste friendly
   - Good for email bodies

4. JSON (Data Format)
   - Structured data
   - Developer-friendly
   - Import/export between systems
   - Backup and versioning
   - API integration

5. HTML (Web Format)
   - Web-friendly
   - Styled with CSS
   - Viewable in browsers
   - Easy sharing via link
   - Good for online portfolios
```

**Step 3: Configure Export Options**
```
For PDF:
- Quality: Standard (96 DPI) or High (300 DPI)
- Page size: A4 or US Letter
- Template: Applied template preserved
- Margins: Customizable

For DOCX:
- Template: Converted to Word styles
- Formatting: Maintained where possible
- Editability: Full text editing enabled

For TXT:
- Encoding: UTF-8
- Line breaks: Preserved
- Formatting: Stripped

For JSON:
- Format: Pretty-printed or minified
- Schema: Resume JSON Resume format

For HTML:
- Styling: Inline CSS or external stylesheet
- Template: Full template preserved
```

**Step 4: Export Resume**
```
1. Click format button (e.g., "Export as PDF")
2. Processing begins (5-10 seconds for PDF)
3. File downloads automatically
4. Default filename: "Resume_[YourName]_[Date].[ext]"
```

**Step 5: Verify Export**
```
1. Open exported file
2. Verify all content present
3. Check formatting preserved
4. Test page breaks (PDF)
5. Verify editability (DOCX)
6. Ensure completeness
```

**Step 6: Batch Export** (If Available)
```
1. Select multiple formats
2. Click "Export All"
3. All formats generate sequentially
4. Creates folder with all versions
5. Organized by format
```

#### Export Format Recommendations

**For Job Applications:**
- **Primary:** PDF (high quality, 300 DPI)
- **Backup:** DOCX (for ATS compatibility)
- **Page Size:** Match job posting (US Letter for US, A4 for international)

**For Recruiter Submissions:**
- **Primary:** DOCX (allows recruiter edits)
- **Alternative:** PDF (if recruiter specifies)

**For Email Applications:**
- **Attachment:** PDF (most professional)
- **Body:** TXT (if pasting into email)

**For Online Applications:**
- **Upload:** PDF or DOCX (check system requirements)
- **Paste:** TXT (for text-box submissions)

**For Portfolio/Website:**
- **Display:** HTML (embed on website)
- **Download:** PDF (visitor download option)

**For Backups:**
- **Format:** JSON (preserves all data and structure)
- **Storage:** Cloud storage with version control

#### Quality Settings

**PDF Quality Levels:**
```
Standard (96 DPI):
- File size: 200-500 KB
- Quality: Good for screen viewing
- Use case: Online applications, email attachments

High (300 DPI):
- File size: 500 KB - 2 MB
- Quality: Print-ready, professional
- Use case: Print submissions, portfolio
```

**DOCX Compatibility:**
```
Word 2007+: Full compatibility
Google Docs: 95% compatible (minor formatting differences)
LibreOffice: 90% compatible
Pages (Mac): 85% compatible
```

#### Page Break Handling

**Intelligent Page Breaks:**
- Avoids breaking sections mid-content
- Keeps job entries on same page when possible
- Maintains readability
- Optimizes white space
- Prevents orphaned headers

**Manual Adjustments:**
- Use spacing presets to fit content
- Compact spacing for 1-page resumes
- Spacious for 2-page layouts
- Test print preview before final export

#### Common Export Issues

**Issue 1: PDF Missing Content**
```
Problem: Content cut off or missing
Cause: Template rendering issue
Fix: Try different template or adjust margins
```

**Issue 2: DOCX Formatting Lost**
```
Problem: Formatting doesn't match preview
Cause: Word template conversion limitations
Fix: Open in Word and adjust styles manually
```

**Issue 3: Large File Size**
```
Problem: PDF over 5MB (too large for some systems)
Cause: High DPI or embedded content
Fix: Use Standard quality (96 DPI) instead of High
```

**Issue 4: ATS Can't Parse**
```
Problem: ATS rejects resume
Cause: Complex formatting in export
Fix: Use DOCX format or simplify template
```

#### Tips
- Export in multiple formats for flexibility
- Keep file sizes under 5MB
- Name files professionally: FirstName_LastName_Resume.pdf
- Test exports on different devices
- Verify formatting before submitting
- Use PDF for final submissions (most professional)
- Keep DOCX backup for recruiter submissions
- Save JSON for version control and backups
- Export fresh version for each application (with tailoring)
- Avoid special characters in filenames

---

## Wave 3: Premium Features

### 10. Cover Letter Writer
**Page:** http://localhost:3101/test-coverletter.html
**Purpose:** Generate professional, tailored cover letters using AI

#### Key Features
- **4 Generation Modes:** From scratch, resume-based, job-based, hybrid
- **12 Customization Options:** Tone, length, focus, emphasis
- **AI-Powered:** Claude Sonnet 4 generates high-quality content
- **Template Integration:** 8 cover letter templates
- **Tone Variations:** Professional, enthusiastic, formal, conversational
- **Length Options:** Short (200-250 words), standard (300-400 words), long (450-500 words)

#### How to Use

**Step 1: Access Cover Letter Writer**
```
1. Navigate to http://localhost:3101/test-coverletter.html
2. Cover letter generation interface loads
3. Input areas for resume and job description
```

**Step 2: Choose Generation Mode**
```
Mode 1: From Scratch
- No resume or job description needed
- Provide: Name, target role, key skills
- Use case: Generic cover letter template
- Speed: Fastest (5-10 seconds)

Mode 2: Resume-Based
- Input: Your resume
- AI extracts: Experience, skills, achievements
- Use case: General cover letter highlighting your background
- Speed: Fast (10-15 seconds)

Mode 3: Job-Based
- Input: Job description
- AI analyzes: Requirements, responsibilities, company
- Use case: Tailored to job without resume
- Speed: Medium (15-20 seconds)

Mode 4: Hybrid (Recommended)
- Input: Both resume AND job description
- AI matches: Your experience to job requirements
- Use case: Fully tailored, personalized cover letter
- Speed: Slower (20-30 seconds)
- Quality: Highest
```

**Step 3: Configure Customization Options**
```
Option 1: Tone
- Professional (default): Business-appropriate, formal
- Enthusiastic: Shows passion and excitement
- Formal: Traditional, conservative industries
- Conversational: Friendly, approachable (startups)

Option 2: Length
- Short (200-250 words): Quick read, concise
- Standard (300-400 words): Most common, balanced
- Long (450-500 words): Detailed, comprehensive

Option 3: Opening Style
- Hook: Attention-grabbing opening
- Traditional: "I am writing to apply for..."
- Personal Connection: "As someone who..."
- Achievement-First: Lead with your biggest win

Option 4: Focus
- Experience: Emphasize work history
- Skills: Highlight technical abilities
- Achievements: Showcase results
- Passion: Express enthusiasm for role/company
- Cultural Fit: Align with company values

Option 5: Emphasis
- Technical Skills: For engineering, technical roles
- Leadership: For management positions
- Creativity: For design, marketing roles
- Analysis: For data, research positions

Option 6: Closing Style
- Call to Action: "I look forward to discussing..."
- Confident: "I am confident I can contribute..."
- Grateful: "Thank you for considering..."
- Eager: "I am excited about the opportunity..."

Options 7-12: Advanced Settings
- Company Name: Auto-included if in job description
- Hiring Manager Name: Personalize greeting
- Referral Mention: "Referred by [name]"
- Salary Requirements: Include if requested
- Start Date: Mention availability
- Unique Angle: Special connection to company
```

**Step 4: Generate Cover Letter**
```
1. Fill in required inputs (resume/job description based on mode)
2. Select customization options
3. Enter API key
4. Click "Generate Cover Letter"
5. Wait 20-30 seconds for AI generation
6. Review generated content
```

**Step 5: Review and Edit**
```
1. Read generated cover letter carefully
2. Check for accuracy:
   - Your name spelled correctly
   - Company name correct
   - Job title accurate
   - No hallucinated information
3. Edit for personalization:
   - Add specific examples
   - Mention company research
   - Include personal connection
   - Adjust tone to your voice
4. Verify length matches requirements
```

**Step 6: Apply Template**
```
1. Select from 8 templates (see next section)
2. Template applies styling
3. Professional formatting
4. Ready for export
```

**Step 7: Export Cover Letter**
```
1. Choose format: PDF, DOCX, HTML, TXT
2. Export with matching resume template
3. Save for application
```

#### Sample Output (Hybrid Mode, Professional Tone, Standard Length)

```
Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer
position at TechCorp. With over 8 years of experience building scalable web
applications and a proven track record of leading technical teams, I am
confident I can contribute immediately to your engineering organization.

In my current role at InnovateSoft, I led the development of a microservices
architecture serving 10 million users, reducing system latency by 45% through
optimization and caching strategies. This experience directly aligns with
your need for an engineer who can design high-performance systems at scale.
Additionally, I have mentored teams of 5+ engineers and conducted over 200
code reviews, demonstrating the leadership skills essential for this role.

I am particularly excited about TechCorp's mission to democratize access to
technology education. As someone who benefited from online learning resources
early in my career, I am passionate about building platforms that empower the
next generation of developers. Your recent launch of the interactive coding
platform resonates deeply with my values and technical interests.

My expertise in Python, JavaScript, React, Node.js, and AWS positions me well
to contribute to your full-stack development needs. I am eager to bring my
technical skills, leadership experience, and passion for education technology
to the TechCorp team.

I look forward to the opportunity to discuss how my background aligns with
your needs. Thank you for your consideration.

Sincerely,
[Your Name]
```

#### Customization Examples

**For Creative Roles:**
```
Tone: Enthusiastic + Conversational
Opening: Hook ("The moment I saw TechCorp's latest campaign...")
Focus: Creativity + Portfolio
Emphasis: Design thinking
```

**For Executive Positions:**
```
Tone: Formal + Professional
Opening: Achievement-first
Focus: Leadership + Results
Emphasis: Strategic vision
Length: Long (450-500 words)
```

**For Career Changers:**
```
Opening: Personal Connection
Focus: Transferable skills
Emphasis: Adaptability + Learning
Include: Explanation of transition
```

**For Recent Graduates:**
```
Tone: Enthusiastic + Professional
Opening: Hook (passion for field)
Focus: Skills + Education
Emphasis: Potential + Eagerness
Length: Short (200-250 words)
```

#### Tips
- Always use Hybrid mode for best results
- Research company before generating
- Edit AI output - don't use verbatim
- Verify all facts and claims
- Keep under 500 words (one page)
- Address hiring manager by name if possible
- Mention specific company details
- Explain why you + this company = great fit
- Include 2-3 key achievements
- End with clear call to action
- Proofread multiple times
- Match tone to company culture
- Save multiple versions for different jobs

---

### 11. Cover Letter Templates
**Page:** http://localhost:3101/test-templates.html
**Purpose:** Apply professional templates to your cover letters

#### Available Templates (8 Total)

**1. Traditional**
- **Best For:** Conservative industries (finance, law, healthcare)
- **Style:** Classic serif fonts, formal layout
- **Color Scheme:** Black and white, minimal accent color
- **Layout:** Standard business letter format
- **Use Case:** Traditional companies, older industries

**2. Modern**
- **Best For:** Tech companies, startups, contemporary businesses
- **Style:** Sans-serif fonts, clean lines
- **Color Scheme:** Modern color accent (blue/green)
- **Layout:** Contemporary spacing, bold headers
- **Use Case:** Innovation-focused companies

**3. Career-Changer**
- **Best For:** Transitioning between careers
- **Style:** Emphasis on transferable skills section
- **Color Scheme:** Professional blue
- **Layout:** Highlights transferable skills, education
- **Use Case:** Career pivots, returning to workforce

**4. Entry-Level**
- **Best For:** Recent graduates, first professional job
- **Style:** Emphasis on education, potential
- **Color Scheme:** Fresh, optimistic colors
- **Layout:** Education-first, skills prominent
- **Use Case:** New graduates, internships

**5. Executive**
- **Best For:** C-suite, senior leadership roles
- **Style:** Sophisticated, authoritative
- **Color Scheme:** Navy, charcoal, gold accents
- **Layout:** Achievement-focused, strategic emphasis
- **Use Case:** VP, Director, C-level positions

**6. Creative**
- **Best For:** Design, marketing, creative agencies
- **Style:** Unique typography, visual elements
- **Color Scheme:** Bold, brand-conscious colors
- **Layout:** Stands out, shows personality
- **Use Case:** Creative roles where design matters

**7. Technical**
- **Best For:** Engineering, development, technical roles
- **Style:** Clean, readable, monospace accents
- **Color Scheme:** Tech-friendly blues and grays
- **Layout:** Skills-first, project highlights
- **Use Case:** Software engineers, data scientists

**8. Referral**
- **Best For:** When referred by employee or connection
- **Style:** Emphasizes referral connection
- **Color Scheme:** Professional, trustworthy
- **Layout:** Referral mentioned prominently in opening
- **Use Case:** Employee referrals, networking hires

#### How to Use Templates

**Step 1: Access Template System**
```
1. Navigate to http://localhost:3101/test-templates.html
2. Cover letter template gallery loads
3. 8 templates displayed with previews
```

**Step 2: Preview Templates**
```
1. Browse template thumbnails
2. Click to view full preview
3. See sample content in each style
4. Compare layouts and designs
```

**Step 3: Select Template**
```
1. Choose template matching your target industry
2. Click "Use Template" button
3. Template applies to your cover letter
4. Content fills into template structure
```

**Step 4: Verify Variable Substitution**
```
Templates support variables:
- {{name}} → Your full name
- {{company}} → Target company name
- {{position}} → Job title
- {{date}} → Current date
- {{hiring_manager}} → Hiring manager name
- {{referrer}} → Referral source (if applicable)

Variables automatically replaced when:
1. Cover letter generated
2. Template applied
3. Export initiated
```

**Step 5: Customize Template**
```
1. Adjust colors if needed
2. Modify spacing
3. Change fonts (within template guidelines)
4. Maintain professional appearance
```

**Step 6: Export**
```
1. Export as PDF (recommended)
2. Export as DOCX (for editing)
3. Template formatting preserved
4. Professional output guaranteed
```

#### Template Matching Guide

**Your Industry → Recommended Template**
- Banking/Finance → Traditional
- Technology/Startups → Modern
- Career Transition → Career-Changer
- Recent Graduate → Entry-Level
- Senior Leadership → Executive
- Design/Marketing → Creative
- Engineering/Tech → Technical
- Employee Referral → Referral

**Company Culture → Template Style**
- Conservative → Traditional, Executive
- Innovative → Modern, Creative
- Fast-paced → Modern, Technical
- Established → Traditional, Professional
- Creative → Creative, Modern

#### Tips
- Match template to company culture
- Traditional is safest for unknown cultures
- Creative templates only for creative roles
- Executive template for senior positions
- Career-changer template explains transitions
- Entry-level template emphasizes potential
- Technical template showcases skills
- Referral template highlights connection
- Test print preview before submitting
- Ensure variables populated correctly

---

### 12. Version Management
**Page:** http://localhost:3101/versions.html
**Purpose:** Manage multiple resume versions for different applications

#### Key Features
- **Version Creation:** Save named versions
- **Base vs. Tailored:** Track master and customized versions
- **Diff Viewer:** Compare versions side-by-side
- **Selective Merge:** Choose changes to merge back to base
- **Conflict Resolution:** Handle overlapping edits
- **Version Linking:** Track relationships between versions
- **History Tracking:** See version evolution over time

#### How to Use

**Step 1: Access Version Management**
```
1. Navigate to http://localhost:3101/versions.html
2. Version management interface loads
3. List of all saved versions displays
```

**Step 2: Create Base Version**
```
1. Start with your master resume
2. Click "Save as New Version"
3. Name: "Base Resume - [Date]" or "Master Resume"
4. Description: "General resume for all applications"
5. Tag as "Base Version"
6. This is your starting point for all tailoring
```

**Step 3: Create Tailored Versions**
```
For each job application:
1. Load base version
2. Tailor resume for specific job (use Job Tailoring Engine)
3. Save as new version:
   - Name: "[Company] - [Position] - [Date]"
   - Example: "Google - Senior Engineer - 2025-12-01"
4. Description: Include job ID, key requirements
5. Tag: "Tailored"
6. Link to base version
```

**Step 4: View Version List**
```
Version list shows:
- Version name
- Creation date
- Last modified date
- Type (Base/Tailored)
- Linked to (parent version)
- Tags
- Actions (View, Edit, Compare, Delete)
```

**Step 5: Compare Versions**
```
1. Select two versions to compare
2. Click "Compare Versions"
3. Diff viewer shows:
   - Side-by-side comparison
   - Changes highlighted:
     - Green: Additions in version 2
     - Red: Removals from version 1
     - Yellow: Modifications
   - Section-by-section breakdown
4. Understand what changed between versions
```

**Step 6: Selective Merge**
```
Use case: Tailored version has improvements you want in base

1. Compare tailored version to base
2. Review changes
3. Select changes to merge:
   - [ ] Updated professional summary
   - [✓] New skill: "Kubernetes"
   - [✓] Quantified achievement in Job 2
   - [ ] Job-specific keyword
4. Click "Merge Selected"
5. Changes apply to base version
6. Base version improves over time
```

**Step 7: Conflict Resolution**
```
If conflicts occur (same section edited in both versions):
1. Conflict notification appears
2. View both versions side-by-side
3. Choose resolution:
   - Keep base version
   - Keep tailored version
   - Manual merge (edit to combine)
4. Resolve all conflicts
5. Complete merge
```

**Step 8: Track Version Evolution**
```
1. Click on version name
2. View version details:
   - Creation date
   - Parent version
   - All child versions (versions created from this one)
   - Change history
   - Applied jobs
3. See family tree of versions
```

#### Version Naming Best Practices

**Base Versions:**
```
Format: "Base Resume - [Industry/Focus] - [Date]"
Examples:
- "Base Resume - Software Engineering - 2025-12"
- "Base Resume - Product Management - 2025-12"
- "Master Resume - Full Stack Developer"
```

**Tailored Versions:**
```
Format: "[Company] - [Position] - [Date Applied]"
Examples:
- "Google - Senior SWE - 2025-12-01"
- "Meta - Engineering Manager - 2025-12-05"
- "Startup Inc - Tech Lead - 2025-12-10"
```

**Experimental Versions:**
```
Format: "Experiment - [Change] - [Date]"
Examples:
- "Experiment - Two Column Layout - 2025-12-01"
- "Experiment - Skills-First Resume - 2025-12-02"
- "Test - Creative Template - 2025-12-03"
```

#### Version Management Workflows

**Workflow 1: Serial Applications (Same Industry)**
```
1. Create base version
2. Tailor for Job A → Save as "Company A - Position - Date"
3. Apply to Job A
4. If successful changes, merge back to base
5. Load updated base for Job B
6. Tailor for Job B → Save as "Company B - Position - Date"
7. Repeat
```

**Workflow 2: Parallel Applications (Multiple Industries)**
```
1. Create base versions for each industry:
   - "Base Resume - Tech - 2025-12"
   - "Base Resume - Finance - 2025-12"
   - "Base Resume - Consulting - 2025-12"
2. Tailor each base for specific roles
3. Track which base performs best
4. Focus efforts on successful verticals
```

**Workflow 3: Continuous Improvement**
```
1. Create base version
2. Tailor for multiple jobs
3. Track application results:
   - Version X → 60% response rate
   - Version Y → 40% response rate
4. Analyze what made Version X better
5. Merge successful elements into base
6. Iterate and improve
```

**Workflow 4: A/B Testing**
```
1. Create two versions with different approaches:
   - Version A: Skills-first layout
   - Version B: Experience-first layout
2. Apply to similar jobs
3. Track response rates
4. Identify winner
5. Make winner the new base
```

#### Common Scenarios

**Scenario 1: Want to Update Base with Tailored Improvement**
```
1. Compare tailored version to base
2. Identify universal improvements (not job-specific)
3. Select improvements for merge
4. Merge selected changes
5. Base version now includes improvements
```

**Scenario 2: Applied to 10 Jobs, Need to Track Versions**
```
1. Create base version
2. For each application:
   - Load base
   - Tailor for job
   - Save with company name and date
   - Link to base
3. Version list shows all 10 tailored versions
4. Easy to recall which version sent where
```

**Scenario 3: Job Interview - Need Exact Version Sent**
```
1. Got interview for "Google - Senior SWE - 2025-12-01"
2. Load that version from version management
3. Review exact version sent
4. Prepare for interview based on that version
5. Maintain consistency
```

**Scenario 4: Experiment with Radical Changes**
```
1. Create experimental version (don't link to base)
2. Make dramatic changes
3. Apply to test jobs
4. If successful: Promote to new base
5. If unsuccessful: Delete or learn from
```

#### Tips
- Always maintain a clean base version
- Name versions consistently
- Link tailored versions to base
- Merge successful improvements back to base
- Delete old experimental versions
- Track application outcomes per version
- Export versions before major changes (backup)
- Use tags to organize (e.g., "Applied", "Draft", "Experiment")
- Review base quarterly and update
- Keep version history for reference

---

### 13. LinkedIn Integration
**Page:** http://localhost:3101/linkedin-integration.html
**Purpose:** Optimize your LinkedIn profile using your resume

#### Key Features
- **Profile Import:** Convert resume to LinkedIn format
- **Headline Generation:** AI-powered compelling headlines
- **Profile Optimization:** Improve profile sections
- **Completeness Scoring:** 0-100 profile strength score
- **Keyword Alignment:** Match resume keywords to profile
- **Export to LinkedIn:** Copy-ready content

#### How to Use

**Step 1: Access LinkedIn Integration**
```
1. Navigate to http://localhost:3101/linkedin-integration.html
2. LinkedIn optimization interface loads
3. Upload resume or import LinkedIn profile
```

**Step 2: Import Resume**
```
1. Click "Import from Resume"
2. Select your resume (PDF, DOCX, TXT)
3. AI parses resume content
4. Extracts:
   - Work experience → LinkedIn Experience section
   - Education → LinkedIn Education section
   - Skills → LinkedIn Skills section
   - Summary → LinkedIn About section
5. Converts resume format to LinkedIn format
```

**Step 3: Generate Headline**
```
Your LinkedIn headline is critical (120 characters).

Input Options:
- Current role
- Target role
- Key skills (3-5)
- Unique value proposition

AI generates options:
1. "Senior Software Engineer | Python, AWS, React | Building scalable solutions"
2. "Tech Lead @ TechCorp | Full-Stack Developer | Open Source Contributor"
3. "Software Engineer → Tech Lead | Specializing in Cloud Architecture | 8+ Years"

Choose headline that:
- Includes keywords recruiters search
- Shows current or target role
- Highlights top skills
- Adds unique differentiator
- Fits 120 character limit
```

**Step 4: Optimize About Section**
```
AI improves your LinkedIn About:

Before (Resume Summary):
"Experienced software engineer with 8 years of full-stack development expertise."

After (LinkedIn About):
"I'm a software engineer passionate about building products that matter.

Over the past 8 years, I've:
• Led development of platforms serving 10M+ users
• Reduced system latency by 45% through innovative optimization
• Mentored 15+ engineers to achieve their career goals

I specialize in Python, JavaScript, and cloud architecture. Currently,
I'm focused on building scalable microservices at TechCorp.

Outside of work, I contribute to open source and write about engineering
best practices on my blog.

Let's connect if you're interested in tech leadership, distributed systems,
or just want to talk code!"

Changes:
- First person (LinkedIn style vs resume third person)
- Storytelling approach
- Bullet points for readability
- Personal touch
- Call to action
- Keywords naturally integrated
```

**Step 5: Check Profile Completeness Score**
```
LinkedIn Profile Strength Score (0-100):

Scoring Breakdown:
- Profile Photo: 10 points (Have professional photo?)
- Headline: 10 points (Optimized headline?)
- About Section: 15 points (Compelling summary?)
- Experience: 25 points (All roles added with details?)
- Education: 10 points (Degrees listed?)
- Skills: 15 points (At least 10 skills?)
- Recommendations: 10 points (At least 3 recommendations?)
- Accomplishments: 5 points (Certifications, projects, publications?)

Target Score: 85+ (All-Star profile)

AI shows current score and specific improvements needed.
```

**Step 6: Align Keywords**
```
1. AI compares resume keywords to LinkedIn profile
2. Identifies keywords present in resume but missing from LinkedIn:
   - "Kubernetes" (in resume, not in LinkedIn)
   - "Microservices" (in resume, not in LinkedIn)
   - "Team Leadership" (in resume, not in LinkedIn)
3. Recommends where to add each keyword:
   - "Kubernetes" → Add to Skills + mention in Experience
   - "Microservices" → Add to Headline + About section
   - "Team Leadership" → Add to Summary + Experience bullets
4. Ensures consistency between resume and LinkedIn
```

**Step 7: Optimize Each Experience Entry**
```
For each job in LinkedIn Experience section:

Resume Format:
• Led development of microservices platform
• Reduced latency by 45%
• Mentored 5 engineers

LinkedIn Format (More Detailed):
As Senior Software Engineer at TechCorp, I led the architecture and
development of a microservices platform serving 10 million daily active users.

Key achievements:
• Reduced API latency by 45% (800ms → 440ms) through caching optimization
  and database indexing, improving user experience for millions
• Architected and implemented 12 microservices using Python, Docker,
  and Kubernetes, enabling faster feature deployment
• Mentored team of 5 engineers, with 3 receiving promotions under my guidance
• Presented technical designs to VP of Engineering and stakeholders

Technologies: Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes,
PostgreSQL, Redis

Changes:
- More detailed and conversational
- Context provided (company size, impact)
- Quantified results with context
- Technologies listed (for keyword search)
- Shows leadership impact
```

**Step 8: Export to LinkedIn**
```
1. Review all optimized content
2. Click "Export for LinkedIn"
3. Copy-ready sections generated:
   - Headline (copy to LinkedIn headline)
   - About (copy to LinkedIn about section)
   - Each experience entry (copy to corresponding role)
   - Skills list (add to LinkedIn skills)
4. Open LinkedIn in new tab
5. Paste content into corresponding sections
6. Publish changes
```

#### LinkedIn vs Resume Differences

| Aspect | Resume | LinkedIn |
|--------|--------|----------|
| **Tone** | Third person, formal | First person, conversational |
| **Length** | 1-2 pages | Unlimited (but concise) |
| **Details** | Concise bullets | Detailed explanations |
| **Keywords** | Optimized for ATS | Optimized for recruiter search |
| **Updates** | Only when job searching | Ongoing updates |
| **Personality** | Professional, objective | Personality, passion, voice |
| **Audience** | Hiring manager for specific job | Broad network, recruiters |

#### LinkedIn SEO (Search Engine Optimization)

**Recruiter Search Keywords:**
```
Primary Keywords (Must Include):
- Your job title (exact match)
- Industry (e.g., "Technology", "Finance")
- Top 3-5 skills
- Location (city, state)

Secondary Keywords:
- Tools and technologies
- Certifications
- Industry buzzwords
- Company types (startup, enterprise, etc.)
```

**Keyword Placement Priority:**
```
1. Headline (120 chars) - Most important
2. About section (first 2 sentences) - Visible without "See More"
3. Current job title and description
4. Skills section (top 10 skills)
5. All experience descriptions
```

#### Tips
- Update LinkedIn profile every 3-6 months
- Use same keywords as resume for consistency
- Headline should include role + skills + differentiator
- About section: Tell your story, show personality
- Add media to experience (links, presentations, projects)
- Get recommendations from colleagues and managers
- Endorse others' skills (they often reciprocate)
- Share industry content to show engagement
- Profile photo is critical (professional headshot)
- Custom LinkedIn URL (linkedin.com/in/yourname)
- Keep experience descriptions detailed (not resume bullets)
- Use first person ("I led..." not "Led...")
- Show impact and results with numbers
- Update headline when job searching to "Open to opportunities"

---

### 14. Application Tracker
**Page:** http://localhost:3101/test-tracker.html
**Purpose:** Track job applications with Kanban board and analytics

#### Key Features
- **Kanban Board:** Visual status tracking with 9 columns
- **Drag-and-Drop:** Update status by dragging cards
- **Analytics Dashboard:** Conversion rates, response times, success metrics
- **CSV/JSON/iCal Export:** Export application data
- **Resume Version Tracking:** Link applications to specific resume versions
- **Notes and Follow-ups:** Track communications and action items
- **Timeline View:** See application history

#### How to Use

**Step 1: Access Application Tracker**
```
1. Navigate to http://localhost:3101/test-tracker.html
2. Kanban board interface loads
3. 9 columns visible (see column descriptions below)
```

**Step 2: Add New Application**
```
1. Click "+ New Application" button
2. Fill in application details:
   - Company name *required*
   - Position title *required*
   - Job URL (job posting link)
   - Date applied *required*
   - Resume version used (links to Version Management)
   - Cover letter version
   - Recruiter/contact name
   - Priority (High/Medium/Low)
   - Salary range
   - Location
   - Notes
3. Click "Add Application"
4. Card appears in "Applied" column
```

**Step 3: Track Application Status**
```
The 9 Kanban Columns:

1. Wishlist
   - Jobs you're interested in but haven't applied yet
   - Research phase
   - Color: Light Gray

2. Applied
   - Submitted applications
   - Waiting for response
   - Color: Blue

3. Phone Screen
   - Initial recruiter call scheduled/completed
   - 15-30 minute conversation
   - Color: Yellow

4. Technical Assessment
   - Coding challenge, take-home project
   - Technical screening
   - Color: Orange

5. Onsite Interview
   - In-person or virtual interview
   - Multiple rounds
   - Color: Purple

6. Final Round
   - Last interview stage
   - Often with hiring manager or leadership
   - Color: Dark Purple

7. Offer
   - Received job offer
   - Negotiation phase
   - Color: Green

8. Accepted
   - Accepted offer
   - Starting soon or already started
   - Color: Dark Green

9. Rejected
   - Not moving forward
   - Rejected at any stage
   - Color: Red
```

**Step 4: Move Applications Through Pipeline**
```
Drag and Drop:
1. Click and hold on application card
2. Drag to appropriate column based on status update
3. Drop in new column
4. Status automatically updates
5. Timestamp recorded
6. Analytics update in real-time
```

**Step 5: Add Notes and Follow-ups**
```
Click on any application card to open details:

Notes Section:
- Add interview notes
- Record key discussion points
- Track interviewers' names
- Note technical questions asked
- Save follow-up action items

Follow-ups:
- Set reminders for follow-up emails
- Track thank-you notes sent
- Schedule check-ins
- Calendar integration (iCal export)
```

**Step 6: View Analytics Dashboard**
```
Click "Analytics" tab to see:

Overall Metrics:
- Total applications: 47
- Response rate: 34% (16 responses / 47 applied)
- Interview rate: 21% (10 interviews / 47 applied)
- Offer rate: 6% (3 offers / 47 applied)
- Average time to response: 8 days
- Average time to offer: 42 days

Conversion Funnel:
Applied (47) →
  Phone Screen (16, 34%) →
    Technical (10, 21%) →
      Onsite (5, 11%) →
        Final Round (3, 6%) →
          Offer (3, 6%) →
            Accepted (1, 2%)

Response Time Analysis:
- Fastest response: 1 day (Google)
- Slowest response: 42 days (SlowCorp)
- Average: 8 days
- Median: 5 days

Success by Company Size:
- Startups (<50): 8% offer rate
- Mid-size (50-500): 12% offer rate
- Large (500+): 4% offer rate

Success by Application Method:
- Direct apply: 6% offer rate
- Referral: 18% offer rate
- Recruiter outreach: 25% offer rate
```

**Step 7: Identify Patterns**
```
Analytics reveal patterns:

High Success Indicators:
- Referrals: 3x higher offer rate
- Recruiter outreach: 4x higher
- Mid-size companies: 2x higher
- Applied within 3 days of posting: 2x higher

Low Success Indicators:
- "Easy Apply" buttons: 1/3 offer rate
- Applied after 2 weeks: 1/4 offer rate
- No follow-up: 1/5 offer rate
- Generic resume: 1/3 offer rate

Actionable Insights:
1. Focus on getting referrals
2. Target mid-size companies
3. Apply quickly (within 3 days)
4. Always send follow-up thank you
5. Tailor every resume
```

**Step 8: Export Application Data**
```
Export Options:

1. CSV Export
   - All applications in spreadsheet format
   - Columns: Company, Position, Date, Status, Notes, etc.
   - Open in Excel/Google Sheets
   - Use for: Custom analysis, charts, reporting

2. JSON Export
   - Structured data format
   - All fields included
   - Use for: Backup, import to other tools, programming analysis

3. iCal Export
   - Calendar events for all interviews and follow-ups
   - Import to Google Calendar, Apple Calendar, Outlook
   - Never miss an interview or follow-up
   - Use for: Calendar blocking, reminders
```

**Step 9: Link to Resume Versions**
```
For each application:
1. Open application details
2. Click "Resume Version" dropdown
3. Select version used from Version Management
4. Link established
5. Benefits:
   - Track which resume versions perform best
   - Know exact version sent for interview prep
   - Analyze tailoring effectiveness
   - Recall version if asked in interview
```

#### Kanban Best Practices

**Daily Routine:**
```
Morning (10 minutes):
1. Check for new responses (emails, LinkedIn)
2. Move cards to appropriate columns
3. Add notes for any updates
4. Set follow-up reminders

Evening (15 minutes):
1. Apply to 2-3 new positions
2. Add to "Applied" column
3. Send follow-up emails for interviews
4. Review tomorrow's interviews
```

**Weekly Review (30 minutes):**
```
Sunday evening:
1. Review analytics
2. Identify what's working
3. Adjust strategy
4. Clean up rejected applications (archive)
5. Update wishlist with new positions
6. Plan next week's applications (goal: 10-15)
```

**Monthly Analysis (1 hour):**
```
End of month:
1. Export data to CSV
2. Create charts and graphs
3. Calculate conversion rates
4. Identify trends
5. Adjust job search strategy
6. Update resume based on feedback
7. Set goals for next month
```

#### Common Workflows

**Workflow 1: Morning Check**
```
1. Open tracker
2. Check email for responses
3. Move 3 applications from "Applied" to "Phone Screen"
4. Add notes: "Recruiter Jane Smith - call on Friday 2pm"
5. Set calendar reminder
6. Check analytics - response rate up to 35%!
```

**Workflow 2: After Interview**
```
1. Move card from "Phone Screen" to "Technical Assessment"
2. Open card details
3. Add notes:
   - Interviewer: John Doe (Engineering Manager)
   - Questions asked: [list]
   - Discussed: React, Node.js, system design
   - Next step: Take-home coding challenge, due Friday
   - Good signs: Mentioned timeline for next round
4. Set reminder: Complete challenge by Thursday
5. Set reminder: Send thank you email today
```

**Workflow 3: Got Offer**
```
1. Move card to "Offer" column
2. Add offer details:
   - Base salary: $150,000
   - Equity: 0.05% (50K shares)
   - Bonus: 15% target
   - Benefits: Medical, dental, 401k match
   - Start date: January 15, 2026
3. Set reminder: Negotiate by Friday
4. Compare with other offers in "Offer" column
5. Make decision
6. Move to "Accepted" or archive
```

#### Tips
- Update tracker daily (don't let it get stale)
- Add notes immediately after interviews (details fade quickly)
- Set follow-up reminders (thank yous are critical)
- Link resume versions for tracking
- Review analytics weekly to optimize strategy
- Archive old applications monthly
- Target conversion rates:
  - Response rate: 30-40% (good)
  - Interview rate: 15-25% (good)
  - Offer rate: 5-10% (good)
- Focus efforts on high-conversion channels (referrals)
- Don't give up - job search is a numbers game
- Celebrate small wins (moved to interview stage)
- Export data for backup weekly

---

## Tips & Tricks

### General Tips
1. **Start with Resume Builder:** Build a clean, ATS-friendly resume from scratch
2. **Use Templates Wisely:** Classic template has highest ATS scores
3. **Tailor Every Time:** Use Job Tailoring Engine for each application
4. **Proofread Religiously:** Run Proofreading Suite before every submission
5. **Check ATS Score:** Target 85+ before applying
6. **Export Multiple Formats:** Keep PDF and DOCX versions
7. **Track Everything:** Use Application Tracker to improve strategy
8. **Manage Versions:** Keep tailored versions organized

### Performance Optimization
- **Preview Speed:** Target <500ms render time
- **Auto-Save:** Runs every 30 seconds in builder
- **File Size:** Keep PDFs under 5MB
- **Load Time:** All pages load in <2 seconds

### AI Usage Best Practices
- **Be Specific:** More context = better AI output
- **Always Edit:** Don't use AI content verbatim
- **Verify Facts:** Check all quantifications are accurate
- **Iterate:** Run AI generation multiple times for best results
- **Combine Methods:** Use multiple AI features together

### ATS Optimization
- **Simple Formatting:** Single column, standard fonts
- **Standard Headers:** Use "Work Experience" not "Professional Journey"
- **No Graphics:** Text only, no images or charts
- **Keywords:** Include relevant keywords naturally
- **File Format:** DOCX for maximum compatibility

### Time-Saving Shortcuts
- **Keyboard Shortcuts:**
  - Cmd/Ctrl + Z: Undo
  - Cmd/Ctrl + Shift + Z: Redo
- **Load Samples:** Use sample resumes to test features quickly
- **Batch Operations:** Export multiple formats simultaneously
- **Templates:** Use templates as starting points

---

## Common Workflows

### Workflow 1: Build Resume from Scratch
```
1. Open builder.html
2. Add Header section (name, contact)
3. Add Professional Summary
4. Add Work Experience (2-3 jobs)
5. Add Education
6. Add Skills
7. Use drag-drop to optimize order
8. Save as "Base Resume - [Date]"
9. Export as PDF and DOCX
```

Time: 30-45 minutes

### Workflow 2: Apply to Specific Job
```
1. Load base resume from Version Management
2. Copy job description
3. Run Job Tailoring Engine
   - Paste resume
   - Paste job description
   - Enter API key
   - Click "Tailor Resume"
4. Review match score and suggestions
5. Apply recommended changes
6. Run Proofreading Suite
7. Run ATS Scanner (target: 85+)
8. Save as "[Company] - [Position] - [Date]"
9. Export as PDF
10. Add to Application Tracker
11. Submit application
12. Send to "Applied" column in tracker
```

Time: 20-30 minutes per application

### Workflow 3: Prepare for Interview
```
1. Open Application Tracker
2. Find application card
3. Load exact resume version sent
4. Review tailored content
5. Review notes from previous interview rounds
6. Prepare questions based on job description
7. Review company research
8. Set calendar reminder for interview
9. Send thank you email template to drafts
```

Time: 30-60 minutes

### Workflow 4: Optimize LinkedIn Profile
```
1. Open linkedin-integration.html
2. Import resume
3. Generate headline (choose best option)
4. Optimize About section
5. Check completeness score (target: 85+)
6. Align keywords with resume
7. Export for LinkedIn
8. Open LinkedIn, paste content
9. Add media (presentations, projects)
10. Publish changes
```

Time: 45-60 minutes

### Workflow 5: Monthly Job Search Review
```
1. Open Application Tracker
2. Review analytics:
   - Response rate
   - Interview rate
   - Offer rate
   - Time to response
3. Identify patterns (what's working)
4. Export data to CSV
5. Create charts in Excel/Sheets
6. Adjust strategy based on data
7. Update base resume with improvements
8. Set goals for next month
9. Clean up tracker (archive old applications)
```

Time: 1 hour monthly

---

## Troubleshooting

### Issue: Page Not Loading
**Solution:**
1. Check server is running: http://localhost:3101
2. Clear browser cache
3. Try different browser
4. Check browser console for errors
5. Verify file paths are correct

### Issue: API Key Not Working
**Solution:**
1. Verify key format starts with "sk-ant-"
2. Check key is active in Anthropic Console
3. Verify no extra spaces in key
4. Check rate limits (10 requests/minute)
5. Wait and retry if rate limited

### Issue: Resume Not Parsing
**Solution:**
1. Verify file format (PDF, DOCX, DOC, TXT only)
2. Check file size (<10MB)
3. Try different file format
4. Enable AI extraction with API key
5. Simplify resume formatting

### Issue: Export Failing
**Solution:**
1. Check browser allows downloads
2. Verify file size not too large
3. Try different export format
4. Clear browser cache
5. Check console for errors

### Issue: Drag-Drop Not Working
**Solution:**
1. Ensure modern browser (Chrome, Firefox, Safari, Edge)
2. Check JavaScript enabled
3. Try click-and-drag instead of quick drag
4. Refresh page
5. Clear browser cache

### Issue: Templates Not Switching
**Solution:**
1. Check console for script loading errors
2. Verify script paths are relative (not absolute)
3. Clear browser cache
4. Reload page
5. Try different template

### Issue: Auto-Save Not Working
**Solution:**
1. Check browser localStorage enabled
2. Verify not in private/incognito mode
3. Check browser console for errors
4. Force manual save
5. Check localStorage quota not exceeded

### Issue: Preview Not Updating
**Solution:**
1. Check console for JavaScript errors
2. Verify PreviewController initialized
3. Try manual refresh
4. Clear browser cache
5. Reload page

---

## Support and Resources

### Documentation
- **TEST_RESULTS.md:** Comprehensive test results
- **BUGS_FOUND.md:** Known issues and workarounds
- **FEATURE_DEMO_GUIDE.md:** This guide

### Getting Help
- Check browser console for error messages
- Review troubleshooting section above
- Verify prerequisites met
- Try in different browser
- Check server logs

### Best Practices
- Keep resume under 2 pages
- Target ATS score of 85+
- Tailor every application
- Track all applications
- Review analytics weekly
- Update base resume monthly
- Proofread multiple times
- Test exports before submitting

---

**Last Updated:** December 1, 2025
**Version:** 1.0
**ResuMate Version:** Waves 1-3 Complete
