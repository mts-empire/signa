export async function refineSentenceWithGroq(rawText: string, customApiKey?: string): Promise<string> {
  const apiKey = customApiKey || localStorage.getItem('GROQ_USER_KEY') || import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_actual')) {
    throw new Error('Groq API Key missing! Paste your key in the header input field or set VITE_GROQ_API_KEY.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI Sign Language Interpreter. Rephrase these raw recognized gesture tokens into a fluent, perfectly structured English sentence. Respond ONLY with the finalized sentence.',
        },
        {
          role: 'user',
          content: `Raw detected gestures: "${rawText}"`,
        },
      ],
      temperature: 0.2,
      max_tokens: 120,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API Error: HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || rawText;
}
