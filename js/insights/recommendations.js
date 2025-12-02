/**
 * Career Progression Recommendations Engine
 * Provides AI-powered career path suggestions and progression insights
 */

class CareerProgressionEngine {
  constructor() {
    this.storageKey = 'resumate_career_paths_v1';
  }

  /**
   * Generate career progression paths
   * @param {Object} background - Professional background
   * @returns {Object} - Career progression recommendations
   */
  generateCareerPaths(background) {
    const {
      currentRole,
      yearsExperience,
      skills = [],
      industry,
      education = '',
      currentLevel = 'mid'
    } = background;

    // Determine current experience level
    const level = this.determineLevel(yearsExperience, currentLevel);

    // Generate progression paths
    const paths = this.identifyNextRoles(currentRole, industry, level, skills);

    // Add timeline and requirements for each path
    const enrichedPaths = paths.map(path =>
      this.enrichCareerPath(path, background)
    );

    return {
      currentPosition: {
        role: currentRole,
        level,
        yearsExperience,
        industry
      },
      careerPaths: enrichedPaths,
      marketDemand: this.assessMarketDemand(enrichedPaths),
      recommendations: this.generateGeneralRecommendations(background, enrichedPaths)
    };
  }

  /**
   * Determine experience level
   */
  determineLevel(years, currentLevel) {
    if (currentLevel) return currentLevel;
    if (years <= 2) return 'entry';
    if (years <= 7) return 'mid';
    return 'senior';
  }

