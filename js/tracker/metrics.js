/**
 * Advanced Analytics Metrics
 * Provides complex calculations for resume analytics
 */

class AdvancedMetrics {
  constructor(analyticsData) {
    this.data = analyticsData;
  }

  /**
   * Calculate ATS score trends
   */
  calculateATSScoreTrends(days = 30) {
    const scoreHistory = this.getRecentScores(days);
    if (scoreHistory.length < 2) {
      return {
        trend: 'insufficient_data',
        change: 0,
        average: 0,
        peak: 0,
        low: 0
      };
    }

    const scores = scoreHistory.map(s => s.atsScore);
    const average = this.calculateAverage(scores);
    const peak = Math.max(...scores);
    const low = Math.min(...scores);

    // Calculate trend using linear regression
    const trend = this.calculateTrend(scores);
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    const change = lastScore - firstScore;

    return {
      trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
      change: Math.round(change),
      average: Math.round(average),
      peak,
      low,
      trendSlope: trend
    };
  }

  /**
   * Calculate resume iteration effectiveness
   */
  calculateIterationEffectiveness() {
    const scoreHistory = this.data.resumeScores || [];
    if (scoreHistory.length < 2) {
      return {
        totalIterations: scoreHistory.length,
        improvements: 0,
        effectiveness: 0,
        avgImprovement: 0
      };
    }

    let improvements = 0;
    let totalImprovement = 0;

    for (let i = 1; i < scoreHistory.length; i++) {
      const scoreDiff = scoreHistory[i].atsScore - scoreHistory[i - 1].atsScore;
      if (scoreDiff > 0) {
        improvements++;
        totalImprovement += scoreDiff;
      }
    }

    const effectiveness = (improvements / (scoreHistory.length - 1)) * 100;
    const avgImprovement = improvements > 0 ? totalImprovement / improvements : 0;

    return {
      totalIterations: scoreHistory.length,
      improvements,
      effectiveness: Math.round(effectiveness),
      avgImprovement: Math.round(avgImprovement * 10) / 10
    };
  }

  /**
   * Calculate template performance comparison
   */
  compareTemplatePerformance() {
    const templates = this.data.templates || {};
    const templateScores = {};

    // Calculate average scores per template
    Object.entries(templates).forEach(([templateId, stats]) => {
      const avgScore = stats.usageCount > 0 ? stats.totalScore / stats.usageCount : 0;
      templateScores[templateId] = {
        avgScore: Math.round(avgScore),
        usageCount: stats.usageCount,
        successRate: stats.successRate || 0
      };
    });

    // Find best and worst
    const sorted = Object.entries(templateScores).sort((a, b) => b[1].avgScore - a[1].avgScore);
    const best = sorted[0] || null;
    const worst = sorted[sorted.length - 1] || null;

    return {
      templates: templateScores,
      bestTemplate: best ? { id: best[0], ...best[1] } : null,
      worstTemplate: worst && sorted.length > 1 ? { id: worst[0], ...worst[1] } : null,
      totalTemplates: Object.keys(templates).length
    };
  }

  /**
   * Calculate version comparison analytics
   */
  calculateVersionComparison(versionA, versionB) {
    // This would integrate with version manager
    // For now, return placeholder structure
    return {
      versionA: {
        id: versionA,
        score: 0,
        keywords: []
      },
      versionB: {
        id: versionB,
        score: 0,
        keywords: []
      },
      scoreDifference: 0,
      recommendation: 'Version comparison requires version IDs'
    };
  }

  /**
   * Calculate A/B testing results
   */
  calculateABTestingResults(templateA, templateB) {
    const templates = this.data.templates || {};
    const statsA = templates[templateA] || { usageCount: 0, totalScore: 0, successRate: 0 };
    const statsB = templates[templateB] || { usageCount: 0, totalScore: 0, successRate: 0 };

    if (statsA.usageCount === 0 || statsB.usageCount === 0) {
      return {
        templateA: { id: templateA, score: 0, uses: 0 },
        templateB: { id: templateB, score: 0, uses: 0 },
        winner: null,
        confidence: 0,
        recommendation: 'Insufficient data for comparison'
      };
    }

    const avgScoreA = statsA.totalScore / statsA.usageCount;
    const avgScoreB = statsB.totalScore / statsB.usageCount;
    const difference = avgScoreA - avgScoreB;

    // Simple confidence calculation based on sample size and difference
    const minSamples = Math.min(statsA.usageCount, statsB.usageCount);
    const confidence = Math.min(95, (minSamples * Math.abs(difference) / 10));

    return {
      templateA: {
        id: templateA,
        score: Math.round(avgScoreA),
        uses: statsA.usageCount,
        successRate: statsA.successRate
      },
      templateB: {
        id: templateB,
        score: Math.round(avgScoreB),
        uses: statsB.usageCount,
        successRate: statsB.successRate
      },
      winner: difference > 0 ? templateA : difference < 0 ? templateB : null,
      scoreDifference: Math.round(Math.abs(difference) * 10) / 10,
      confidence: Math.round(confidence),
      recommendation: this.getABTestRecommendation(difference, confidence)
    };
  }

