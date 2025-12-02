/**
 * Skills Gap Analyzer
 * Identifies missing skills and provides learning recommendations
 */

class SkillsGapAnalyzer {
  constructor() {
    this.storageKey = 'resumate_skills_gap_v1';
  }

  /**
   * Analyze skill gaps for a career transition
   * @param {string[]} currentSkills - Current skills from resume
   * @param {string} targetRole - Target role (e.g., 'software-engineer')
   * @param {string} industry - Target industry (e.g., 'technology')
   * @returns {Object} - Comprehensive skills gap analysis
   */
  analyzeGap(currentSkills, targetRole, industry) {
    // Get benchmark data for target role
    const benchmark = IndustryData.getRole(industry, targetRole);
    if (!benchmark) {
      throw new Error(`No benchmark data found for ${targetRole} in ${industry}`);
    }

    // Determine experience level (default to entry if not specified)
    const experienceLevel = benchmark.experienceLevels.entry;

    // Normalize skills for comparison
    const normalizedCurrent = this.normalizeSkills(currentSkills);

    // Identify gaps
    const criticalGaps = this.identifyGaps(
      normalizedCurrent,
      experienceLevel.criticalSkills || []
    );

    const valuableGaps = this.identifyGaps(
      normalizedCurrent,
      experienceLevel.valuableSkills || []
    );

    const emergingGaps = this.identifyGaps(
      normalizedCurrent,
      experienceLevel.emergingSkills || []
    );

    // Identify transferable skills
    const transferable = this.identifyTransferableSkills(
      normalizedCurrent,
      [...(experienceLevel.criticalSkills || []), ...(experienceLevel.valuableSkills || [])]
    );

    // Create learning paths
    const learningPaths = this.createLearningPaths(criticalGaps, valuableGaps, emergingGaps);

    // Identify skills to de-emphasize
    const toDeemphasize = this.identifySkillsToDeemphasize(currentSkills, experienceLevel);

    return {
      critical: {
        missing: criticalGaps,
        count: criticalGaps.length,
        priority: 'Must-have for this role'
      },
      valuable: {
        missing: valuableGaps,
        count: valuableGaps.length,
        priority: 'Nice-to-have, enhances competitiveness'
      },
      emerging: {
        missing: emergingGaps,
        count: emergingGaps.length,
        priority: 'Future-proofing your career'
      },
      transferable: {
        skills: transferable,
        count: transferable.length,
        advice: 'Emphasize these on your resume'
      },
      toDeemphasize: {
        skills: toDeemphasize,
        count: toDeemphasize.length,
        advice: 'Consider removing or minimizing these'
      },
      learningPaths,
      summary: this.generateGapSummary(criticalGaps, valuableGaps, emergingGaps, transferable)
    };
  }

  /**
   * Normalize skills for consistent comparison
   */
  normalizeSkills(skills) {
    return skills.map(skill => ({
      original: skill,
      normalized: skill.toLowerCase().trim(),
      keywords: this.extractKeywords(skill)
    }));
  }

