export async function refineSentenceWithGroq(rawText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey.includes('your_actual_groq_api_key')) {
    throw new Error('Groq API Key is missing. Add VITE_GROQ_API_KEY in Vercel Environment Variables or .env file.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI brain for a Sign Language Translator. You receive raw individual recognized gesture words (e.g., "Hello Peace Pointing"). Convert them into a natural, grammatically correct, and coherent English sentence. Output ONLY the refined sentence text, with no conversational preamble or quotes.',
        },
        {
          role: 'user',
          content: `Raw sign gestures: "${rawText}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API HTTP error status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || rawText;
}
