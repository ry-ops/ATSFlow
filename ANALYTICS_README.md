# Analytics Dashboard - ResuMate

## Overview

The Enhanced Analytics Dashboard provides comprehensive insights into resume performance, application tracking, template effectiveness, and job search ROI. Built with Chart.js for beautiful, responsive visualizations.

## Features

### 1. Resume Score Tracking
- **ATS Score History**: Track resume score improvements over time
- **Polish Score Trends**: Monitor writing quality evolution
- **Template Comparison**: Compare scores across different templates
- **Version Analytics**: Measure effectiveness of each iteration

### 2. Visualization Charts (7 Chart Types)
- **Score Progression Line Chart**: ATS and Polish scores over time
- **Application Funnel Chart**: Conversion rates through hiring stages
- **Template Usage Pie Chart**: Distribution of template usage
- **Keyword Frequency Bar Chart**: Most mentioned skills with trends
- **Success Rate by Industry**: Performance across different sectors
- **Response Time Distribution**: Time to hear back from applications
- **Monthly Trends Chart**: Application activity over 6 months

### 3. Advanced Metrics
- **ATS Score Trends**: Improvement/decline analysis with linear regression
- **Resume Iteration Effectiveness**: Success rate of resume updates
- **Template Performance**: Average scores and success rates by template
- **A/B Testing Results**: Statistical comparison of templates
- **ROI Tracking**: Applications vs. responses efficiency
- **Keyword Effectiveness**: Which keywords improve scores most
- **Time-Based Performance**: Activity levels and productivity metrics

### 4. Dashboard Features
- **Real-Time Updates**: Data refreshes automatically
- **Date Range Filtering**: 7 days, 30 days, 90 days, 1 year, all time
- **Dark Mode Support**: Toggle between light and dark themes
- **Exportable Reports**: PDF and CSV export options
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Print-Friendly**: Optimized layout for printing reports

## File Structure

```
ResuMate/
├── analytics-dashboard.html          # Main dashboard page
├── js/tracker/
│   ├── analytics.js                  # Enhanced analytics engine
│   ├── charts.js                     # Chart.js visualizations
│   ├── metrics.js                    # Advanced calculations
│   ├── storage.js                    # Data persistence
│   └── board.js                      # Application board (existing)
├── css/
│   └── analytics.css                 # Dashboard styles
└── package.json                      # Chart.js dependency added
```

## Installation

### 1. Install Chart.js

```bash
npm install chart.js@^4.4.0
```

Or use the CDN (already included in HTML):
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### 2. Include Required Files

Add to your HTML:
```html
<!-- Styles -->
<link rel="stylesheet" href="css/analytics.css">

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Analytics Scripts -->
<script src="js/tracker/storage.js"></script>
<script src="js/tracker/analytics.js"></script>
<script src="js/tracker/charts.js"></script>
<script src="js/tracker/metrics.js"></script>
```

## Usage Guide

### Accessing the Dashboard

1. Open `analytics-dashboard.html` in your browser
2. Or navigate from the main ResuMate app (add link to navigation)

### Data Schema

Analytics data is stored in localStorage with key: `resumate_analytics_v1`

```javascript
{
  resumeScores: [
    {
      date: "2025-12-01T12:00:00Z",
      atsScore: 85,
      polishScore: 92,
      templateId: "classic",
      keywords: ["JavaScript", "React", "Node.js"]
    }
  ],
  applications: [
    {
      date: "2025-12-01T12:00:00Z",
      company: "Tech Corp",
      status: "interview",
      responseTime: 5
    }
  ],
  templates: {
    "classic": {
      usageCount: 10,
      totalScore: 850,
      successRate: 0.6
    }
  },
  keywords: {
    "JavaScript": {
      mentions: 15,
      trendScore: 1.2,
      lastSeen: "2025-12-01T12:00:00Z"
    }
  },
  exports: [
    {
      date: "2025-12-01T12:00:00Z",
      format: "pdf",
      templateId: "modern"
    }
  ],
  lastUpdated: "2025-12-01T12:00:00Z"
}
```

