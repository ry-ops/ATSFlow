/**
 * Analytics Charts with Chart.js
 * Provides visualization components for resume analytics dashboard
 */

class AnalyticsCharts {
  constructor() {
    this.charts = {};
    this.colors = {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gray: '#6b7280'
    };
  }

  /**
   * Destroy all charts
   */
  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }

  /**
   * Create score progression line chart
   */
  createScoreProgressionChart(canvasId, scoreHistory) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = scoreHistory.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const atsScores = scoreHistory.map(s => s.atsScore);
    const polishScores = scoreHistory.map(s => s.polishScore);

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'ATS Score',
            data: atsScores,
            borderColor: this.colors.primary,
            backgroundColor: this.hexToRGBA(this.colors.primary, 0.1),
            tension: 0.4,
            fill: true
          },
          {
            label: 'Polish Score',
            data: polishScores,
            borderColor: this.colors.success,
            backgroundColor: this.hexToRGBA(this.colors.success, 0.1),
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Resume Score Progression'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create application funnel chart
   */
  createApplicationFunnelChart(canvasId, funnelData) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const data = [
      funnelData.applied || 0,
      funnelData.phoneScreen || 0,
      funnelData.interview || 0,
      funnelData.finalRound || 0,
      funnelData.offer || 0
    ];

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Applied', 'Phone Screen', 'Interview', 'Final Round', 'Offer'],
        datasets: [{
          label: 'Applications',
          data: data,
          backgroundColor: [
            this.colors.gray,
            this.colors.info,
            this.colors.primary,
            this.colors.warning,
            this.colors.success
          ],
          borderColor: [
            this.colors.gray,
            this.colors.info,
            this.colors.primary,
            this.colors.warning,
            this.colors.success
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Application Funnel'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create template usage pie chart
   */
  createTemplateUsageChart(canvasId, templateStats) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = templateStats.map(t => this.formatTemplateName(t.templateId));
    const data = templateStats.map(t => t.usageCount);
    const backgroundColors = this.generateColors(templateStats.length);

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Template Usage Distribution'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create keyword frequency bar chart
   */
  createKeywordFrequencyChart(canvasId, keywordTrends) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = keywordTrends.map(k => k.keyword);
    const data = keywordTrends.map(k => k.mentions);
    const trendColors = keywordTrends.map(k => {
      if (k.trendScore > 1.2) return this.colors.success;
      if (k.trendScore < 0.8) return this.colors.danger;
      return this.colors.primary;
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mentions',
          data: data,
          backgroundColor: trendColors,
          borderColor: trendColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top Keywords by Frequency'
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const trend = keywordTrends[context.dataIndex].trendScore;
                const trendText = trend > 1.2 ? '📈 Trending Up' :
                                 trend < 0.8 ? '📉 Trending Down' :
                                 '➡️ Stable';
                return trendText;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create success rate by industry chart
   */
  createSuccessRateByIndustryChart(canvasId, industryData) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = industryData.map(i => i.industry);
    const successRates = industryData.map(i => i.successRate);
    const applicationCounts = industryData.map(i => i.applications);

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Success Rate (%)',
            data: successRates,
            backgroundColor: this.hexToRGBA(this.colors.success, 0.7),
            borderColor: this.colors.success,
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Applications',
            data: applicationCounts,
            type: 'line',
            borderColor: this.colors.primary,
            backgroundColor: this.hexToRGBA(this.colors.primary, 0.1),
            yAxisID: 'y1',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Success Rate by Industry'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create response time distribution chart
   */
  createResponseTimeDistributionChart(canvasId, responseData) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Group response times into buckets
    const buckets = {
      '0-3 days': 0,
      '4-7 days': 0,
      '8-14 days': 0,
      '15-30 days': 0,
      '30+ days': 0
    };

    responseData.forEach(days => {
      if (days <= 3) buckets['0-3 days']++;
      else if (days <= 7) buckets['4-7 days']++;
      else if (days <= 14) buckets['8-14 days']++;
      else if (days <= 30) buckets['15-30 days']++;
      else buckets['30+ days']++;
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(buckets),
        datasets: [{
          label: 'Applications',
          data: Object.values(buckets),
          backgroundColor: this.colors.primary,
          borderColor: this.colors.primary,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Response Time Distribution'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Create monthly trends chart
   */
  createMonthlyTrendsChart(canvasId, trendsData) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = trendsData.map(t => t.month);
    const applied = trendsData.map(t => t.applied);
    const interviews = trendsData.map(t => t.interviews);
    const offers = trendsData.map(t => t.offers);

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Applied',
            data: applied,
            borderColor: this.colors.gray,
            backgroundColor: this.hexToRGBA(this.colors.gray, 0.1),
            tension: 0.4,
            fill: true
          },
          {
            label: 'Interviews',
            data: interviews,
            borderColor: this.colors.primary,
            backgroundColor: this.hexToRGBA(this.colors.primary, 0.1),
            tension: 0.4,
            fill: true
          },
          {
            label: 'Offers',
            data: offers,
            borderColor: this.colors.success,
            backgroundColor: this.hexToRGBA(this.colors.success, 0.1),
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Application Trends (6 Months)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });

    return this.charts[canvasId];
  }

  /**
   * Helper: Convert hex color to RGBA
   */
  hexToRGBA(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Helper: Generate array of colors
   */
  generateColors(count) {
    const baseColors = [
      this.colors.primary,
      this.colors.success,
      this.colors.warning,
      this.colors.info,
      this.colors.purple,
      this.colors.pink
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }

  /**
   * Helper: Format template name
   */
  formatTemplateName(templateId) {
    const names = {
      'classic': 'Classic',
      'modern': 'Modern',
      'professional': 'Professional',
      'creative': 'Creative',
      'minimal': 'Minimal',
      'executive': 'Executive',
      'technical': 'Technical'
    };
    return names[templateId] || templateId;
  }
}

// Make globally accessible
window.AnalyticsCharts = AnalyticsCharts;