  /**
   * Extract keywords from skill name
   */
  extractKeywords(skill) {
    // Remove common suffixes/prefixes and split
    const cleaned = skill
      .toLowerCase()
      .replace(/\s+(framework|library|tool|platform|api|sdk)\s*/gi, '')
      .replace(/[^a-z0-9\s+#.]/gi, ' ');

    return cleaned.split(/\s+/).filter(k => k.length > 1);
  }

  /**
   * Identify missing skills (gaps)
   */
  identifyGaps(currentSkills, requiredSkills) {
    const gaps = [];

    requiredSkills.forEach(required => {
      const requiredNorm = required.toLowerCase().trim();
      const requiredKeywords = this.extractKeywords(required);

      // Check if skill exists in current skills
      const hasSkill = currentSkills.some(current => {
        // Direct match
        if (current.normalized === requiredNorm) return true;
        if (current.normalized.includes(requiredNorm)) return true;
        if (requiredNorm.includes(current.normalized)) return true;

        // Keyword match
        const keywordMatch = requiredKeywords.some(rk =>
          current.keywords.some(ck => ck === rk || ck.includes(rk) || rk.includes(ck))
        );
        return keywordMatch;
      });

      if (!hasSkill) {
        gaps.push(required);
      }
    });

    return gaps;
  }

  /**
   * Identify transferable skills
   */
  identifyTransferableSkills(currentSkills, targetSkills) {
    const transferable = [];

    currentSkills.forEach(current => {
      const hasMatch = targetSkills.some(target => {
        const targetNorm = target.toLowerCase().trim();
        const targetKeywords = this.extractKeywords(target);

        // Check for matches
        if (current.normalized === targetNorm) return true;
        if (current.normalized.includes(targetNorm)) return true;
        if (targetNorm.includes(current.normalized)) return true;

        // Keyword overlap
        const overlap = current.keywords.filter(ck =>
          targetKeywords.some(tk => tk === ck || tk.includes(ck) || ck.includes(tk))
        );
        return overlap.length > 0;
      });

      if (hasMatch) {
        transferable.push(current.original);
      }
    });

    return [...new Set(transferable)]; // Remove duplicates
  }

  /**
   * Identify skills to de-emphasize
   */
  identifySkillsToDeemphasize(currentSkills, experienceLevel) {
    const toDeemphasize = [];
    const allRelevant = [
      ...(experienceLevel.criticalSkills || []),
      ...(experienceLevel.valuableSkills || []),
      ...(experienceLevel.emergingSkills || [])
    ].map(s => s.toLowerCase());

    // Skills that don't match any relevant skills for target role
    currentSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const isRelevant = allRelevant.some(rel =>
        skillLower.includes(rel) || rel.includes(skillLower)
      );

      if (!isRelevant && !this.isCommonTransferableSkill(skill)) {
        toDeemphasize.push(skill);
      }
    });

    return toDeemphasize;
  }

  /**
   * Check if skill is commonly transferable
   */
  isCommonTransferableSkill(skill) {
    const commonSkills = [
      'communication', 'leadership', 'teamwork', 'problem solving',
      'project management', 'agile', 'scrum', 'git', 'testing',
      'documentation', 'collaboration', 'analysis', 'research'
    ];

    const skillLower = skill.toLowerCase();
    return commonSkills.some(common => skillLower.includes(common));
  }

  /**
   * Create learning paths for missing skills
   */
  createLearningPaths(critical, valuable, emerging) {
    const paths = [];

    // Critical skills learning path
    if (critical.length > 0) {
      const criticalPath = {
        name: 'Essential Skills Track',
        priority: 'high',
        timeline: this.estimateTimeline(critical, 'critical'),
        skills: critical.map(skill => ({
          skill,
          estimatedTime: this.estimateSkillTime(skill, 'critical'),
          resources: this.suggestResources(skill),
          alternatives: this.suggestAlternatives(skill)
        }))
      };
      paths.push(criticalPath);
    }

    // Valuable skills learning path
    if (valuable.length > 0) {
      const valuablePath = {
        name: 'Competitive Edge Track',
        priority: 'medium',
        timeline: this.estimateTimeline(valuable, 'valuable'),
        skills: valuable.slice(0, 5).map(skill => ({ // Limit to top 5
          skill,
          estimatedTime: this.estimateSkillTime(skill, 'valuable'),
          resources: this.suggestResources(skill),
          alternatives: this.suggestAlternatives(skill)
        }))
      };
      paths.push(valuablePath);
    }

    // Emerging skills learning path
    if (emerging.length > 0) {
      const emergingPath = {
        name: 'Future-Ready Track',
        priority: 'low',
        timeline: this.estimateTimeline(emerging, 'emerging'),
        skills: emerging.slice(0, 3).map(skill => ({ // Limit to top 3
          skill,
          estimatedTime: this.estimateSkillTime(skill, 'emerging'),
          resources: this.suggestResources(skill),
          alternatives: this.suggestAlternatives(skill)
        }))
      };
      paths.push(emergingPath);
    }

    return paths;
  }