### Tracking Resume Scores

```javascript
// After ATS scan completes
const analytics = new TrackerAnalytics(storage);

analytics.trackResumeScore(
  85,                    // ATS score
  92,                    // Polish score
  'classic',             // Template ID
  ['JavaScript', 'React', 'Node.js']  // Keywords
);
```

### Tracking Exports

```javascript
// After resume export
analytics.trackExport('pdf', 'modern');
```

### Retrieving Analytics

```javascript
// Get score history
const scoreHistory = analytics.getScoreHistory(30); // Last 30 days

// Get keyword trends
const keywords = analytics.getKeywordTrends(10); // Top 10

// Get template stats
const templates = analytics.getTemplateStats();

// Get export history
const exports = analytics.getExportHistory(30);
```

### Advanced Metrics

```javascript
const analyticsData = analytics.getAnalyticsData();
const metrics = new AdvancedMetrics(analyticsData);

// ATS score trends
const trends = metrics.calculateATSScoreTrends(30);
console.log(trends);
// {
//   trend: 'improving',
//   change: 5,
//   average: 82,
//   peak: 90,
//   low: 75,
//   trendSlope: 0.5
// }

// Resume iteration effectiveness
const effectiveness = metrics.calculateIterationEffectiveness();
console.log(effectiveness);
// {
//   totalIterations: 8,
//   improvements: 6,
//   effectiveness: 75,
//   avgImprovement: 3.5
// }

// Template A/B testing
const abTest = metrics.calculateABTestingResults('classic', 'modern');
console.log(abTest);
// {
//   templateA: { id: 'classic', score: 85, uses: 10 },
//   templateB: { id: 'modern', score: 88, uses: 8 },
//   winner: 'modern',
//   scoreDifference: 3,
//   confidence: 65,
//   recommendation: 'Moderate difference detected - continue testing'
// }

// ROI calculation
const roi = metrics.calculateROI();
console.log(roi);
// {
//   totalApplications: 50,
//   totalResponses: 15,
//   responseRate: 30,
//   avgTimeToResponse: 8,
//   roi: 29.2,
//   efficiency: 'Excellent'
// }
```

## Chart Types

### 1. Score Progression Chart
```javascript
const charts = new AnalyticsCharts();
const scoreHistory = analytics.getScoreHistory(30);

charts.createScoreProgressionChart(
  'score-progression-chart',  // Canvas ID
  scoreHistory
);
```

### 2. Application Funnel Chart
```javascript
const funnelData = {
  applied: 50,
  phoneScreen: 20,
  interview: 10,
  finalRound: 5,
  offer: 2
};

charts.createApplicationFunnelChart('funnel-chart', funnelData);
```

### 3. Template Usage Chart
```javascript
const templateStats = analytics.getTemplateStats();
charts.createTemplateUsageChart('template-chart', templateStats);
```

### 4. Keyword Frequency Chart
```javascript
const keywordTrends = analytics.getKeywordTrends(10);
charts.createKeywordFrequencyChart('keyword-chart', keywordTrends);
```

### 5. Response Time Distribution
```javascript
const responseTimes = [3, 5, 7, 14, 21, 30, 45];
charts.createResponseTimeDistributionChart('response-chart', responseTimes);
```

## Integration Points

### ATS Scanner Integration
```javascript
// In ats-scanner.js, after scan completes
function onScanComplete(score, keywords) {
  if (typeof TrackerAnalytics !== 'undefined') {
    const analytics = new TrackerAnalytics(storage);
    const currentTemplate = getCurrentTemplate();

    analytics.trackResumeScore(
      score.overall,
      score.polish || 0,
      currentTemplate,
      keywords
    );

    console.log('[ATS Scanner] Score tracked in analytics');
  }
}
```

