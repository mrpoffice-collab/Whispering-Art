import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Call OpenAI Vision API to analyze the image
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and provide 10-15 descriptive keywords/tags that would help someone search for or categorize this image. Focus on: objects, animals, colors, mood, style, themes, and notable elements. Return ONLY a comma-separated list of single-word or short-phrase tags, lowercase, no explanations.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const tagsText = response.choices[0]?.message?.content || '';
    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('AI tag generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate AI tags',
      },
      { status: 500 }
    );
  }
}