  /**
   * Estimate timeline for learning a set of skills
   */
  estimateTimeline(skills, priority) {
    const timePerSkill = {
      critical: 4, // weeks
      valuable: 3,
      emerging: 2
    };

    const weeks = skills.length * (timePerSkill[priority] || 3);

    if (weeks <= 4) return '1 month';
    if (weeks <= 12) return `${Math.ceil(weeks / 4)} months`;
    return `${Math.ceil(weeks / 12)} months`;
  }

  /**
   * Estimate time to learn a specific skill
   */
  estimateSkillTime(skill, priority) {
    const skillLower = skill.toLowerCase();

    // Complex skills take longer
    const complexSkills = ['machine learning', 'deep learning', 'system design', 'architecture'];
    const isComplex = complexSkills.some(cs => skillLower.includes(cs));

    if (isComplex) {
      return priority === 'critical' ? '2-3 months' : '1-2 months';
    }

    // Programming languages
    if (this.isProgrammingLanguage(skill)) {
      return priority === 'critical' ? '6-8 weeks' : '4-6 weeks';
    }

    // Frameworks/libraries
    if (this.isFrameworkOrLibrary(skill)) {
      return '2-4 weeks';
    }

    // Tools
    return '1-2 weeks';
  }

  /**
   * Check if skill is a programming language
   */
  isProgrammingLanguage(skill) {
    const languages = ['python', 'javascript', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'];
    const skillLower = skill.toLowerCase();
    return languages.some(lang => skillLower === lang || skillLower.startsWith(lang + ' '));
  }

  /**
   * Check if skill is a framework or library
   */
  isFrameworkOrLibrary(skill) {
    const frameworks = ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'node.js', 'tensorflow', 'pytorch'];
    const skillLower = skill.toLowerCase();
    return frameworks.some(fw => skillLower.includes(fw));
  }

  /**
   * Suggest learning resources for a skill
   */
  suggestResources(skill) {
    const resources = [];
    const skillLower = skill.toLowerCase();

    // Generic resources based on skill type
    if (this.isProgrammingLanguage(skill)) {
      resources.push({
        type: 'Course',
        name: `${skill} on Coursera/Udemy`,
        free: false
      });
      resources.push({
        type: 'Documentation',
        name: `Official ${skill} docs`,
        free: true
      });
      resources.push({
        type: 'Practice',
        name: 'LeetCode/HackerRank',
        free: true
      });
    } else if (this.isFrameworkOrLibrary(skill)) {
      resources.push({
        type: 'Documentation',
        name: `Official ${skill} documentation`,
        free: true
      });
      resources.push({
        type: 'Tutorial',
        name: `${skill} tutorial on official site`,
        free: true
      });
      resources.push({
        type: 'Project',
        name: 'Build a real-world project',
        free: true
      });
    } else if (skillLower.includes('cloud') || skillLower.includes('aws') || skillLower.includes('azure') || skillLower.includes('gcp')) {
      resources.push({
        type: 'Certification',
        name: `${skill} Certification`,
        free: false
      });
      resources.push({
        type: 'Free Tier',
        name: 'Cloud provider free tier',
        free: true
      });
    } else {
      resources.push({
        type: 'Online Course',
        name: `${skill} course (Coursera/Udemy/Pluralsight)`,
        free: false
      });
      resources.push({
        type: 'YouTube',
        name: `${skill} tutorials on YouTube`,
        free: true
      });
    }

    return resources;
  }

