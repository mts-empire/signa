export async function enhanceGestureWithGroq(
  gestureWord: string, 
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey || import.meta.env.VITE_GROQ_API_KEY || '';

  if (!apiKey || !gestureWord || gestureWord.includes('Searching')) {
    return gestureWord;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI sign language interpreter. Convert the single input gesture word into a concise, natural 1-sentence spoken statement. Respond ONLY with the converted sentence.'
          },
          {
            role: 'user',
            content: `Gesture word: "${gestureWord}"`
          }
        ],
        max_tokens: 35,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || gestureWord;
  } catch (error) {
    console.error('Groq AI Translation Error:', error);
    return gestureWord;
  }
}