  /**
   * Identify next logical roles
   */
  identifyNextRoles(currentRole, industry, level, skills) {
    const paths = [];
    const roleLower = currentRole.toLowerCase();

    // Technology roles
    if (industry === 'technology' || industry === 'tech' || industry === 'software') {
      if (roleLower.includes('software engineer') || roleLower.includes('developer')) {
        if (level === 'entry') {
          paths.push(
            { role: 'Mid-Level Software Engineer', type: 'vertical', difficulty: 'moderate' },
            { role: 'Full-Stack Developer', type: 'lateral', difficulty: 'easy' },
            { role: 'Frontend Specialist', type: 'specialization', difficulty: 'easy' }
          );
        } else if (level === 'mid') {
          paths.push(
            { role: 'Senior Software Engineer', type: 'vertical', difficulty: 'moderate' },
            { role: 'Tech Lead', type: 'leadership', difficulty: 'moderate' },
            { role: 'Engineering Manager', type: 'management', difficulty: 'challenging' }
          );
        } else {
          paths.push(
            { role: 'Staff Engineer', type: 'vertical', difficulty: 'challenging' },
            { role: 'Engineering Manager', type: 'management', difficulty: 'moderate' },
            { role: 'Solutions Architect', type: 'specialization', difficulty: 'moderate' }
          );
        }
      }

      if (roleLower.includes('data scientist') || roleLower.includes('ml engineer')) {
        if (level === 'entry') {
          paths.push(
            { role: 'Mid-Level Data Scientist', type: 'vertical', difficulty: 'moderate' },
            { role: 'ML Engineer', type: 'lateral', difficulty: 'moderate' },
            { role: 'Data Analyst', type: 'lateral', difficulty: 'easy' }
          );
        } else if (level === 'mid') {
          paths.push(
            { role: 'Senior Data Scientist', type: 'vertical', difficulty: 'moderate' },
            { role: 'ML Research Scientist', type: 'specialization', difficulty: 'challenging' },
            { role: 'Data Science Manager', type: 'management', difficulty: 'challenging' }
          );
        } else {
          paths.push(
            { role: 'Principal Data Scientist', type: 'vertical', difficulty: 'challenging' },
            { role: 'Head of Data Science', type: 'management', difficulty: 'challenging' },
            { role: 'AI/ML Architect', type: 'specialization', difficulty: 'moderate' }
          );
        }
      }

      if (roleLower.includes('product manager')) {
        if (level === 'entry') {
          paths.push(
            { role: 'Product Manager', type: 'vertical', difficulty: 'moderate' },
            { role: 'Technical Product Manager', type: 'specialization', difficulty: 'moderate' },
            { role: 'Product Analyst', type: 'lateral', difficulty: 'easy' }
          );
        } else if (level === 'mid') {
          paths.push(
            { role: 'Senior Product Manager', type: 'vertical', difficulty: 'moderate' },
            { role: 'Group Product Manager', type: 'leadership', difficulty: 'challenging' },
            { role: 'Product Lead', type: 'leadership', difficulty: 'moderate' }
          );
        } else {
          paths.push(
            { role: 'Director of Product', type: 'management', difficulty: 'moderate' },
            { role: 'VP of Product', type: 'executive', difficulty: 'challenging' },
            { role: 'Chief Product Officer', type: 'executive', difficulty: 'very-challenging' }
          );
        }
      }
    }

    // Finance roles
    if (industry === 'finance' || industry === 'banking') {
      if (roleLower.includes('financial analyst')) {
        if (level === 'entry') {
          paths.push(
            { role: 'Senior Financial Analyst', type: 'vertical', difficulty: 'moderate' },
            { role: 'FP&A Analyst', type: 'specialization', difficulty: 'easy' },
            { role: 'Investment Analyst', type: 'lateral', difficulty: 'moderate' }
          );
        } else if (level === 'mid') {
          paths.push(
            { role: 'Finance Manager', type: 'management', difficulty: 'moderate' },
            { role: 'FP&A Manager', type: 'specialization', difficulty: 'moderate' },
            { role: 'Senior FP&A Analyst', type: 'vertical', difficulty: 'moderate' }
          );
        } else {
          paths.push(
            { role: 'Finance Director', type: 'management', difficulty: 'challenging' },
            { role: 'VP of Finance', type: 'executive', difficulty: 'challenging' },
            { role: 'CFO', type: 'executive', difficulty: 'very-challenging' }
          );
        }
      }
    }

    // Marketing roles
    if (industry === 'marketing' || industry === 'creative') {
      if (roleLower.includes('digital marketing') || roleLower.includes('marketing')) {
        if (level === 'entry') {
          paths.push(
            { role: 'Digital Marketing Manager', type: 'vertical', difficulty: 'moderate' },
            { role: 'SEO Specialist', type: 'specialization', difficulty: 'easy' },
            { role: 'Content Marketing Manager', type: 'lateral', difficulty: 'easy' }
          );
        } else if (level === 'mid') {
          paths.push(
            { role: 'Senior Marketing Manager', type: 'vertical', difficulty: 'moderate' },
            { role: 'Marketing Director', type: 'management', difficulty: 'challenging' },
            { role: 'Growth Marketing Lead', type: 'specialization', difficulty: 'moderate' }
          );
        } else {
          paths.push(
            { role: 'VP of Marketing', type: 'executive', difficulty: 'challenging' },
            { role: 'CMO', type: 'executive', difficulty: 'very-challenging' },
            { role: 'Head of Growth', type: 'leadership', difficulty: 'challenging' }
          );
        }
      }
    }

    // Default paths if none matched
    if (paths.length === 0) {
      paths.push(
        { role: `Senior ${currentRole}`, type: 'vertical', difficulty: 'moderate' },
        { role: `${currentRole} Lead`, type: 'leadership', difficulty: 'moderate' },
        { role: `Manager, ${currentRole}`, type: 'management', difficulty: 'challenging' }
      );
    }

    return paths;
  }

  /**
   * Enrich career path with detailed information
   */
  enrichCareerPath(path, background) {
    const timeline = this.estimateTimeline(path, background);
    const requiredSkills = this.identifyRequiredSkills(path, background);
    const experienceGaps = this.identifyExperienceGaps(path, background);
    const certifications = this.suggestCertifications(path);
    const salary = this.estimateSalary(path, background);

    return {
      ...path,
      timeline,
      requiredSkills,
      experienceGaps,
      certifications,
      salary,
      actionSteps: this.generateActionSteps(path, requiredSkills, experienceGaps),
      successFactors: this.identifySuccessFactors(path)
    };
  }

