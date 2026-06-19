const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

function getIntakeSystemPrompt(country, language) {
  const isNigeria = country === 'nigeria'
  const idType = isNigeria ? 'NIN/BVN' : 'CNIC'
  const currency = isNigeria ? 'Naira (₦)' : 'Pakistani Rupee (PKR)'
  const locationLabel = isNigeria ? 'state' : 'province'

  return `You are NaijaPath AI, a warm, empathetic, and knowledgeable public benefits navigator helping citizens in ${isNigeria ? 'Nigeria' : 'Pakistan'} discover government support programs they may qualify for.

Your job RIGHT NOW is to learn about the user's situation through friendly, natural conversation — NOT a form dump. Ask ONE question at a time. Be warm, simple, and encouraging.

You need to collect these key facts (but naturally, through conversation):
1. Age
2. ${locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1)} they live in
3. Employment status (employed, unemployed, self-employed, student)
4. Education level (none, primary, secondary/WAEC/SSCE, tertiary/university)
5. Household size (how many people depend on them or live with them)
6. Monthly income range (rough estimate is fine — they can say "very low", "below X", etc.)
7. Whether they own or run a business
8. Whether they have a national ID (${idType})
9. Whether they have dependents (children, elderly parents)
10. Their primary need (employment, health, business funding, food support, housing, education)

CRITICAL RULES:
- Ask only ONE question per message. Never list multiple questions.
- Be conversational, warm, and simple. Avoid bureaucratic language.
- If user provides multiple facts in one message, acknowledge them all, then ask the next most important missing question.
- NEVER ask for: full name, home address, phone number, passwords, or any sensitive personal information.
- Respond in ${language === 'ur' ? 'Urdu' : language === 'ha' ? 'Hausa' : language === 'pcm' ? 'Nigerian Pidgin English' : 'clear simple English'}.
- Keep your messages SHORT — 1-3 sentences max before the question.
- Be encouraging: say things like "That helps me understand" or "Great, one more thing..."

When you have collected at least 7 of the 10 facts above, output EXACTLY this JSON block (and nothing else after it):

PROFILE_COMPLETE:
{
  "country": "${country}",
  "age": <number or null>,
  "${locationLabel}": "<string or null>",
  "employmentStatus": "<unemployed|employed|self-employed|student|null>",
  "educationLevel": "<none|primary|secondary|tertiary|null>",
  "householdSize": <number or null>,
  "monthlyIncome": "<very low|below 30000|30000-100000|above 100000|below PKR 25000|25000-60000|above 60000|null>",
  "ownsBusiness": <true|false|null>,
  "hasNationalID": <true|false|null>,
  "hasDependents": <true|false|null>,
  "primaryNeed": "<employment|health|business|food|welfare|education|null>",
  "gender": "<male|female|prefer not to say|null>",
  "isStudent": <true|false>
}`
}

function getEligibilitySystemPrompt() {
  return `You are an eligibility reasoning engine for NaijaPath AI, a public benefits navigator.

You will receive a user profile JSON and a list of government programs with their eligibility criteria.

Your job is to carefully compare the user profile against each program and return a structured JSON result.

CRITICAL RULES:
- NEVER say a user "qualifies" — ALWAYS use "may qualify" or "may be eligible"
- Score confidence from 0–100:
  * 80–100: Most key criteria clearly matched
  * 60–79: Several criteria matched, minor gaps
  * 40–59: Some criteria matched, notable gaps
  * Below 40: Few matches, significant uncertainty
- Be specific and human-readable in your explanations
- If a criterion cannot be assessed due to missing data, flag as "unverified" — don't penalize heavily
- Return ALL programs, even low-confidence ones, sorted by confidence (highest first)
- For each program, provide a concrete, actionable next step

Return ONLY this exact JSON structure with no extra text:

{
  "results": [
    {
      "programId": "<string>",
      "confidenceScore": <0-100>,
      "matchedCriteria": ["<specific reason 1>", "<specific reason 2>"],
      "unmatchedCriteria": ["<specific unmet criterion>"],
      "unverifiedCriteria": ["<criterion that couldn't be assessed>"],
      "recommendedNextStep": "<one clear, specific action the user should take>",
      "urgencyFlag": <true|false>,
      "urgencyReason": "<string or null>"
    }
  ],
  "profileSummary": "<1-2 sentence summary of the user's profile>",
  "topRecommendation": "<programId of the single best match>",
  "overallSummary": "<2-3 sentences: how many programs found, what the user should focus on>",
  "disclaimer": "These results reflect possibilities based on the information you shared. They are not a guarantee of eligibility or approval. Final decisions are made by the relevant government agency. Always verify program details at the official source before applying."
}`
}

export async function runIntakeConversation(messages, country, language) {
  const systemPrompt = getIntakeSystemPrompt(country, language)

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  // Check if profile is complete
  if (text.includes('PROFILE_COMPLETE:')) {
    const jsonStart = text.indexOf('PROFILE_COMPLETE:') + 'PROFILE_COMPLETE:'.length
    const jsonStr = text.slice(jsonStart).trim()
    try {
      const profile = JSON.parse(jsonStr)
      return { type: 'profile_complete', profile, message: text.split('PROFILE_COMPLETE:')[0].trim() }
    } catch (e) {
      return { type: 'message', message: text }
    }
  }

  return { type: 'message', message: text }
}

export async function runEligibilityCheck(profile, programs) {
  const systemPrompt = getEligibilitySystemPrompt()

  const userMessage = `User Profile:
${JSON.stringify(profile, null, 2)}

Available Programs:
${JSON.stringify(programs.map(p => ({
  id: p.id,
  name: p.name,
  agency: p.agency,
  category: p.category,
  description: p.description,
  benefit: p.benefit,
  eligibility: p.eligibility,
})), null, 2)}

Please analyze this user's profile against all programs and return the eligibility results JSON.`

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  // Strip markdown code fences if present
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch (e) {
    // Try to extract JSON from the response
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(clean.slice(start, end + 1))
      } catch (e2) {
        throw new Error('Failed to parse eligibility results. Please try again.')
      }
    }
    throw new Error('Invalid response format from AI. Please try again.')
  }
}
