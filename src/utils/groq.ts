export async function refineSentenceWithGroq(rawText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey.includes('your_actual_groq_api_key')) {
    throw new Error('Groq API Key missing. Set VITE_GROQ_API_KEY in Vercel settings.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI Sign Language Interpreter. Convert raw recognized gesture tokens (e.g., "Water / Drink", "Hello", "Thumbs Up") into a single, natural, fluently rephrased English sentence. Return ONLY the sentence without preamble or quotes.',
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
    throw new Error(err.error?.message || `Groq HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || rawText;
}
