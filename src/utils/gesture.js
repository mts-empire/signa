// src/pages/api/gesture.js
import { classifyLandmarks } from '../../utils/gestureEngine';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { landmarks, customApiKey } = req.body;

  // Uses the UI key if provided; otherwise falls back to Vercel env variable
  const activeApiKey = customApiKey || process.env.GROQ_API_KEY;

  if (!activeApiKey) {
    return res.status(400).json({ 
      error: 'No API key provided. Please enter a key in the header or set GROQ_API_KEY on Vercel.' 
    });
  }

  // 1. Classify Gesture via Backend Engine
  const gestureWord = classifyLandmarks(landmarks);

  if (gestureWord === "No hand detected" || gestureWord === "Analyzing Gesture...") {
    return res.status(200).json({ word: gestureWord, sentence: gestureWord });
  }

  try {
    // 2. Call Groq AI using activeApiKey
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI sign language interpreter. Convert the recognized gesture word into a natural, 1-sentence spoken statement. Output ONLY the sentence.'
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

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const sentence = data.choices?.[0]?.message?.content?.trim() || gestureWord;

    return res.status(200).json({
      word: gestureWord,
      sentence: sentence
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to communicate with Groq AI API.' });
  }
}
