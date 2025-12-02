/**
 * Industry Benchmarking Engine
 * Compares resume against industry standards and provides insights
 */

class BenchmarkingEngine {
  constructor() {
    this.storageKey = 'resumate_benchmarking_v1';
    this.cache = this.loadFromStorage();
  }

  /**
   * Load benchmarking data from localStorage
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load benchmarking data:', error);
      return {};
    }
  }

  /**
   * Save benchmarking data to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save benchmarking data:', error);
    }
  }

  /**
   * Analyze resume against industry benchmarks
   * @param {Object} resumeData - Resume data to analyze
   * @param {string} targetRole - Target role (e.g., 'software-engineer')
   * @param {string} industry - Industry (e.g., 'technology')
   * @returns {Object} - Comprehensive benchmark analysis
   */
  async analyzeBenchmark(resumeData, targetRole, industry) {
    // Get industry benchmark data
    const benchmark = IndustryData.getRole(industry, targetRole);
    if (!benchmark) {
      throw new Error(`No benchmark data found for ${targetRole} in ${industry}`);
    }

    // Determine experience level
    const yearsExp = this.calculateYearsExperience(resumeData.experience || []);
    const experienceLevel = IndustryData.getExperienceLevel(industry, targetRole, yearsExp);
    if (!experienceLevel) {
      throw new Error('Could not determine experience level');
    }

    // Extract resume skills
    const resumeSkills = this.extractSkills(resumeData);

    // Analyze various aspects
    const analysis = {
      metadata: {
        analyzedAt: new Date().toISOString(),
        industry,
        targetRole,
        yearsExperience: yearsExp,
        experienceLevel: experienceLevel.level
      },
      skillsAnalysis: this.analyzeSkills(resumeSkills, experienceLevel),
      achievementsAnalysis: this.analyzeAchievements(resumeData.experience || [], experienceLevel),
      resumeStructure: this.analyzeStructure(resumeData, experienceLevel),
      salaryInsights: this.getSalaryInsights(experienceLevel, resumeSkills),
      percentileRank: 0, // Will be calculated
      competitivenessScore: 0, // Will be calculated
      strengths: [],
      gaps: [],
      recommendations: []
    };

    // Calculate overall scores
    this.calculateScores(analysis);

    // Generate strengths and gaps
    this.identifyStrengthsAndGaps(analysis);

    // Generate actionable recommendations
    this.generateRecommendations(analysis, experienceLevel);

    // Cache the result
    this.cacheAnalysis(resumeData, targetRole, industry, analysis);

    return analysis;
  }

  /**
   * Calculate years of experience from work history
   */
  calculateYearsExperience(experienceArray) {
    if (!experienceArray || experienceArray.length === 0) return 0;

    let totalMonths = 0;
    const now = new Date();

    experienceArray.forEach(exp => {
      const startDate = exp.startDate ? new Date(exp.startDate) : null;
      const endDate = exp.current ? now : (exp.endDate ? new Date(exp.endDate) : now);

      if (startDate && endDate) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                      (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(0, months);
      }
    });

    return Math.floor(totalMonths / 12);
  }

