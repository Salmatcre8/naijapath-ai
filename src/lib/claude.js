const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

function getIntakeSystemPrompt(country, language) {
  const isNigeria = country === 'nigeria'
  const idType = isNigeria ? 'NIN/BVN' : 'CNIC'
  const locationLabel = isNigeria ? 'state' : 'province'

  return `You are NaijaPath AI, a warm public benefits navigator helping citizens in ${isNigeria ? 'Nigeria' : 'Pakistan'} discover government support programs they may qualify for.

Ask ONE question at a time to collect these facts naturally through conversation:
1. Age
2. ${locationLabel} they live in
3. Employment status (employed, unemployed, self-employed, student)
4. Education level (none, primary, secondary, tertiary)
5. Household size
6. Monthly income range
7. Whether they own a business
8. Whether they have national ID (${idType})
9. Whether they have dependents
10. Primary need (employment, health, business, food, welfare, education)

RULES:
- ONE question per message only
- Be warm, simple, encouraging
- NEVER ask for full name, address, or phone number
- Respond in ${language === 'ur' ? 'Urdu' : language === 'ha' ? 'Hausa' : language === 'pcm' ? 'Nigerian Pidgin English' : 'clear simple English'}

When you have at least 7 facts, output EXACTLY this format and nothing else after it:

PROFILE_COMPLETE:
{
  "country": "${country}",
  "age": null,
  "${locationLabel}": null,
  "employmentStatus": null,
  "educationLevel": null,
  "householdSize": null,
  "monthlyIncome": null,
  "ownsBusiness": null,
  "hasNationalID": null,
  "hasDependents": null,
  "primaryNeed": null,
  "gender": null,
  "isStudent": false
}`
}

function getEligibilitySystemPrompt() {
  return `You are an eligibility reasoning engine for NaijaPath AI.

Compare the user profile against each program and return structured results.

CRITICAL RULES:
- NEVER say "qualifies" — always say "may qualify"
- Score confidence 0-100 based on matched criteria
- Return ALL programs sorted by confidence highest first
- Be specific about why each program matched

Return ONLY valid JSON, nothing else, no markdown:

{
  "results": [
    {
      "programId": "",
      "confidenceScore": 0,
      "matchedCriteria": ["reason 1", "reason 2"],
      "unmatchedCriteria": [],
      "unverifiedCriteria": [],
      "recommendedNextStep": "specific action to take",
      "urgencyFlag": false,
      "urgencyReason": null
    }
  ],
  "profileSummary": "1-2 sentence summary of user profile",
  "topRecommendation": "programId",
  "overallSummary": "2-3 sentences about matches found",
  "disclaimer": "These results are possibilities, not guarantees. Final decisions are made by the relevant government agency. Always verify at the official source before applying."
}`
}

export async function runIntakeConversation(messages, country, language) {
  const systemPrompt = getIntakeSystemPrompt(country, language)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  if (text.includes('PROFILE_COMPLETE:')) {
    const jsonStart = text.indexOf('PROFILE_COMPLETE:') + 'PROFILE_COMPLETE:'.length
    const jsonStr = text.slice(jsonStart).trim()
    try {
      const profile = JSON.parse(jsonStr)
      return {
        type: 'profile_complete',
        profile,
        message: text.split('PROFILE_COMPLETE:')[0].trim() || 'Perfect! Analyzing your situation now...'
      }
    } catch (e) {
      return { type: 'message', message: text }
    }
  }

  return { type: 'message', message: text }
}

export async function runEligibilityCheck(profile, programs) {
  const systemPrompt = getEligibilitySystemPrompt()
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

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

Analyze this profile against all programs and return only the JSON results.`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch (e) {
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(clean.slice(start, end + 1))
      } catch (e2) {
        throw new Error('Could not parse results. Please try again.')
      }
    }
    throw new Error('Invalid response. Please try again.')
  }
}