### Export Engine Integration
```javascript
// In export-manager.js, after export
function onExportComplete(format, templateId) {
  if (typeof TrackerAnalytics !== 'undefined') {
    const analytics = new TrackerAnalytics();
    analytics.trackExport(format, templateId);

    console.log('[Export] Export tracked in analytics');
  }
}
```

### Application Tracker Integration
```javascript
// In tracker/board.js, when application status changes
function updateApplicationStatus(appId, newStatus) {
  // Existing update logic...

  // Track in analytics
  if (typeof TrackerAnalytics !== 'undefined') {
    const analytics = new TrackerAnalytics(storage);
    const analyticsData = analytics.getAnalyticsData();

    // Update application in analytics
    analyticsData.applications = analyticsData.applications || [];
    analyticsData.applications.push({
      date: new Date().toISOString(),
      company: app.company,
      status: newStatus,
      responseTime: calculateResponseTime(app)
    });

    analytics.saveAnalyticsData(analyticsData);
  }
}
```

## Customization

### Adding Custom Metrics

```javascript
// Extend AdvancedMetrics class
class CustomMetrics extends AdvancedMetrics {
  calculateCustomMetric() {
    // Your custom calculation
    return {
      value: 100,
      trend: 'improving'
    };
  }
}
```

### Custom Chart Types

```javascript
// Extend AnalyticsCharts class
class CustomCharts extends AnalyticsCharts {
  createCustomChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);

    this.charts[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        // Custom chart configuration
      },
      options: {
        // Custom options
      }
    });

    return this.charts[canvasId];
  }
}
```

### Custom Themes

Add to `css/analytics.css`:

```css
[data-theme="custom"] {
  --analytics-bg: #your-color;
  --analytics-card-bg: #your-color;
  --analytics-primary: #your-color;
  /* ... other variables */
}
```

## Dashboard Controls

### Date Range Selector
- **7 Days**: Last week's activity
- **30 Days**: Last month (default)
- **90 Days**: Last quarter
- **1 Year**: Annual trends
- **All Time**: Complete history

### Dark Mode Toggle
Click the moon/sun icon to toggle between light and dark themes. Preference is saved in localStorage.

### Refresh Button
Manually refresh all dashboard data and charts.

### Export Report
- **PDF**: Print-friendly full dashboard (uses browser print)
- **CSV**: Raw data export for Excel/Google Sheets

## Performance Optimization

### Data Limits
- Score history: Last 365 days displayed by default
- Keyword trends: Top 10 keywords
- Template stats: All templates shown
- Export history: Last 30 days

### Chart Performance
- Canvas-based rendering (Chart.js)
- Responsive resize handling
- Lazy loading for off-screen charts
- Destroy charts on range change to prevent memory leaks

### Local Storage Management
```javascript
// Clear old analytics data (optional)
function clearOldAnalytics(daysToKeep = 365) {
  const data = analytics.getAnalyticsData();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  data.resumeScores = data.resumeScores.filter(
    s => new Date(s.date) >= cutoff
  );

  analytics.saveAnalyticsData(data);
}
```

## Troubleshooting

### Charts Not Rendering

**Problem**: Canvas is blank
**Solution**: Ensure Chart.js is loaded before analytics scripts

```html
<!-- Correct order -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="js/tracker/charts.js"></script>
```

### No Data Displayed

**Problem**: "No data available" messages
**Solution**: Track some resume scores first

```javascript
// Add sample data for testing
const analytics = new TrackerAnalytics();
analytics.trackResumeScore(85, 90, 'classic', ['JavaScript', 'React']);
```

### Dark Mode Not Saving

**Problem**: Theme resets on page reload
**Solution**: Check localStorage is enabled

```javascript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage is working');
} catch (e) {
  console.error('localStorage is disabled');
}
```

## API Reference

### TrackerAnalytics

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `trackResumeScore()` | atsScore, polishScore, templateId, keywords | void | Track new resume score |
| `trackExport()` | format, templateId | void | Track export event |
| `getScoreHistory()` | days | Array | Get score history |
| `getKeywordTrends()` | limit | Array | Get keyword trends |
| `getTemplateStats()` | - | Array | Get template statistics |
| `getExportHistory()` | days | Array | Get export history |
| `getAllStats()` | - | Object | Get all statistics |

