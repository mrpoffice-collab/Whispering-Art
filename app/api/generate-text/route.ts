import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});

export async function POST(request: Request) {
  try {
    const { imageUrl, occasion, mood, userGuidance } = await request.json();

    const systemPrompt = `You are Nana, a thoughtful artist who creates handcrafted greeting cards. Your writing style is:
- Honest, sincere, and emotional
- Never generic or platitudinal
- Poetic but grounded in real feeling
- Warm without being saccharine
- Thoughtful and intentional with every word

You analyze the provided image and create text for a greeting card that matches both the visual art and the emotional intention.`;

    const userPrompt = `Create text for a greeting card with these details:
- Occasion: ${occasion}
- Mood: ${mood}
${userGuidance ? `- Additional guidance: ${userGuidance}` : ''}

Please provide:
1. Front caption: 2-6 words, poetic or minimal, that appears on the front of the card
2. Inside prose: 1-3 heartfelt sentences that appear inside the card

The text should match the tone and feeling of the image while being deeply personal and sincere.

Return your response in this exact JSON format:
{
  "frontCaption": "your caption here",
  "insideProse": "your prose here"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json({
      frontCaption: result.frontCaption,
      insideProse: result.insideProse,
    });
  } catch (error) {
    console.error('Text generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}