  /**
   * Extract all skills from resume
   */
  extractSkills(resumeData) {
    const skills = new Set();

    // From skills section
    if (resumeData.skills) {
      resumeData.skills.forEach(skill => {
        if (typeof skill === 'string') {
          skills.add(skill);
        } else if (skill.name) {
          skills.add(skill.name);
        }
      });
    }

    // From experience bullets (simple keyword extraction)
    if (resumeData.experience) {
      resumeData.experience.forEach(exp => {
        if (exp.bullets) {
          exp.bullets.forEach(bullet => {
            // Extract capitalized words and common tech terms
            const matches = bullet.match(/\b[A-Z][a-zA-Z0-9+#.]+\b/g) || [];
            matches.forEach(match => skills.add(match));
          });
        }
      });
    }

    return Array.from(skills);
  }

  /**
   * Analyze skills against benchmark
   */
  analyzeSkills(resumeSkills, benchmark) {
    const skillsLower = resumeSkills.map(s => s.toLowerCase());

    // Check critical skills
    const criticalSkills = benchmark.criticalSkills || [];
    const hasCritical = criticalSkills.filter(skill =>
      skillsLower.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );
    const missingCritical = criticalSkills.filter(skill =>
      !skillsLower.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );

    // Check valuable skills
    const valuableSkills = benchmark.valuableSkills || [];
    const hasValuable = valuableSkills.filter(skill =>
      skillsLower.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );
    const missingValuable = valuableSkills.filter(skill =>
      !skillsLower.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );

    // Check emerging skills
    const emergingSkills = benchmark.emergingSkills || [];
    const hasEmerging = emergingSkills.filter(skill =>
      skillsLower.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );

    const totalSkills = resumeSkills.length;
    const expectedDensity = benchmark.skillDensity || 10;

    return {
      totalSkills,
      expectedDensity,
      densityScore: this.calculateDensityScore(totalSkills, expectedDensity),
      criticalSkills: {
        total: criticalSkills.length,
        has: hasCritical,
        missing: missingCritical,
        coverage: (hasCritical.length / criticalSkills.length) * 100
      },
      valuableSkills: {
        total: valuableSkills.length,
        has: hasValuable,
        missing: missingValuable,
        coverage: (hasValuable.length / valuableSkills.length) * 100
      },
      emergingSkills: {
        total: emergingSkills.length,
        has: hasEmerging,
        coverage: emergingSkills.length > 0 ? (hasEmerging.length / emergingSkills.length) * 100 : 0
      }
    };
  }

  /**
   * Calculate skill density score
   */
  calculateDensityScore(actual, expected) {
    if (typeof expected === 'string' && expected.includes('-')) {
      const [min, max] = expected.split('-').map(Number);
      const target = (min + max) / 2;
      if (actual >= min && actual <= max) return 100;
      if (actual < min) return Math.max(0, (actual / min) * 100);
      return Math.max(0, 100 - ((actual - max) / max * 50));
    }
    return actual >= expected ? 100 : (actual / expected) * 100;
  }

  /**
   * Analyze achievements and quantification
   */
  analyzeAchievements(experienceArray, benchmark) {
    let totalBullets = 0;
    let quantifiedBullets = 0;
    let avgBulletsPerRole = 0;

    experienceArray.forEach(exp => {
      const bullets = exp.bullets || [];
      totalBullets += bullets.length;

      // Check for quantification (numbers, percentages, dollar signs)
      bullets.forEach(bullet => {
        if (this.hasQuantification(bullet)) {
          quantifiedBullets++;
        }
      });
    });

    if (experienceArray.length > 0) {
      avgBulletsPerRole = totalBullets / experienceArray.length;
    }

    const quantificationRate = totalBullets > 0 ? quantifiedBullets / totalBullets : 0;
    const expectedRate = benchmark.quantificationRate || 0.7;
    const expectedBullets = benchmark.expectedBulletPoints || 5;

    return {
      totalBullets,
      quantifiedBullets,
      quantificationRate,
      expectedQuantificationRate: expectedRate,
      quantificationScore: (quantificationRate / expectedRate) * 100,
      avgBulletsPerRole,
      expectedBulletsPerRole: expectedBullets,
      bulletDensityScore: this.calculateBulletScore(avgBulletsPerRole, expectedBullets)
    };
  }

  /**
   * Check if bullet has quantification
   */
  hasQuantification(bullet) {
    // Look for numbers, percentages, dollar amounts, time periods
    const patterns = [
      /\d+%/,           // Percentages
      /\$\d+/,          // Dollar amounts
      /\d+[kKmMbB]/,    // Numbers with K, M, B
      /\d+\s*(hours|days|weeks|months|years)/i,  // Time periods
      /\d+x/i,          // Multipliers
      /\d+\+/,          // Numbers with +
      /\d{2,}/          // Any number with 2+ digits
    ];
    return patterns.some(pattern => pattern.test(bullet));
  }

  /**
   * Calculate bullet density score
   */
  calculateBulletScore(actual, expected) {
    if (typeof expected === 'string' && expected.includes('-')) {
      const [min, max] = expected.split('-').map(Number);
      if (actual >= min && actual <= max) return 100;
      if (actual < min) return (actual / min) * 100;
      return Math.max(0, 100 - ((actual - max) / max * 30));
    }
    const diff = Math.abs(actual - expected);
    return Math.max(0, 100 - (diff / expected * 50));
  }

  /**
   * Analyze resume structure
   */
  analyzeStructure(resumeData, benchmark) {
    const sections = {
      hasSummary: !!resumeData.summary,
      hasExperience: !!(resumeData.experience && resumeData.experience.length > 0),
      hasSkills: !!(resumeData.skills && resumeData.skills.length > 0),
      hasEducation: !!(resumeData.education && resumeData.education.length > 0),
      hasProjects: !!(resumeData.projects && resumeData.projects.length > 0),
      hasCertifications: !!(resumeData.certifications && resumeData.certifications.length > 0)
    };

    const sectionScore = Object.values(sections).filter(v => v).length / Object.keys(sections).length * 100;

    return {
      sections,
      sectionScore,
      formatting: {
        summaryLength: resumeData.summary ? resumeData.summary.length : 0,
        experienceCount: resumeData.experience ? resumeData.experience.length : 0,
        skillsCount: resumeData.skills ? resumeData.skills.length : 0
      }
    };
  }

  /**
   * Get salary insights based on benchmark and skills
   */
  getSalaryInsights(benchmark, skills) {
    const baseRange = benchmark.salaryRange || { min: 0, max: 0 };

    // Adjust based on emerging skills (can increase potential)
    const emergingSkillBonus = skills.filter(s =>
      (benchmark.emergingSkills || []).some(es => s.toLowerCase().includes(es.toLowerCase()))
    ).length * 0.05; // 5% per emerging skill

    return {
      baseRange,
      adjustedRange: {
        min: Math.round(baseRange.min * (1 + emergingSkillBonus)),
        max: Math.round(baseRange.max * (1 + emergingSkillBonus))
      },
      factors: {
        emergingSkills: emergingSkillBonus > 0,
        certifications: benchmark.certifications || []
      },
      negotiationPoints: this.generateNegotiationPoints(benchmark, skills)
    };
  }

  /**
   * Generate salary negotiation points
   */
  generateNegotiationPoints(benchmark, skills) {
    const points = [];

    // Check for high-value skills
    const emergingSkills = benchmark.emergingSkills || [];
    const hasEmerging = skills.filter(s =>
      emergingSkills.some(es => s.toLowerCase().includes(es.toLowerCase()))
    );

    if (hasEmerging.length > 0) {
      points.push(`Expertise in emerging technologies: ${hasEmerging.slice(0, 3).join(', ')}`);
    }

    // Certifications
    if (benchmark.certifications && benchmark.certifications.length > 0) {
      points.push(`Industry certifications valued: ${benchmark.certifications.slice(0, 2).join(', ')}`);
    }

    // Experience level
    points.push(`${benchmark.level} level with ${benchmark.yearsRange[0]}-${benchmark.yearsRange[1]} years expected`);

    return points;
  }

  /**
   * Calculate overall scores
   */
  calculateScores(analysis) {
    const weights = {
      skills: 0.35,
      achievements: 0.30,
      structure: 0.20,
      quantification: 0.15
    };

    const skillScore = (
      analysis.skillsAnalysis.criticalSkills.coverage * 0.6 +
      analysis.skillsAnalysis.valuableSkills.coverage * 0.3 +
      analysis.skillsAnalysis.emergingSkills.coverage * 0.1
    );

    const achievementScore = (
      analysis.achievementsAnalysis.quantificationScore * 0.6 +
      analysis.achievementsAnalysis.bulletDensityScore * 0.4
    );

    const structureScore = analysis.resumeStructure.sectionScore;

    const overallScore = (
      skillScore * weights.skills +
      achievementScore * weights.achievements +
      structureScore * weights.structure +
      analysis.achievementsAnalysis.quantificationScore * weights.quantification
    );

    analysis.competitivenessScore = Math.round(Math.min(100, overallScore));

    // Percentile rank (simplified mapping)
    if (overallScore >= 90) analysis.percentileRank = 95;
    else if (overallScore >= 80) analysis.percentileRank = 85;
    else if (overallScore >= 70) analysis.percentileRank = 75;
    else if (overallScore >= 60) analysis.percentileRank = 60;
    else if (overallScore >= 50) analysis.percentileRank = 50;
    else analysis.percentileRank = Math.round(overallScore / 2);
  }

  /**
   * Identify strengths and gaps
   */
  identifyStrengthsAndGaps(analysis) {
    const strengths = [];
    const gaps = [];

    // Skills strengths/gaps
    if (analysis.skillsAnalysis.criticalSkills.coverage >= 80) {
      strengths.push('Strong coverage of critical technical skills');
    } else if (analysis.skillsAnalysis.criticalSkills.coverage < 60) {
      gaps.push(`Missing ${analysis.skillsAnalysis.criticalSkills.missing.length} critical skills`);
    }

    if (analysis.skillsAnalysis.emergingSkills.coverage >= 40) {
      strengths.push('Knowledge of emerging technologies');
    }

    // Achievement strengths/gaps
    if (analysis.achievementsAnalysis.quantificationRate >= analysis.achievementsAnalysis.expectedQuantificationRate) {
      strengths.push('Well-quantified achievements with metrics');
    } else {
      gaps.push('Insufficient quantification of achievements');
    }

    // Structure strengths/gaps
    if (analysis.resumeStructure.sections.hasSummary) {
      strengths.push('Professional summary included');
    } else {
      gaps.push('Missing professional summary');
    }

    if (analysis.resumeStructure.sections.hasCertifications) {
      strengths.push('Industry certifications listed');
    }

    analysis.strengths = strengths;
    analysis.gaps = gaps;
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(analysis, benchmark) {
    const recommendations = [];

    // Skills recommendations
    if (analysis.skillsAnalysis.criticalSkills.missing.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'skills',
        title: 'Add Critical Skills',
        description: `Add these critical skills to your resume: ${analysis.skillsAnalysis.criticalSkills.missing.slice(0, 3).join(', ')}`,
        impact: 'Increase ATS match rate by 15-25%'
      });
    }

    if (analysis.skillsAnalysis.valuableSkills.missing.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'skills',
        title: 'Include Valuable Skills',
        description: `Consider adding: ${analysis.skillsAnalysis.valuableSkills.missing.slice(0, 3).join(', ')}`,
        impact: 'Enhance competitiveness'
      });
    }