### AdvancedMetrics

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `calculateATSScoreTrends()` | days | Object | Calculate score trends |
| `calculateIterationEffectiveness()` | - | Object | Measure iteration success |
| `compareTemplatePerformance()` | - | Object | Compare all templates |
| `calculateABTestingResults()` | templateA, templateB | Object | A/B test comparison |
| `calculateROI()` | - | Object | Application ROI metrics |
| `calculateKeywordEffectiveness()` | - | Object | Keyword performance |
| `calculateTimeBasedMetrics()` | days | Object | Time-based analytics |

### AnalyticsCharts

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createScoreProgressionChart()` | canvasId, scoreHistory | Chart | Score line chart |
| `createApplicationFunnelChart()` | canvasId, funnelData | Chart | Funnel bar chart |
| `createTemplateUsageChart()` | canvasId, templateStats | Chart | Template pie chart |
| `createKeywordFrequencyChart()` | canvasId, keywordTrends | Chart | Keyword bar chart |
| `createSuccessRateByIndustryChart()` | canvasId, industryData | Chart | Industry comparison |
| `createResponseTimeDistributionChart()` | canvasId, responseData | Chart | Response time chart |
| `createMonthlyTrendsChart()` | canvasId, trendsData | Chart | Monthly trends chart |
| `destroyAll()` | - | void | Destroy all charts |

## Best Practices

### 1. Regular Tracking
Track resume scores after each ATS scan to build meaningful trends:
```javascript
// After ATS scan
analytics.trackResumeScore(score, polish, template, keywords);
```

### 2. Version Comparison
Before making major resume changes, track the current version:
```javascript
// Before changes
const beforeScore = getCurrentATSScore();

// After changes
const afterScore = getNewATSScore();

// Track both
analytics.trackResumeScore(beforeScore, ...);
analytics.trackResumeScore(afterScore, ...);
```

### 3. Template Experimentation
Test multiple templates with the same content:
```javascript
// Test each template
templates.forEach(template => {
  applyTemplate(template);
  const score = runATSScan();
  analytics.trackResumeScore(score, polish, template.id, keywords);
});

// Compare results
const comparison = metrics.compareTemplatePerformance();
```

### 4. Keyword Optimization
Monitor keyword effectiveness:
```javascript
const keywordEffectiveness = metrics.calculateKeywordEffectiveness();
const topKeywords = keywordEffectiveness.topPerformers;

// Focus on top-performing keywords
console.log('Use these keywords more:', topKeywords);
```

### 5. Export Regularly
Export analytics data for backup:
```javascript
// Monthly backup
function exportMonthlyBackup() {
  const data = analytics.getAnalyticsData();
  const json = JSON.stringify(data, null, 2);
  downloadAsFile(json, `analytics-backup-${new Date().toISOString()}.json`);
}
```

## Future Enhancements

Potential additions for future versions:

1. **Predictive Analytics**: ML-based score prediction
2. **Industry Benchmarking**: Compare against industry averages
3. **Skill Gap Analysis**: Identify missing critical skills
4. **Salary Insights**: Estimate salary ranges
5. **Job Market Trends**: Track hiring trends by industry
6. **Resume Heat Maps**: Visual attention prediction
7. **Collaboration**: Share analytics with mentors/advisors
8. **Goal Setting**: Set and track improvement goals
9. **Email Digest**: Weekly analytics summary emails
10. **API Integration**: Connect with LinkedIn, Indeed, etc.

## Support

For issues or questions:
1. Check this README
2. Review code comments in source files
3. Test with sample data
4. Check browser console for errors

## License

Part of ResuMate - MIT License

---

**Last Updated**: December 1, 2025
**Version**: 1.0.0
**Author**: ResuMate Development Team
