// Career Documents AI Prompt Templates
// Handles AI-powered generation of executive bios, status inquiry letters, and brand statements

/**
 * Prompt Templates for Career Document Generation
 */
const CareerDocsPrompts = {
    /**
     * Generate an executive bio
     * @param {Object} params - Parameters for bio generation
     * @param {string} params.name - Full name
     * @param {string} params.currentTitle - Current job title
     * @param {string} params.company - Current company
     * @param {number} params.yearsExperience - Years of experience
     * @param {string[]} params.achievements - Key achievements
     * @param {string[]} params.expertise - Areas of expertise
     * @param {string} params.education - Education background
     * @param {string} params.style - executive/professional/speaker/academic
     * @param {number} params.length - Target word count (50/100/150)
     * @param {string} params.perspective - first/third person
     * @returns {string} - Claude API prompt
     */
    generateExecutiveBio: ({
        name,
        currentTitle,
        company,
        yearsExperience,
        achievements = [],
        expertise = [],
        education = '',
        style = 'executive',
        length = 100,
        perspective = 'third'
    }) => {
        const styleInstructions = {
            executive: 'C-suite level, emphasizing leadership, strategic vision, and board-ready credentials',
            professional: 'corporate professional, balanced expertise and accomplishments',
            speaker: 'conference/keynote speaker bio, engaging and establishing authority',
            academic: 'research-focused with emphasis on publications and academic contributions'
        };

        const perspectiveInstructions = perspective === 'first'
            ? 'Write in FIRST person (I, my, mine)'
            : 'Write in THIRD person (he/she, his/her, their)';

        const achievementsList = achievements.length > 0
            ? `\n\nKEY ACHIEVEMENTS:\n${achievements.map(a => `- ${a}`).join('\n')}`
            : '';

        const expertiseList = expertise.length > 0
            ? `\n\nAREAS OF EXPERTISE:\n${expertise.map(e => `- ${e}`).join('\n')}`
            : '';

        return `You are an expert executive communications specialist who crafts compelling professional biographies.

Generate an executive bio for:

PROFESSIONAL DETAILS:
- Name: ${name}
- Current Title: ${currentTitle}
- Company: ${company}
- Years of Experience: ${yearsExperience}
- Education: ${education || 'Not specified'}${achievementsList}${expertiseList}

REQUIREMENTS:
- Style: ${styleInstructions[style]}
- Length: Approximately ${length} words
- Perspective: ${perspectiveInstructions}

STRUCTURE GUIDELINES:

For ${length <= 50 ? 'SHORT' : length <= 100 ? 'MEDIUM' : 'FULL'} BIO:
${length <= 50 ? `
1. Opening sentence with name, title, and company
2. One key accomplishment or expertise area
3. Brief credibility statement` : length <= 100 ? `
1. Opening with name, title, and immediate value proposition
2. 2-3 key achievements or expertise highlights
3. Brief background (education/experience)
4. Forward-looking statement or unique differentiator` : `
1. Strong opening with name and compelling headline
2. Career trajectory and notable positions
3. 3-4 key achievements with metrics where possible
4. Areas of expertise and thought leadership
5. Education and credentials
6. Personal touch or passion statement`}

CRITICAL REQUIREMENTS:
- Lead with impact, not chronology
- Include specific metrics and achievements where possible
- Avoid clichés like "passionate," "results-driven," "dynamic"
- Sound authoritative without being boastful
- Make it memorable and distinctive
- Ensure it reads naturally aloud
- Match the tone to the style (${style})

AVOID:
- Generic statements that could apply to anyone
- Excessive jargon or buzzwords
- Starting with "With X years of experience..."
- Listing responsibilities instead of achievements
- Overly humble or overly boastful language

Return ONLY the bio text. No preamble, explanation, or meta-commentary.`;
    },

    /**
     * Generate a status inquiry letter
     * @param {Object} params - Parameters for inquiry generation
     * @param {string} params.jobTitle - Position applied for
     * @param {string} params.companyName - Company name
     * @param {string} params.applicationDate - When applied
     * @param {string} params.contactName - Hiring manager name (optional)
     * @param {string} params.interviewDate - Interview date (optional)
     * @param {string} params.tone - professional/warm/direct
     * @param {string} params.inquiryType - post-interview/post-application/offer-timeline/decision-update
     * @param {string} params.additionalContext - Any additional context
     * @returns {string} - Claude API prompt
     */
    generateStatusInquiry: ({
        jobTitle,
        companyName,
        applicationDate,
        contactName = '',
        interviewDate = '',
        tone = 'professional',
        inquiryType = 'post-application',
        additionalContext = ''
    }) => {
        const toneInstructions = {
            professional: 'formal and businesslike, maintaining appropriate boundaries',
            warm: 'friendly and personable while remaining professional',
            direct: 'concise and straightforward, respecting their time'
        };

        const typeInstructions = {
            'post-interview': `Follow up after an interview that occurred on ${interviewDate || 'recently'}. Express continued interest and inquire about timeline.`,
            'post-application': `Politely inquire about application status for a position applied ${applicationDate || 'recently'}. Reaffirm interest without appearing desperate.`,
            'offer-timeline': 'Professionally inquire about the timeline for receiving an offer or next steps after final interviews.',
            'decision-update': 'Request an update on the hiring decision timeline with appropriate urgency.'
        };

        const greeting = contactName
            ? `Address the letter to ${contactName}.`
            : 'Use "Dear Hiring Team" or "Dear Hiring Manager".';

        const contextNote = additionalContext
            ? `\n\nADDITIONAL CONTEXT:\n${additionalContext}`
            : '';

        return `You are an expert career coach who helps professionals follow up on job applications with tact and professionalism.

Generate a status inquiry letter for:

APPLICATION DETAILS:
- Position: ${jobTitle}
- Company: ${companyName}
- Application Date: ${applicationDate || 'Recently'}
- Interview Date: ${interviewDate || 'N/A'}${contextNote}

REQUIREMENTS:
- Inquiry Type: ${typeInstructions[inquiryType]}
- Tone: ${toneInstructions[tone]}
- Greeting: ${greeting}

STRUCTURE (Keep CONCISE - under 150 words):

1. GREETING & REFERENCE (1 sentence):
   - Professional greeting
   - Reference the specific position

2. PURPOSE (1-2 sentences):
   - Clear but polite inquiry about status
   - Briefly mention when you applied/interviewed

3. CONTINUED INTEREST (1-2 sentences):
   - Reaffirm genuine interest in the role
   - Brief mention of why (specific to company/role)

4. CLOSING (1-2 sentences):
   - Thank them for their time
   - Express willingness to provide more information
   - Professional sign-off

CRITICAL REQUIREMENTS:
- Be respectful of their time - keep it SHORT
- Show continued enthusiasm without seeming desperate
- Don't demand or pressure for a response
- Include a specific call-to-action (e.g., "Would you have any updates...")
- Sound confident, not anxious
- Don't apologize for following up
- Be memorable but not pushy

AVOID:
- Being too aggressive or demanding
- Sounding desperate or needy
- Excessive apologizing
- Being vague about which position
- Asking when you'll hear back (too direct)
- Multiple questions in one letter
- Long paragraphs

Return ONLY the letter text with proper formatting. No preamble or explanation.`;
    },

    /**
     * Generate a personal brand statement
     * @param {Object} params - Parameters for brand statement
     * @param {string} params.name - Full name
     * @param {string} params.currentRole - Current role
     * @param {string} params.targetRole - Target role (if different)
     * @param {string[]} params.coreValues - Core professional values
     * @param {string[]} params.expertise - Key expertise areas
     * @param {string[]} params.differentiators - What makes you unique
     * @param {string} params.audience - recruiters/networking/linkedin/website
     * @param {string} params.style - professional/inspirational/authentic/bold
     * @param {string} params.length - tagline/elevator/full (15/50/100 words)
     * @returns {string} - Claude API prompt
     */
    generateBrandStatement: ({
        name,
        currentRole,
        targetRole = '',
        coreValues = [],
        expertise = [],
        differentiators = [],
        audience = 'recruiters',
        style = 'professional',
        length = 'elevator'
    }) => {
        const audienceInstructions = {
            recruiters: 'Optimized for recruiters and hiring managers - emphasize value proposition and results',
            networking: 'Suitable for networking events and introductions - memorable and conversation-starting',
            linkedin: 'Perfect for LinkedIn headline/summary - keyword-rich and scroll-stopping',
            website: 'Portfolio/personal website bio - comprehensive and establishes authority'
        };

        const styleInstructions = {
            professional: 'polished and corporate, emphasizing credibility',
            inspirational: 'motivational and purpose-driven, emphasizing impact',
            authentic: 'genuine and relatable, emphasizing personality',
            bold: 'confident and memorable, emphasizing uniqueness'
        };

        const lengthInstructions = {
            tagline: '10-15 words - punchy headline format',
            elevator: '40-60 words - brief elevator pitch',
            full: '80-120 words - comprehensive narrative'
        };

        const valuesList = coreValues.length > 0
            ? `\n\nCORE VALUES:\n${coreValues.map(v => `- ${v}`).join('\n')}`
            : '';

        const expertiseList = expertise.length > 0
            ? `\n\nKEY EXPERTISE:\n${expertise.map(e => `- ${e}`).join('\n')}`
            : '';

        const differentiatorsList = differentiators.length > 0
            ? `\n\nUNIQUE DIFFERENTIATORS:\n${differentiators.map(d => `- ${d}`).join('\n')}`
            : '';

        const roleContext = targetRole && targetRole !== currentRole
            ? `\nTarget Role: ${targetRole} (currently transitioning from ${currentRole})`
            : '';

        return `You are an expert personal branding strategist who helps professionals craft compelling brand statements.

Create a personal brand statement for:

PROFESSIONAL PROFILE:
- Name: ${name}
- Current Role: ${currentRole}${roleContext}${valuesList}${expertiseList}${differentiatorsList}

REQUIREMENTS:
- Audience: ${audienceInstructions[audience]}
- Style: ${styleInstructions[style]}
- Length: ${lengthInstructions[length]}

BRAND STATEMENT FORMULA:

${length === 'tagline' ? `
Format: [Who you help] + [How you help them] + [Unique approach/result]
Example: "Helping tech startups scale through data-driven marketing strategies"` : length === 'elevator' ? `
Structure:
1. WHO you are (role/identity) - 1 sentence
2. WHAT you do (value/expertise) - 1 sentence
3. HOW you're different (unique approach) - 1 sentence
4. IMPACT (results/outcome) - optional phrase` : `
Structure:
1. Hook/Identity Statement - who you are at your core
2. Value Proposition - what unique value you bring
3. Expertise & Track Record - credibility builders
4. Differentiators - what sets you apart
5. Vision/Impact - forward-looking statement`}

CRITICAL REQUIREMENTS:
- Lead with value, not job title
- Be specific about WHO you help and HOW
- Include your unique perspective or approach
- Make it memorable and distinctive
- Avoid generic statements
- Sound confident, not arrogant
- Optimized for ${audience}

AVOID:
- Starting with "I am a..." (unless full length)
- Generic buzzwords (passionate, driven, dedicated)
- Vague value propositions
- Focusing only on skills without impact
- Being too humble or too boastful
- Copying common LinkedIn formulas
- Jargon that alienates your audience

EXAMPLES OF GOOD BRAND STATEMENTS:
- Tagline: "Transforming complex data into strategic business decisions"
- Elevator: "Product leader who builds user experiences that drive 10x growth. I combine design thinking with data analytics to create products users love and businesses profit from."
- Full: (comprehensive narrative format)

Return ONLY the brand statement text. No preamble, explanation, or alternatives.`;
    },

    /**
     * Analyze and improve existing brand statement
     * @param {Object} params - Parameters for analysis
     * @param {string} params.statement - Current brand statement
     * @param {string} params.targetAudience - Intended audience
     * @returns {string} - Claude API prompt
     */
    analyzeBrandStatement: ({ statement, targetAudience = 'recruiters' }) => {
        return `You are an expert personal branding strategist.

Analyze this personal brand statement and provide feedback:

BRAND STATEMENT:
${statement}

TARGET AUDIENCE: ${targetAudience}

Return analysis as JSON:

{
  "overallScore": 0-100,
  "scores": {
    "clarity": 0-100,
    "memorability": 0-100,
    "differentiation": 0-100,
    "valueProposition": 0-100,
    "audienceAlignment": 0-100
  },
  "strengths": [
    "Specific strength 1",
    "Specific strength 2"
  ],
  "weaknesses": [
    "Specific weakness 1",
    "Specific weakness 2"
  ],
  "suggestions": [
    "Actionable improvement 1",
    "Actionable improvement 2"
  ],
  "improvedVersion": "A rewritten, improved version of the statement"
}

Return ONLY valid JSON without markdown formatting.`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CareerDocsPrompts;
}