    // Quantification recommendations
    if (analysis.achievementsAnalysis.quantificationRate < analysis.achievementsAnalysis.expectedQuantificationRate) {
      const missingQuantified = Math.round(
        (analysis.achievementsAnalysis.expectedQuantificationRate - analysis.achievementsAnalysis.quantificationRate) *
        analysis.achievementsAnalysis.totalBullets
      );
      recommendations.push({
        priority: 'high',
        category: 'achievements',
        title: 'Quantify More Achievements',
        description: `Add metrics to ${missingQuantified} more bullet points (percentages, dollar amounts, time savings)`,
        impact: 'Increase perceived impact by 20-30%'
      });
    }

    // Structure recommendations
    if (!analysis.resumeStructure.sections.hasSummary) {
      recommendations.push({
        priority: 'high',
        category: 'structure',
        title: 'Add Professional Summary',
        description: 'Include a 3-4 sentence summary highlighting your key qualifications',
        impact: 'Improve first impression and ATS scoring'
      });
    }

    // Emerging skills recommendations
    if (analysis.skillsAnalysis.emergingSkills.coverage < 30) {
      const emergingToAdd = benchmark.emergingSkills.slice(0, 2);
      recommendations.push({
        priority: 'medium',
        category: 'skills',
        title: 'Learn Emerging Technologies',
        description: `Consider learning: ${emergingToAdd.join(', ')} to stay competitive`,
        impact: 'Position for future opportunities'
      });
    }

    // Certifications
    if (!analysis.resumeStructure.sections.hasCertifications && benchmark.certifications) {
      recommendations.push({
        priority: 'medium',
        category: 'credentials',
        title: 'Pursue Certifications',
        description: `Consider: ${benchmark.certifications.slice(0, 2).join(', ')}`,
        impact: 'Increase credibility and salary potential'
      });
    }

    analysis.recommendations = recommendations;
  }

  /**
   * Cache analysis for later retrieval
   */
  cacheAnalysis(resumeData, targetRole, industry, analysis) {
    const key = `${industry}_${targetRole}_${Date.now()}`;
    this.cache[key] = {
      resumeData,
      analysis,
      cachedAt: new Date().toISOString()
    };
    this.saveToStorage();
  }

  /**
   * Get cached analyses
   */
  getCachedAnalyses() {
    return Object.entries(this.cache).map(([key, value]) => ({
      key,
      ...value
    }));
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
    this.saveToStorage();
  }
}

// Create global instance
const benchmarkingEngine = new BenchmarkingEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BenchmarkingEngine, benchmarkingEngine };
}