  /**
   * Estimate timeline for career transition
   */
  estimateTimeline(path, background) {
    const baseTimelines = {
      'vertical': { min: 6, max: 18 }, // months
      'lateral': { min: 3, max: 12 },
      'specialization': { min: 6, max: 12 },
      'leadership': { min: 12, max: 24 },
      'management': { min: 12, max: 36 },
      'executive': { min: 24, max: 60 }
    };

    const timeline = baseTimelines[path.type] || { min: 6, max: 18 };

    // Adjust based on difficulty
    const difficultyMultipliers = {
      'easy': 0.7,
      'moderate': 1.0,
      'challenging': 1.3,
      'very-challenging': 1.5
    };

    const multiplier = difficultyMultipliers[path.difficulty] || 1.0;

    return {
      min: Math.round(timeline.min * multiplier),
      max: Math.round(timeline.max * multiplier),
      realistic: Math.round((timeline.min + timeline.max) / 2 * multiplier),
      formatted: this.formatTimeline(Math.round((timeline.min + timeline.max) / 2 * multiplier))
    };
  }

  /**
   * Format timeline as human-readable string
   */
  formatTimeline(months) {
    if (months < 6) return `${months} months`;
    if (months < 12) return '6-12 months';
    if (months < 24) return '1-2 years';
    if (months < 36) return '2-3 years';
    return '3+ years';
  }

  /**
   * Identify required skills for target role
   */
  identifyRequiredSkills(path, background) {
    const roleLower = path.role.toLowerCase();
    const currentSkills = background.skills.map(s => s.toLowerCase());

    let required = [];

    // Leadership/Management roles
    if (path.type === 'leadership' || path.type === 'management') {
      required = [
        'Team Leadership',
        'People Management',
        'Strategic Planning',
        'Communication',
        'Conflict Resolution',
        'Performance Management'
      ];
    }

    // Executive roles
    if (path.type === 'executive') {
      required = [
        'Strategic Vision',
        'Business Acumen',
        'Executive Communication',
        'P&L Management',
        'Board Presentations',
        'Organizational Leadership'
      ];
    }

    // Technical roles
    if (roleLower.includes('senior') || roleLower.includes('staff') || roleLower.includes('principal')) {
      required.push(
        'System Design',
        'Mentoring',
        'Technical Leadership',
        'Architecture',
        'Code Review'
      );
    }

    // Specialization roles
    if (roleLower.includes('architect')) {
      required.push('System Architecture', 'Design Patterns', 'Scalability', 'Cloud Architecture');
    }

    if (roleLower.includes('data') || roleLower.includes('ml')) {
      required.push('Statistical Analysis', 'Machine Learning', 'Data Pipelines', 'Model Deployment');
    }

    // Filter out skills already possessed
    const missing = required.filter(skill =>
      !currentSkills.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
    );

    return {
      total: required,
      alreadyHave: required.filter(skill =>
        currentSkills.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
      ),
      needToAcquire: missing
    };
  }

  /**
   * Identify experience gaps
   */
  identifyExperienceGaps(path, background) {
    const gaps = [];

    // Management transition
    if (path.type === 'management' && !background.currentRole.toLowerCase().includes('manager')) {
      gaps.push({
        gap: 'Management Experience',
        description: 'No formal people management experience',
        recommendation: 'Start by mentoring junior team members or leading small projects'
      });
    }

    // Leadership transition
    if (path.type === 'leadership' && background.level === 'entry') {
      gaps.push({
        gap: 'Leadership Experience',
        description: 'Limited leadership opportunities',
        recommendation: 'Take ownership of projects, lead initiatives, mentor others'
      });
    }

    // Technical depth
    if (path.role.toLowerCase().includes('senior') || path.role.toLowerCase().includes('staff')) {
      gaps.push({
        gap: 'Technical Depth',
        description: 'Need deeper expertise in core technologies',
        recommendation: 'Focus on mastering system design, architecture, and best practices'
      });
    }

    // Cross-functional experience
    if (path.type === 'executive') {
      gaps.push({
        gap: 'Cross-Functional Leadership',
        description: 'Need experience working across departments',
        recommendation: 'Seek opportunities to collaborate with other teams (product, sales, etc.)'
      });
    }

    return gaps;
  }

