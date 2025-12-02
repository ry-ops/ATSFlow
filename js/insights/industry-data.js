/**
 * Industry Benchmarking Data Repository
 * Provides comprehensive industry-specific standards and benchmarks
 */

const IndustryData = {
  /**
   * Technology Sector Benchmarks
   */
  technology: {
    name: 'Technology',
    description: 'Software, SaaS, IT Services, and Tech Startups',

    roles: {
      'software-engineer': {
        title: 'Software Engineer',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 70000, max: 95000 },
            criticalSkills: ['JavaScript', 'Python', 'Git', 'SQL', 'REST APIs'],
            valuableSkills: ['React', 'Node.js', 'TypeScript', 'Docker', 'CI/CD'],
            emergingSkills: ['GraphQL', 'Kubernetes', 'Microservices', 'WebAssembly'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.6, // 60% of bullets should have metrics
            skillDensity: 8-12, // total technical skills
            certifications: ['AWS Certified Developer', 'Google Cloud Associate']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 95000, max: 140000 },
            criticalSkills: ['System Design', 'Microservices', 'CI/CD', 'Testing', 'Cloud (AWS/GCP/Azure)'],
            valuableSkills: ['Kubernetes', 'GraphQL', 'TypeScript', 'Architecture', 'Performance Optimization'],
            emergingSkills: ['Service Mesh', 'Observability', 'Platform Engineering', 'AI/ML Integration'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.75,
            skillDensity: 12-18,
            certifications: ['AWS Solutions Architect', 'Kubernetes Admin', 'Google Cloud Professional']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 130000, max: 200000 },
            criticalSkills: ['Architecture', 'System Design', 'Team Leadership', 'Distributed Systems', 'Scalability'],
            valuableSkills: ['Mentoring', 'Technical Strategy', 'Cross-team Collaboration', 'Cost Optimization'],
            emergingSkills: ['AI/ML Architecture', 'Edge Computing', 'Serverless', 'Platform Engineering'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.85,
            skillDensity: 15-25,
            certifications: ['AWS Solutions Architect Professional', 'TOGAF', 'System Design Expert']
          }
        }
      },
      'data-scientist': {
        title: 'Data Scientist',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 80000, max: 110000 },
            criticalSkills: ['Python', 'R', 'SQL', 'Statistics', 'Machine Learning'],
            valuableSkills: ['Pandas', 'NumPy', 'Scikit-learn', 'Visualization', 'A/B Testing'],
            emergingSkills: ['Deep Learning', 'NLP', 'PyTorch', 'TensorFlow', 'MLOps'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.7,
            skillDensity: 10-15,
            certifications: ['Google Data Analytics', 'AWS Machine Learning']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 110000, max: 160000 },
            criticalSkills: ['ML Algorithms', 'Deep Learning', 'NLP', 'Feature Engineering', 'Model Deployment'],
            valuableSkills: ['PyTorch', 'TensorFlow', 'MLOps', 'Big Data (Spark)', 'Cloud ML'],
            emergingSkills: ['LLMs', 'Generative AI', 'Reinforcement Learning', 'AutoML'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.8,
            skillDensity: 15-20,
            certifications: ['AWS ML Specialty', 'TensorFlow Developer', 'Azure Data Scientist']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 150000, max: 230000 },
            criticalSkills: ['ML Strategy', 'Research', 'Team Leadership', 'Production ML', 'Business Impact'],
            valuableSkills: ['Research Papers', 'MLOps Architecture', 'Cross-functional Leadership', 'Ethics'],
            emergingSkills: ['Generative AI', 'Foundation Models', 'Responsible AI', 'Edge ML'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.9,
            skillDensity: 18-25,
            certifications: ['Google ML Engineer', 'AWS ML Specialty', 'Research Publications']
          }
        }
      },
      'product-manager': {
        title: 'Product Manager',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 75000, max: 100000 },
            criticalSkills: ['Product Roadmap', 'User Stories', 'Agile/Scrum', 'Analytics', 'Stakeholder Management'],
            valuableSkills: ['SQL', 'Wireframing', 'A/B Testing', 'Customer Research', 'Jira'],
            emergingSkills: ['Product Analytics', 'Data-Driven Decisions', 'Growth Metrics', 'User Research'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.65,
            skillDensity: 6-10,
            certifications: ['CSPO', 'Pragmatic Marketing', 'Product School']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 100000, max: 150000 },
            criticalSkills: ['Product Strategy', 'Go-to-Market', 'Cross-functional Leadership', 'Data Analysis', 'Pricing'],
            valuableSkills: ['Product-Market Fit', 'Competitive Analysis', 'OKRs', 'Experimentation', 'API Products'],
            emergingSkills: ['AI Product Management', 'Platform Products', 'Developer Experience', 'Product-Led Growth'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.75,
            skillDensity: 10-15,
            certifications: ['Certified Product Manager', 'SAFe Product Owner', 'Reforge Product']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 140000, max: 220000 },
            criticalSkills: ['Product Vision', 'Business Strategy', 'Team Leadership', 'P&L Management', 'Execution'],
            valuableSkills: ['M&A Integration', 'Platform Strategy', 'Ecosystem Building', 'Revenue Growth'],
            emergingSkills: ['AI/ML Products', 'Marketplace Dynamics', 'Two-sided Networks', 'Enterprise SaaS'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.85,
            skillDensity: 12-20,
            certifications: ['Product Leadership', 'Executive Certifications', 'Industry Thought Leader']
          }
        }
      }
    }
  },

  /**
   * Finance & Banking Sector Benchmarks
   */
  finance: {
    name: 'Finance & Banking',
    description: 'Investment Banking, Financial Services, FinTech',

    roles: {
      'financial-analyst': {
        title: 'Financial Analyst',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 60000, max: 80000 },
            criticalSkills: ['Excel', 'Financial Modeling', 'Data Analysis', 'SQL', 'PowerPoint'],
            valuableSkills: ['Tableau', 'Python', 'Bloomberg Terminal', 'Budgeting', 'Forecasting'],
            emergingSkills: ['Power BI', 'Automation', 'Data Visualization', 'R'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.8, // Finance emphasizes numbers
            skillDensity: 6-10,
            certifications: ['CFA Level 1', 'Excel Expert', 'Bloomberg Certification']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 80000, max: 120000 },
            criticalSkills: ['Financial Planning', 'Variance Analysis', 'Strategic Planning', 'Leadership', 'Reporting'],
            valuableSkills: ['FP&A', 'Business Partnering', 'Process Improvement', 'Automation', 'Consolidations'],
            emergingSkills: ['Predictive Analytics', 'Machine Learning', 'AI-driven Forecasting', 'Cloud Finance Tools'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.85,
            skillDensity: 10-15,
            certifications: ['CFA Level 2/3', 'CPA', 'FP&A Certification']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 115000, max: 180000 },
            criticalSkills: ['Strategic Finance', 'M&A', 'Investor Relations', 'Team Management', 'Executive Reporting'],
            valuableSkills: ['Board Presentations', 'Capital Allocation', 'Risk Management', 'Compliance', 'IPO Experience'],
            emergingSkills: ['ESG Reporting', 'Crypto Finance', 'Digital Assets', 'AI Analytics'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.9,
            skillDensity: 12-18,
            certifications: ['CFA Charter', 'CPA', 'MBA Finance']
          }
        }
      }
    }
  },

  /**
   * Healthcare Sector Benchmarks
   */
  healthcare: {
    name: 'Healthcare',
    description: 'Healthcare IT, Medical Devices, Pharmaceuticals, Clinical',

    roles: {
      'healthcare-analyst': {
        title: 'Healthcare Data Analyst',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 55000, max: 75000 },
            criticalSkills: ['Healthcare Data', 'SQL', 'Excel', 'HIPAA Compliance', 'EHR Systems'],
            valuableSkills: ['Claims Analysis', 'Epic', 'Cerner', 'Tableau', 'Quality Metrics'],
            emergingSkills: ['Healthcare Analytics', 'Population Health', 'Value-Based Care', 'Interoperability'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.7,
            skillDensity: 8-12,
            certifications: ['RHIA', 'RHIT', 'CHDA', 'Healthcare Analytics']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 75000, max: 110000 },
            criticalSkills: ['Clinical Analytics', 'Quality Improvement', 'Data Governance', 'Reporting', 'Compliance'],
            valuableSkills: ['Machine Learning', 'Predictive Modeling', 'HL7/FHIR', 'Risk Stratification'],
            emergingSkills: ['AI in Healthcare', 'Remote Monitoring', 'Genomics Data', 'Real-World Evidence'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.8,
            skillDensity: 12-16,
            certifications: ['CHDA', 'CPC', 'Six Sigma Healthcare']
          }
        }
      }
    }
  },

  /**
   * Marketing & Creative Sector Benchmarks
   */
  marketing: {
    name: 'Marketing & Creative',
    description: 'Digital Marketing, Content, Brand, Growth',

    roles: {
      'digital-marketer': {
        title: 'Digital Marketing Manager',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 45000, max: 65000 },
            criticalSkills: ['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing'],
            valuableSkills: ['Google Ads', 'Facebook Ads', 'Email Marketing', 'HubSpot', 'A/B Testing'],
            emergingSkills: ['Marketing Automation', 'Conversion Rate Optimization', 'Growth Hacking', 'TikTok Marketing'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.7,
            skillDensity: 8-12,
            certifications: ['Google Ads', 'Google Analytics', 'HubSpot', 'Facebook Blueprint']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 65000, max: 100000 },
            criticalSkills: ['Marketing Strategy', 'Campaign Management', 'Analytics', 'Budget Management', 'Team Leadership'],
            valuableSkills: ['Marketing Attribution', 'Multi-channel Campaigns', 'Marketing Mix Modeling', 'Customer Journey'],
            emergingSkills: ['AI-Powered Marketing', 'Programmatic Advertising', 'Influencer Marketing', 'Web3 Marketing'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.8,
            skillDensity: 10-16,
            certifications: ['Professional Marketer', 'Advanced Google Analytics', 'Marketing Automation']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 95000, max: 160000 },
            criticalSkills: ['Marketing Leadership', 'Brand Strategy', 'Revenue Growth', 'Team Building', 'Budget Management'],
            valuableSkills: ['Product-Market Fit', 'Go-to-Market Strategy', 'Customer Acquisition', 'Retention'],
            emergingSkills: ['Growth Marketing', 'Product-Led Growth', 'Community Building', 'Web3 Engagement'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.85,
            skillDensity: 12-20,
            certifications: ['CMO Certification', 'Growth Marketing', 'Executive Marketing Leadership']
          }
        }
      }
    }
  },

  /**
   * Manufacturing & Operations Sector Benchmarks
   */
  manufacturing: {
    name: 'Manufacturing & Operations',
    description: 'Manufacturing, Supply Chain, Operations, Logistics',

    roles: {
      'operations-manager': {
        title: 'Operations Manager',
        experienceLevels: {
          entry: {
            yearsRange: [0, 2],
            salaryRange: { min: 50000, max: 70000 },
            criticalSkills: ['Process Improvement', 'Lean', 'Six Sigma', 'Project Management', 'Data Analysis'],
            valuableSkills: ['Supply Chain', 'Inventory Management', 'Quality Control', 'Excel', 'ERP Systems'],
            emergingSkills: ['Automation', 'Industry 4.0', 'IoT', 'Predictive Maintenance'],
            expectedBulletPoints: 4-6,
            quantificationRate: 0.75,
            skillDensity: 6-10,
            certifications: ['Six Sigma Green Belt', 'Lean', 'PMP']
          },
          mid: {
            yearsRange: [3, 7],
            salaryRange: { min: 70000, max: 110000 },
            criticalSkills: ['Operations Strategy', 'Team Management', 'Continuous Improvement', 'Cost Reduction', 'KPIs'],
            valuableSkills: ['Change Management', 'Cross-functional Leadership', 'Vendor Management', 'Capacity Planning'],
            emergingSkills: ['Smart Manufacturing', 'Digital Twins', 'AI Optimization', 'Sustainability'],
            expectedBulletPoints: 5-7,
            quantificationRate: 0.85,
            skillDensity: 10-15,
            certifications: ['Six Sigma Black Belt', 'PMP', 'APICS CSCP']
          },
          senior: {
            yearsRange: [8, 15],
            salaryRange: { min: 105000, max: 170000 },
            criticalSkills: ['Strategic Planning', 'P&L Management', 'Organizational Leadership', 'Operational Excellence'],
            valuableSkills: ['M&A Integration', 'Global Operations', 'Supply Chain Resilience', 'Digital Transformation'],
            emergingSkills: ['Sustainable Operations', 'Circular Economy', 'AI-Driven Supply Chain', 'Resilience Planning'],
            expectedBulletPoints: 6-8,
            quantificationRate: 0.9,
            skillDensity: 12-18,
            certifications: ['Six Sigma Master Black Belt', 'APICS CPIM', 'Executive Operations']
          }
        }
      }
    }
  },

  /**
   * Company Size Expectations
   */
  companySize: {
    startup: {
      name: 'Startup (1-50 employees)',
      expectations: {
        roleFlexibility: 'high', // Wear multiple hats
        skillBreadth: 'broad', // Generalist skills valued
        formalProcesses: 'low',
        innovationEmphasis: 'very high',
        workLifeBalance: 'flexible but intense',
        compensationStructure: 'lower base + equity',
        growthOpportunity: 'very high',
        preferredSkills: ['Full-stack', 'Self-starter', 'Ambiguity tolerance', 'Scrappy', 'Fast execution']
      }
    },
    scaleup: {
      name: 'Scale-up (51-500 employees)',
      expectations: {
        roleFlexibility: 'medium',
        skillBreadth: 'balanced', // Some specialization emerging
        formalProcesses: 'medium',
        innovationEmphasis: 'high',
        workLifeBalance: 'moderate',
        compensationStructure: 'competitive base + equity',
        growthOpportunity: 'high',
        preferredSkills: ['Specialization', 'Process building', 'Scalability', 'Leadership', 'Systems thinking']
      }
    },
    enterprise: {
      name: 'Enterprise (500+ employees)',
      expectations: {
        roleFlexibility: 'low',
        skillBreadth: 'specialized', // Deep expertise in narrow area
        formalProcesses: 'high',
        innovationEmphasis: 'medium',
        workLifeBalance: 'structured',
        compensationStructure: 'higher base + benefits',
        growthOpportunity: 'medium',
        preferredSkills: ['Deep expertise', 'Cross-team collaboration', 'Compliance', 'Politics navigation', 'Documentation']
      }
    }
  },

  /**
   * Work Environment Optimizations
   */
  workEnvironment: {
    remote: {
      name: 'Remote Work',
      emphasize: [
        'Self-motivation',
        'Written communication',
        'Async collaboration',
        'Time management',
        'Virtual presentation skills',
        'Remote tools proficiency (Zoom, Slack, etc.)',
        'Results-oriented achievements',
        'Cross-timezone coordination'
      ],
      deemphasize: [
        'Office presence',
        'In-person presentations',
        'Geographic location'
      ]
    },
    hybrid: {
      name: 'Hybrid Work',
      emphasize: [
        'Flexibility',
        'Both written and verbal communication',
        'Collaboration tools',
        'Adaptability',
        'In-person and remote effectiveness'
      ]
    },
    onsite: {
      name: 'On-site Work',
      emphasize: [
        'Team collaboration',
        'In-person leadership',
        'Face-to-face communication',
        'Office culture fit',
        'Local market knowledge'
      ]
    }
  },

  /**
   * Get industry by name
   */
  getIndustry(industryName) {
    const normalized = industryName.toLowerCase().replace(/\s+/g, '-');
    const mapping = {
      'technology': this.technology,
      'tech': this.technology,
      'software': this.technology,
      'finance': this.finance,
      'banking': this.finance,
      'fintech': this.finance,
      'healthcare': this.healthcare,
      'medical': this.healthcare,
      'marketing': this.marketing,
      'creative': this.marketing,
      'digital-marketing': this.marketing,
      'manufacturing': this.manufacturing,
      'operations': this.manufacturing,
      'supply-chain': this.manufacturing
    };
    return mapping[normalized] || null;
  },

  /**
   * Get role within industry
   */
  getRole(industryName, roleName) {
    const industry = this.getIndustry(industryName);
    if (!industry) return null;

    const normalized = roleName.toLowerCase().replace(/\s+/g, '-');
    return industry.roles[normalized] || null;
  },

  /**
   * Get experience level for role
   */
  getExperienceLevel(industryName, roleName, yearsExperience) {
    const role = this.getRole(industryName, roleName);
    if (!role) return null;

    for (const [level, data] of Object.entries(role.experienceLevels)) {
      const [min, max] = data.yearsRange;
      if (yearsExperience >= min && yearsExperience <= max) {
        return { level, ...data };
      }
    }

    // If years exceed all ranges, return senior
    return { level: 'senior', ...role.experienceLevels.senior };
  },

  /**
   * Get all available industries
   */
  getAllIndustries() {
    return [
      { id: 'technology', name: this.technology.name, description: this.technology.description },
      { id: 'finance', name: this.finance.name, description: this.finance.description },
      { id: 'healthcare', name: this.healthcare.name, description: this.healthcare.description },
      { id: 'marketing', name: this.marketing.name, description: this.marketing.description },
      { id: 'manufacturing', name: this.manufacturing.name, description: this.manufacturing.description }
    ];
  },

  /**
   * Get all roles for an industry
   */
  getRolesForIndustry(industryName) {
    const industry = this.getIndustry(industryName);
    if (!industry) return [];

    return Object.entries(industry.roles).map(([id, data]) => ({
      id,
      title: data.title
    }));
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IndustryData;
}
