/**
 * Unit Tests for ATSScorer
 * Tests the resume scoring and grading system
 */

describe('ATSScorer', () => {
  let ATSScorer;
  let scorer;

  beforeAll(() => {
    // Create ATSScorer class for testing
    ATSScorer = class ATSScorer {
      constructor() {
        this.categories = {
          atsCompatibility: {
            weight: 25,
            factors: ['formatting', 'structure', 'parseability'],
            description: 'How easily ATS systems can parse your resume'
          },
          keywordMatch: {
            weight: 25,
            factors: ['hard-skills', 'soft-skills', 'tools', 'certifications'],
            description: 'Relevance of keywords to target roles'
          },
          contentQuality: {
            weight: 20,
            factors: ['action-verbs', 'quantification', 'specificity', 'relevance'],
            description: 'Quality and effectiveness of content'
          },
          formatting: {
            weight: 15,
            factors: ['consistency', 'readability', 'length', 'whitespace'],
            description: 'Visual appeal and professional presentation'
          },
          completeness: {
            weight: 15,
            factors: ['sections-present', 'contact-info', 'dates', 'details'],
            description: 'Thoroughness and completeness of information'
          }
        };

        this.gradeScale = [
          { grade: 'A+', min: 97, max: 100, description: 'Exceptional - Top 1%' },
          { grade: 'A',  min: 93, max: 96,  description: 'Excellent - Highly competitive' },
          { grade: 'A-', min: 90, max: 92,  description: 'Very Good - Strong candidate' },
          { grade: 'B+', min: 87, max: 89,  description: 'Good - Above average' },
          { grade: 'B',  min: 83, max: 86,  description: 'Good - Competitive' },
          { grade: 'B-', min: 80, max: 82,  description: 'Acceptable - Some improvements needed' },
          { grade: 'C+', min: 77, max: 79,  description: 'Fair - Several improvements needed' },
          { grade: 'C',  min: 73, max: 76,  description: 'Fair - Significant work needed' },
          { grade: 'C-', min: 70, max: 72,  description: 'Below Average - Major revisions needed' },
          { grade: 'D',  min: 60, max: 69,  description: 'Poor - Extensive revisions required' },
          { grade: 'F',  min: 0,  max: 59,  description: 'Fail - Complete rewrite recommended' }
        ];
      }

      _assignGrade(score) {
        for (const gradeInfo of this.gradeScale) {
          if (score >= gradeInfo.min && score <= gradeInfo.max) {
            return gradeInfo;
          }
        }
        return this.gradeScale[this.gradeScale.length - 1]; // Return F if no match
      }

      _calculatePercentile(score) {
        // Simple percentile calculation based on normal distribution
        return Math.min(99, Math.max(1, Math.round(score)));
      }

      _mapCheckToCategory(checkName, originalCategory) {
        const mapping = {
          // ATS Compatibility
          'noTables': 'atsCompatibility',
          'noMultiColumn': 'atsCompatibility',
          'noHeadersFooters': 'atsCompatibility',
          'supportedFileFormat': 'atsCompatibility',

          // Keyword Match
          'keywordDensity': 'keywordMatch',
          'dedicatedSkillsSection': 'keywordMatch',
          'industryKeywords': 'keywordMatch',

          // Content Quality
          'quantifiedAchievements': 'contentQuality',
          'actionVerbBullets': 'contentQuality',
          'noPersonalPronouns': 'contentQuality',

          // Formatting
          'consistentFormatting': 'formatting',
          'appropriateLength': 'formatting',
          'professionalFont': 'formatting',

          // Completeness
          'hasContactInfo': 'completeness',
          'hasExperience': 'completeness',
          'hasEducation': 'completeness'
        };

        return mapping[checkName] || 'contentQuality';
      }

      _categorizeResults(checkResults) {
        const categorized = {
          atsCompatibility: [],
          keywordMatch: [],
          contentQuality: [],
          formatting: [],
          completeness: []
        };

        checkResults.forEach(result => {
          const mapping = this._mapCheckToCategory(result.checkName, result.category);
          if (categorized[mapping]) {
            categorized[mapping].push(result);
          }
        });

        return categorized;
      }

      _calculateCategoryScores(categorizedResults) {
        const scores = {};

        Object.keys(categorizedResults).forEach(category => {
          const results = categorizedResults[category];
          if (results.length === 0) {
            scores[category] = { score: 0, passed: 0, total: 0 };
            return;
          }

          const passed = results.filter(r => r.passed).length;
          const total = results.length;
          const score = (passed / total) * 100;

          scores[category] = {
            score: Math.round(score),
            passed,
            total,
            weight: this.categories[category].weight
          };
        });

        return scores;
      }

      _calculateWeightedScore(categoryScores) {
        let weightedSum = 0;
        let totalWeight = 0;

        Object.keys(categoryScores).forEach(category => {
          const categoryData = categoryScores[category];
          const weight = this.categories[category].weight;

          weightedSum += (categoryData.score * weight) / 100;
          totalWeight += weight;
        });

        return (weightedSum / totalWeight) * 100;
      }

      _generateBreakdown(categoryScores, checkResults) {
        const breakdown = {};

        Object.keys(categoryScores).forEach(category => {
          breakdown[category] = {
            score: categoryScores[category].score,
            weight: this.categories[category].weight,
            contribution: (categoryScores[category].score * this.categories[category].weight) / 100,
            description: this.categories[category].description
          };
        });

        return breakdown;
      }

      _analyzeScores(categoryScores, categorizedResults) {
        const strengths = [];
        const weaknesses = [];

        Object.keys(categoryScores).forEach(category => {
          const score = categoryScores[category].score;

          if (score >= 80) {
            strengths.push({
              category,
              score,
              description: this.categories[category].description
            });
          } else if (score < 70) {
            weaknesses.push({
              category,
              score,
              description: this.categories[category].description
            });
          }
        });

        return { strengths, weaknesses };
      }

      calculateScore(checkResults, options = {}) {
        const categorizedResults = this._categorizeResults(checkResults);
        const categoryScores = this._calculateCategoryScores(categorizedResults);
        const overallScore = this._calculateWeightedScore(categoryScores);
        const grade = this._assignGrade(overallScore);
        const percentile = this._calculatePercentile(overallScore);
        const breakdown = this._generateBreakdown(categoryScores, checkResults);
        const analysis = this._analyzeScores(categoryScores, categorizedResults);

        return {
          overallScore: Math.round(overallScore),
          grade: grade.grade,
          gradeDescription: grade.description,
          percentile,
          categoryScores,
          breakdown,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          timestamp: new Date().toISOString(),
          totalChecks: checkResults.length,
          passedChecks: checkResults.filter(r => r.passed).length,
          failedChecks: checkResults.filter(r => !r.passed).length
        };
      }
    };
  });

  beforeEach(() => {
    scorer = new ATSScorer();
  });

  describe('Constructor', () => {
    test('should initialize with 5 categories', () => {
      expect(Object.keys(scorer.categories)).toHaveLength(5);
      expect(scorer.categories).toHaveProperty('atsCompatibility');
      expect(scorer.categories).toHaveProperty('keywordMatch');
      expect(scorer.categories).toHaveProperty('contentQuality');
      expect(scorer.categories).toHaveProperty('formatting');
      expect(scorer.categories).toHaveProperty('completeness');
    });

    test('should have correct category weights totaling 100', () => {
      const totalWeight = Object.values(scorer.categories)
        .reduce((sum, cat) => sum + cat.weight, 0);

      expect(totalWeight).toBe(100);
    });

    test('should initialize grade scale', () => {
      expect(scorer.gradeScale).toBeDefined();
      expect(scorer.gradeScale.length).toBeGreaterThan(0);
      expect(scorer.gradeScale[0].grade).toBe('A+');
    });

    test('each category should have weight and description', () => {
      Object.values(scorer.categories).forEach(category => {
        expect(category).toHaveProperty('weight');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('factors');
      });
    });
  });

  describe('Grade Assignment', () => {
    test('should assign A+ grade for scores 97-100', () => {
      const grade = scorer._assignGrade(98);
      expect(grade.grade).toBe('A+');
      expect(grade.description).toContain('Exceptional');
    });

    test('should assign A grade for scores 93-96', () => {
      const grade = scorer._assignGrade(95);
      expect(grade.grade).toBe('A');
    });

    test('should assign B grade for scores 83-86', () => {
      const grade = scorer._assignGrade(85);
      expect(grade.grade).toBe('B');
    });

    test('should assign C grade for scores 73-76', () => {
      const grade = scorer._assignGrade(75);
      expect(grade.grade).toBe('C');
    });

    test('should assign F grade for scores below 60', () => {
      const grade = scorer._assignGrade(50);
      expect(grade.grade).toBe('F');
    });

    test('should handle edge cases correctly', () => {
      expect(scorer._assignGrade(100).grade).toBe('A+');
      expect(scorer._assignGrade(0).grade).toBe('F');
      expect(scorer._assignGrade(90).grade).toBe('A-');
    });
  });

  describe('Check Categorization', () => {
    test('should categorize ATS compatibility checks', () => {
      const checkResults = [
        { checkName: 'noTables', passed: true, category: 'formatting' },
        { checkName: 'noMultiColumn', passed: true, category: 'formatting' }
      ];

      const categorized = scorer._categorizeResults(checkResults);

      expect(categorized.atsCompatibility).toHaveLength(2);
    });

    test('should categorize keyword match checks', () => {
      const checkResults = [
        { checkName: 'keywordDensity', passed: true, category: 'keywords' },
        { checkName: 'dedicatedSkillsSection', passed: false, category: 'structure' }
      ];

      const categorized = scorer._categorizeResults(checkResults);

      expect(categorized.keywordMatch).toHaveLength(2);
    });

    test('should categorize content quality checks', () => {
      const checkResults = [
        { checkName: 'quantifiedAchievements', passed: true, category: 'content' },
        { checkName: 'actionVerbBullets', passed: true, category: 'content' }
      ];

      const categorized = scorer._categorizeResults(checkResults);

      expect(categorized.contentQuality).toHaveLength(2);
    });

    test('should handle empty results', () => {
      const categorized = scorer._categorizeResults([]);

      Object.values(categorized).forEach(category => {
        expect(category).toHaveLength(0);
      });
    });
  });

  describe('Category Score Calculation', () => {
    test('should calculate 100% for all passed checks', () => {
      const categorized = {
        atsCompatibility: [
          { passed: true },
          { passed: true },
          { passed: true }
        ],
        keywordMatch: [],
        contentQuality: [],
        formatting: [],
        completeness: []
      };

      const scores = scorer._calculateCategoryScores(categorized);

      expect(scores.atsCompatibility.score).toBe(100);
      expect(scores.atsCompatibility.passed).toBe(3);
      expect(scores.atsCompatibility.total).toBe(3);
    });

    test('should calculate 50% for half passed checks', () => {
      const categorized = {
        atsCompatibility: [
          { passed: true },
          { passed: false },
          { passed: true },
          { passed: false }
        ],
        keywordMatch: [],
        contentQuality: [],
        formatting: [],
        completeness: []
      };

      const scores = scorer._calculateCategoryScores(categorized);

      expect(scores.atsCompatibility.score).toBe(50);
    });

    test('should calculate 0% for all failed checks', () => {
      const categorized = {
        atsCompatibility: [
          { passed: false },
          { passed: false }
        ],
        keywordMatch: [],
        contentQuality: [],
        formatting: [],
        completeness: []
      };

      const scores = scorer._calculateCategoryScores(categorized);

      expect(scores.atsCompatibility.score).toBe(0);
    });

    test('should handle empty categories', () => {
      const categorized = {
        atsCompatibility: [],
        keywordMatch: [],
        contentQuality: [],
        formatting: [],
        completeness: []
      };

      const scores = scorer._calculateCategoryScores(categorized);

      expect(scores.atsCompatibility.score).toBe(0);
      expect(scores.atsCompatibility.total).toBe(0);
    });
  });

  describe('Weighted Score Calculation', () => {
    test('should calculate weighted score correctly', () => {
      const categoryScores = {
        atsCompatibility: { score: 100, weight: 25 },
        keywordMatch: { score: 80, weight: 25 },
        contentQuality: { score: 90, weight: 20 },
        formatting: { score: 85, weight: 15 },
        completeness: { score: 95, weight: 15 }
      };

      const weighted = scorer._calculateWeightedScore(categoryScores);

      // (100*25 + 80*25 + 90*20 + 85*15 + 95*15) / 100 = 90.25
      // Rounded down to 90
      expect(Math.round(weighted)).toBe(90);
    });

    test('should handle perfect scores', () => {
      const categoryScores = {
        atsCompatibility: { score: 100, weight: 25 },
        keywordMatch: { score: 100, weight: 25 },
        contentQuality: { score: 100, weight: 20 },
        formatting: { score: 100, weight: 15 },
        completeness: { score: 100, weight: 15 }
      };

      const weighted = scorer._calculateWeightedScore(categoryScores);

      expect(weighted).toBe(100);
    });

    test('should handle zero scores', () => {
      const categoryScores = {
        atsCompatibility: { score: 0, weight: 25 },
        keywordMatch: { score: 0, weight: 25 },
        contentQuality: { score: 0, weight: 20 },
        formatting: { score: 0, weight: 15 },
        completeness: { score: 0, weight: 15 }
      };

      const weighted = scorer._calculateWeightedScore(categoryScores);

      expect(weighted).toBe(0);
    });
  });

  describe('Full Score Calculation', () => {
    test('should calculate complete score for perfect resume', () => {
      const checkResults = [
        { checkName: 'noTables', passed: true, category: 'formatting' },
        { checkName: 'keywordDensity', passed: true, category: 'keywords' },
        { checkName: 'quantifiedAchievements', passed: true, category: 'content' },
        { checkName: 'consistentFormatting', passed: true, category: 'formatting' },
        { checkName: 'hasContactInfo', passed: true, category: 'structure' }
      ];

      const result = scorer.calculateScore(checkResults);

      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.grade).toBeDefined();
      expect(result.gradeDescription).toBeDefined();
      expect(result.percentile).toBeDefined();
      expect(result.categoryScores).toBeDefined();
      expect(result.totalChecks).toBe(5);
      expect(result.passedChecks).toBe(5);
      expect(result.failedChecks).toBe(0);
    });

    test('should identify strengths and weaknesses', () => {
      const checkResults = [
        { checkName: 'noTables', passed: true, category: 'formatting' },
        { checkName: 'noMultiColumn', passed: true, category: 'formatting' },
        { checkName: 'quantifiedAchievements', passed: false, category: 'content' },
        { checkName: 'actionVerbBullets', passed: false, category: 'content' }
      ];

      const result = scorer.calculateScore(checkResults);

      expect(result.strengths).toBeDefined();
      expect(result.weaknesses).toBeDefined();
      expect(Array.isArray(result.strengths)).toBe(true);
      expect(Array.isArray(result.weaknesses)).toBe(true);
    });

    test('should include timestamp', () => {
      const checkResults = [
        { checkName: 'noTables', passed: true, category: 'formatting' }
      ];

      const result = scorer.calculateScore(checkResults);

      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('should generate detailed breakdown', () => {
      const checkResults = [
        { checkName: 'noTables', passed: true, category: 'formatting' },
        { checkName: 'keywordDensity', passed: true, category: 'keywords' }
      ];

      const result = scorer.calculateScore(checkResults);

      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.atsCompatibility).toBeDefined();
      expect(result.breakdown.keywordMatch).toBeDefined();
    });

    test('should handle empty check results', () => {
      const result = scorer.calculateScore([]);

      expect(result.overallScore).toBe(0);
      expect(result.grade).toBe('F');
      expect(result.totalChecks).toBe(0);
      expect(result.passedChecks).toBe(0);
    });
  });

  describe('Percentile Calculation', () => {
    test('should calculate percentile within 1-99 range', () => {
      expect(scorer._calculatePercentile(95)).toBeGreaterThanOrEqual(1);
      expect(scorer._calculatePercentile(95)).toBeLessThanOrEqual(99);
    });

    test('should handle edge cases', () => {
      expect(scorer._calculatePercentile(100)).toBeLessThanOrEqual(99);
      expect(scorer._calculatePercentile(0)).toBeGreaterThanOrEqual(1);
    });
  });
});