  /**
   * Suggest certifications for career path
   */
  suggestCertifications(path) {
    const roleLower = path.role.toLowerCase();
    const certifications = [];

    // Cloud certifications
    if (roleLower.includes('cloud') || roleLower.includes('architect')) {
      certifications.push(
        { name: 'AWS Solutions Architect', priority: 'high', cost: '$300', time: '2-3 months' },
        { name: 'Google Cloud Professional', priority: 'medium', cost: '$200', time: '1-2 months' }
      );
    }

    // Data/ML certifications
    if (roleLower.includes('data') || roleLower.includes('ml') || roleLower.includes('ai')) {
      certifications.push(
        { name: 'AWS Machine Learning Specialty', priority: 'high', cost: '$300', time: '2-3 months' },
        { name: 'TensorFlow Developer Certificate', priority: 'medium', cost: '$100', time: '1 month' }
      );
    }

    // Management certifications
    if (roleLower.includes('manager') || roleLower.includes('director')) {
      certifications.push(
        { name: 'PMP (Project Management Professional)', priority: 'medium', cost: '$555', time: '3-4 months' },
        { name: 'Scrum Master Certification', priority: 'low', cost: '$150', time: '1 month' }
      );
    }

    // Product certifications
    if (roleLower.includes('product')) {
      certifications.push(
        { name: 'Certified Product Manager', priority: 'high', cost: '$2000', time: '2-3 months' },
        { name: 'Product School Certification', priority: 'medium', cost: '$1500', time: '1-2 months' }
      );
    }

    // Finance certifications
    if (roleLower.includes('finance') || roleLower.includes('financial')) {
      certifications.push(
        { name: 'CFA (Chartered Financial Analyst)', priority: 'high', cost: '$4000', time: '12+ months' },
        { name: 'CPA (Certified Public Accountant)', priority: 'high', cost: '$3000', time: '12+ months' }
      );
    }

    return certifications;
  }

  /**
   * Estimate salary for target role
   */
  estimateSalary(path, background) {
    // Base salary estimates by role level
    const baseSalaries = {
      'entry': { min: 60000, max: 90000 },
      'mid': { min: 90000, max: 140000 },
      'senior': { min: 130000, max: 200000 },
      'lead': { min: 150000, max: 220000 },
      'manager': { min: 140000, max: 210000 },
      'director': { min: 170000, max: 260000 },
      'vp': { min: 220000, max: 350000 },
      'executive': { min: 250000, max: 500000 }
    };

    // Determine level from role
    const roleLower = path.role.toLowerCase();
    let level = 'mid';

    if (roleLower.includes('vp') || roleLower.includes('cto') || roleLower.includes('cmo') || roleLower.includes('cfo')) {
      level = 'executive';
    } else if (roleLower.includes('director')) {
      level = 'director';
    } else if (roleLower.includes('manager') || roleLower.includes('head of')) {
      level = 'manager';
    } else if (roleLower.includes('lead') || roleLower.includes('principal') || roleLower.includes('staff')) {
      level = 'lead';
    } else if (roleLower.includes('senior')) {
      level = 'senior';
    } else if (roleLower.includes('junior') || roleLower.includes('entry')) {
      level = 'entry';
    }

    const base = baseSalaries[level] || baseSalaries.mid;

    // Adjust for industry
    const industryMultipliers = {
      'technology': 1.2,
      'finance': 1.15,
      'healthcare': 1.0,
      'marketing': 0.95,
      'manufacturing': 0.9
    };

    const multiplier = industryMultipliers[background.industry] || 1.0;

    return {
      range: {
        min: Math.round(base.min * multiplier),
        max: Math.round(base.max * multiplier)
      },
      median: Math.round((base.min + base.max) / 2 * multiplier),
      factors: [
        'Industry: ' + (background.industry || 'varies'),
        'Location: Not adjusted',
        'Company size: Not adjusted',
        'Experience: ' + (background.yearsExperience || 'varies') + ' years'
      ]
    };
  }

