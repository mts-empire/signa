// src/pages/api/gesture.js
import { classifyLandmarks } from '../../utils/gestureEngine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { landmarks } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is missing in Vercel environment variables.' });
  }

  // 1. Classify Gesture Word via Engine
  const gestureWord = classifyLandmarks(landmarks);

  if (gestureWord === "No hand detected" || gestureWord === "Analyzing Gesture...") {
    return res.status(200).json({ word: gestureWord, sentence: gestureWord });
  }

  try {
    // 2. Call Groq AI to convert Word into a Spoken Sentence
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI sign language interpreter. Convert the recognized gesture word into a natural, spoken 1-sentence statement that a human would say when making this gesture. Output ONLY the sentence.'
          },
          {
            role: 'user',
            content: `Gesture word: "${gestureWord}". Convert to a natural sentence.`
          }
        ],
        max_tokens: 40,
        temperature: 0.5
      }),
    });

    const data = await groqResponse.json();
    const sentence = data.choices?.[0]?.message?.content?.trim() || gestureWord;

    return res.status(200).json({
      word: gestureWord,
      sentence: sentence
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate sentence via Groq AI.' });
  }
}
