import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { CuratedImage } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const occasion = searchParams.get('occasion');
    const mood = searchParams.get('mood');
    const style = searchParams.get('style');

    // Query based on filters - use Neon SQL template syntax
    let result;

    if (occasion && mood && style) {
      result = await sql`
        SELECT * FROM curated_images
        WHERE is_active = true
          AND occasion = ${occasion}
          AND mood = ${mood}
          AND style = ${style}
        ORDER BY usage_count ASC, created_at DESC
      `;
    } else if (occasion && mood) {
      result = await sql`
        SELECT * FROM curated_images
        WHERE is_active = true
          AND occasion = ${occasion}
          AND mood = ${mood}
        ORDER BY usage_count ASC, created_at DESC
      `;
    } else if (occasion && style) {
      result = await sql`
        SELECT * FROM curated_images
        WHERE is_active = true
          AND occasion = ${occasion}
          AND style = ${style}
        ORDER BY usage_count ASC, created_at DESC
      `;
    } else if (occasion) {
      result = await sql`
        SELECT * FROM curated_images
        WHERE is_active = true AND occasion = ${occasion}
        ORDER BY usage_count ASC, created_at DESC
      `;
    } else {
      result = await sql`
        SELECT * FROM curated_images
        WHERE is_active = true
        ORDER BY usage_count ASC, created_at DESC
      `;
    }

    const images: CuratedImage[] = result.map((row: any) => ({
      id: row.id,
      blobUrl: row.blob_url,
      thumbnailUrl: row.thumbnail_url,
      occasion: row.occasion,
      mood: row.mood,
      style: row.style,
      midjourneyPrompt: row.midjourney_prompt,
      tags: row.tags || [],
      isActive: row.is_active,
      usageCount: row.usage_count,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching curated images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