  /**
   * Generate action steps for career path
   */
  generateActionSteps(path, requiredSkills, experienceGaps) {
    const steps = [];

    // Skill acquisition
    if (requiredSkills.needToAcquire.length > 0) {
      steps.push({
        step: 1,
        action: 'Acquire Missing Skills',
        details: `Focus on learning: ${requiredSkills.needToAcquire.slice(0, 3).join(', ')}`,
        timeframe: '1-3 months'
      });
    }

    // Experience building
    if (experienceGaps.length > 0) {
      steps.push({
        step: 2,
        action: 'Build Relevant Experience',
        details: experienceGaps[0].recommendation,
        timeframe: '3-6 months'
      });
    }

    // Network and visibility
    steps.push({
      step: 3,
      action: 'Build Network and Visibility',
      details: 'Connect with professionals in target role, share knowledge, attend industry events',
      timeframe: 'Ongoing'
    });

    // Apply and interview
    steps.push({
      step: 4,
      action: 'Target Job Applications',
      details: 'Apply to 10-15 positions that match the target role',
      timeframe: 'When ready'
    });

    return steps;
  }

  /**
   * Identify success factors
   */
  identifySuccessFactors(path) {
    const factors = [];

    if (path.type === 'vertical') {
      factors.push(
        'Consistently deliver high-quality work',
        'Take on increasing responsibility',
        'Demonstrate expertise in core skills'
      );
    }

    if (path.type === 'management' || path.type === 'leadership') {
      factors.push(
        'Develop strong communication skills',
        'Build relationships across teams',
        'Show ability to mentor and develop others',
        'Demonstrate strategic thinking'
      );
    }

    if (path.type === 'specialization') {
      factors.push(
        'Become subject matter expert',
        'Share knowledge through blogs/talks',
        'Contribute to community/open source'
      );
    }

    if (path.type === 'executive') {
      factors.push(
        'Build executive presence',
        'Demonstrate business acumen',
        'Show track record of driving results',
        'Develop strategic vision'
      );
    }

    return factors;
  }

  /**
   * Assess market demand for career paths
   */
  assessMarketDemand(paths) {
    // Simplified demand assessment
    const demand = {
      overall: 'moderate',
      byPath: []
    };

    paths.forEach(path => {
      const roleLower = path.role.toLowerCase();
      let level = 'moderate';

      // High demand roles
      if (roleLower.includes('software engineer') ||
          roleLower.includes('data scientist') ||
          roleLower.includes('ml engineer') ||
          roleLower.includes('cloud')) {
        level = 'high';
      }

      // Very high demand
      if (roleLower.includes('senior') && roleLower.includes('engineer')) {
        level = 'very-high';
      }

      // Lower demand
      if (roleLower.includes('executive') || roleLower.includes('vp')) {
        level = 'low'; // Fewer positions available
      }

      demand.byPath.push({
        role: path.role,
        demand: level
      });
    });

    return demand;
  }

  /**
   * Generate general recommendations
   */
  generateGeneralRecommendations(background, paths) {
    const recommendations = [];

    // Based on experience level
    if (background.yearsExperience < 3) {
      recommendations.push('Focus on building foundational skills and gaining diverse experience');
      recommendations.push('Seek mentorship from senior professionals');
    } else if (background.yearsExperience < 8) {
      recommendations.push('Start specializing or developing leadership skills');
      recommendations.push('Build a professional network in your target area');
    } else {
      recommendations.push('Consider strategic career moves that align with long-term goals');
      recommendations.push('Leverage your experience to mentor others');
    }

    // Based on path types
    const hasManagement = paths.some(p => p.type === 'management');
    const hasTechnical = paths.some(p => p.type === 'specialization' || p.type === 'vertical');

    if (hasManagement && hasTechnical) {
      recommendations.push('Decide between individual contributor (IC) and management track - both are viable');
    }

    // Industry-specific
    if (background.industry === 'technology') {
      recommendations.push('Keep technical skills current - technology evolves rapidly');
    }

    return recommendations;
  }
}

// Create global instance
const careerProgressionEngine = new CareerProgressionEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CareerProgressionEngine, careerProgressionEngine };
}