  /**
   * Suggest alternative skills that could substitute
   */
  suggestAlternatives(skill) {
    const alternatives = {
      // Programming languages
      'python': ['Ruby', 'JavaScript'],
      'javascript': ['TypeScript', 'Python'],
      'java': ['C#', 'Kotlin'],
      'c++': ['Rust', 'Go'],

      // Frontend frameworks
      'react': ['Vue.js', 'Angular', 'Svelte'],
      'angular': ['React', 'Vue.js'],
      'vue': ['React', 'Svelte'],

      // Backend frameworks
      'node.js': ['Django', 'Flask', 'Spring Boot'],
      'django': ['Flask', 'Express.js', 'Ruby on Rails'],
      'express': ['Koa', 'Fastify', 'Django'],

      // Databases
      'postgresql': ['MySQL', 'MariaDB'],
      'mongodb': ['CouchDB', 'DynamoDB'],
      'mysql': ['PostgreSQL', 'MariaDB'],

      // Cloud
      'aws': ['Google Cloud', 'Azure'],
      'azure': ['AWS', 'Google Cloud'],
      'gcp': ['AWS', 'Azure'],
      'google cloud': ['AWS', 'Azure'],

      // ML/AI
      'tensorflow': ['PyTorch', 'JAX'],
      'pytorch': ['TensorFlow', 'JAX'],

      // DevOps
      'kubernetes': ['Docker Swarm', 'ECS'],
      'docker': ['Podman', 'containerd'],
      'jenkins': ['GitLab CI', 'GitHub Actions', 'CircleCI']
    };

    const skillLower = skill.toLowerCase();
    for (const [key, alts] of Object.entries(alternatives)) {
      if (skillLower.includes(key)) {
        return alts;
      }
    }

    return [];
  }

  /**
   * Generate gap summary
   */
  generateGapSummary(critical, valuable, emerging, transferable) {
    const summary = {
      totalGaps: critical.length + valuable.length + emerging.length,
      criticalGapCount: critical.length,
      transferableCount: transferable.length,
      readiness: this.calculateReadiness(critical, valuable, transferable),
      recommendation: ''
    };

    // Generate recommendation
    if (summary.criticalGapCount === 0) {
      summary.recommendation = 'You have all critical skills! Focus on valuable and emerging skills to stand out.';
    } else if (summary.criticalGapCount <= 2) {
      summary.recommendation = `Focus on acquiring ${summary.criticalGapCount} critical skill(s) first, then build valuable skills.`;
    } else {
      summary.recommendation = `Significant skill gap detected. Prioritize learning ${Math.min(3, summary.criticalGapCount)} critical skills immediately.`;
    }

    return summary;
  }

  /**
   * Calculate readiness score
   */
  calculateReadiness(critical, valuable, transferable) {
    // Readiness is based on:
    // - Having all critical skills (50%)
    // - Having valuable skills (30%)
    // - Having transferable skills (20%)

    const criticalScore = critical.length === 0 ? 50 : Math.max(0, 50 - (critical.length * 10));
    const valuableScore = Math.max(0, 30 - (valuable.length * 3));
    const transferableScore = Math.min(20, transferable.length * 2);

    const total = criticalScore + valuableScore + transferableScore;

    return {
      score: total,
      level: total >= 80 ? 'Ready' : total >= 60 ? 'Nearly Ready' : total >= 40 ? 'Developing' : 'Needs Work'
    };
  }

  /**
   * Get skill clusters (related skills)
   */
  getSkillClusters(skills) {
    const clusters = {
      'Frontend Development': ['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Webpack', 'Redux'],
      'Backend Development': ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'REST API', 'GraphQL', 'Microservices'],
      'Database': ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Database Design'],
      'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'AWS', 'Azure', 'Terraform', 'Ansible'],
      'Data Science': ['Python', 'R', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Statistics', 'Data Visualization'],
      'Machine Learning': ['TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Neural Networks', 'MLOps'],
      'Cloud Platforms': ['AWS', 'Azure', 'Google Cloud', 'Serverless', 'Lambda', 'S3', 'Cloud Architecture'],
      'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
      'Testing': ['Unit Testing', 'Integration Testing', 'Jest', 'Pytest', 'Selenium', 'Test Automation', 'TDD']
    };

    const result = {};

    Object.entries(clusters).forEach(([cluster, clusterSkills]) => {
      const matched = skills.filter(skill =>
        clusterSkills.some(cs => skill.toLowerCase().includes(cs.toLowerCase()) || cs.toLowerCase().includes(skill.toLowerCase()))
      );

      if (matched.length > 0) {
        result[cluster] = {
          has: matched,
          missing: clusterSkills.filter(cs => !matched.some(m => m.toLowerCase().includes(cs.toLowerCase())))
        };
      }
    });

    return result;
  }
}

// Create global instance
const skillsGapAnalyzer = new SkillsGapAnalyzer();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SkillsGapAnalyzer, skillsGapAnalyzer };
}