  /**
   * Calculate ROI tracking (applications vs responses)
   */
  calculateROI() {
    const applications = this.data.applications || [];
    if (applications.length === 0) {
      return {
        totalApplications: 0,
        totalResponses: 0,
        responseRate: 0,
        avgTimeToResponse: 0,
        roi: 0,
        efficiency: 'No data'
      };
    }

    const totalApplications = applications.length;
    const responded = applications.filter(app =>
      app.status && !['saved', 'preparing', 'applied', 'rejected'].includes(app.status)
    );
    const totalResponses = responded.length;

    const responseTimes = responded
      .filter(app => app.responseTime)
      .map(app => app.responseTime);

    const avgTimeToResponse = responseTimes.length > 0
      ? this.calculateAverage(responseTimes)
      : 0;

    const responseRate = (totalResponses / totalApplications) * 100;

    // ROI: (Responses / Applications) * 100 - Time Cost
    const timeCostFactor = avgTimeToResponse / 10; // Penalty for slow responses
    const roi = responseRate - timeCostFactor;

    return {
      totalApplications,
      totalResponses,
      responseRate: Math.round(responseRate),
      avgTimeToResponse: Math.round(avgTimeToResponse),
      roi: Math.round(roi * 10) / 10,
      efficiency: this.getEfficiencyRating(roi)
    };
  }

  /**
   * Calculate keyword effectiveness score
   */
  calculateKeywordEffectiveness() {
    const keywords = this.data.keywords || {};
    const scores = this.data.resumeScores || [];

    if (Object.keys(keywords).length === 0 || scores.length === 0) {
      return {
        totalKeywords: 0,
        avgMentions: 0,
        topPerformers: [],
        underutilized: []
      };
    }

    const keywordScores = Object.entries(keywords).map(([keyword, stats]) => {
      // Calculate average score for resumes containing this keyword
      const resumesWithKeyword = scores.filter(s => s.keywords && s.keywords.includes(keyword));
      const avgScore = resumesWithKeyword.length > 0
        ? this.calculateAverage(resumesWithKeyword.map(s => s.atsScore))
        : 0;

      return {
        keyword,
        mentions: stats.mentions,
        avgScore: Math.round(avgScore),
        trendScore: stats.trendScore,
        effectiveness: avgScore * (stats.trendScore || 1)
      };
    });

    const sorted = keywordScores.sort((a, b) => b.effectiveness - a.effectiveness);
    const topPerformers = sorted.slice(0, 5);
    const underutilized = sorted.slice(-5).reverse();

    return {
      totalKeywords: Object.keys(keywords).length,
      avgMentions: Math.round(this.calculateAverage(keywordScores.map(k => k.mentions))),
      topPerformers,
      underutilized: underutilized.filter(k => k.mentions > 0)
    };
  }

  /**
   * Calculate time-based performance metrics
   */
  calculateTimeBasedMetrics(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentScores = this.data.resumeScores.filter(s =>
      new Date(s.date) >= cutoffDate
    );

    const recentExports = this.data.exports.filter(e =>
      new Date(e.date) >= cutoffDate
    );

    if (recentScores.length === 0) {
      return {
        period: `Last ${days} days`,
        activity: 'low',
        scoreImprovements: 0,
        exportsCount: recentExports.length,
        productivity: 0
      };
    }

    const scoreImprovements = this.countImprovements(recentScores);
    const productivity = ((recentScores.length + recentExports.length) / days) * 7; // Per week

    return {
      period: `Last ${days} days`,
      activity: productivity > 3 ? 'high' : productivity > 1 ? 'medium' : 'low',
      scoreImprovements,
      exportsCount: recentExports.length,
      resumeUpdates: recentScores.length,
      productivity: Math.round(productivity * 10) / 10
    };
  }

  /**
   * Helper: Get recent scores
   */
  getRecentScores(days) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return (this.data.resumeScores || [])
      .filter(score => new Date(score.date) >= cutoff)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Helper: Calculate average
   */
  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Helper: Calculate trend using simple linear regression
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;

    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = this.calculateAverage(values);

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Helper: Count score improvements
   */
  countImprovements(scores) {
    let count = 0;
    for (let i = 1; i < scores.length; i++) {
      if (scores[i].atsScore > scores[i - 1].atsScore) {
        count++;
      }
    }
    return count;
  }

  /**
   * Helper: Get A/B test recommendation
   */
  getABTestRecommendation(difference, confidence) {
    if (confidence < 50) {
      return 'Need more data to make a confident recommendation';
    }

    if (Math.abs(difference) < 3) {
      return 'Templates perform similarly - choose based on preference';
    }

    if (difference > 5) {
      return 'Template A shows significantly better performance';
    } else if (difference < -5) {
      return 'Template B shows significantly better performance';
    }

    return 'Moderate difference detected - continue testing';
  }

  /**
   * Helper: Get efficiency rating
   */
  getEfficiencyRating(roi) {
    if (roi >= 30) return 'Excellent';
    if (roi >= 20) return 'Good';
    if (roi >= 10) return 'Fair';
    return 'Needs Improvement';
  }
}

// Make globally accessible
window.AdvancedMetrics = AdvancedMetrics;
