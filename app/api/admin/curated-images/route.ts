import { sql } from '@/lib/db';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;
    const occasion = formData.get('occasion') as string;
    const mood = formData.get('mood') as string;
    const style = formData.get('style') as string;
    const midjourneyPrompt = formData.get('midjourneyPrompt') as string | null;
    const tags = formData.get('tags') as string | null;

    if ((!file && !imageUrl) || !occasion || !mood || !style) {
      return NextResponse.json(
        { error: 'Missing required fields (need either file or URL)' },
        { status: 400 }
      );
    }

    let blob;

    if (imageUrl) {
      // Fetch image from URL
      try {
        const imageResponse = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!imageResponse.ok) {
          console.error('Image fetch failed:', imageResponse.status, imageResponse.statusText);
          return NextResponse.json(
            { error: `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}` },
            { status: 400 }
          );
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const extension = contentType.split('/')[1] || 'jpg';
        const filename = `midjourney-${Date.now()}.${extension}`;

        // Upload to Vercel Blob
        blob = await put(filename, imageBuffer, {
          access: 'public',
          contentType,
          addRandomSuffix: true,
        });
      } catch (fetchError) {
        console.error('Image fetch error:', fetchError);
        return NextResponse.json(
          { error: `Failed to fetch image from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
          { status: 400 }
        );
      }
    } else if (file) {
      // Upload file to Vercel Blob
      blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      });
    } else {
      return NextResponse.json(
        { error: 'No file or URL provided' },
        { status: 400 }
      );
    }

    // Parse tags if provided
    const tagsArray = tags ? tags.split(',').map((t) => t.trim()) : [];

    // Insert into database
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO curated_images (
        id,
        blob_url,
        occasion,
        mood,
        style,
        midjourney_prompt,
        tags,
        is_active,
        usage_count,
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${blob.url},
        ${occasion},
        ${mood},
        ${style},
        ${midjourneyPrompt || null},
        ${tagsArray},
        true,
        0,
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      image: {
        id,
        blobUrl: blob.url,
        occasion,
        mood,
        style,
      },
    });
  } catch (error) {
    console.error('Error uploading curated image:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Get all curated images for admin
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT * FROM curated_images
      ORDER BY created_at DESC
    `;

    const images = result.map((row: any) => ({
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

// Delete curated image
export async function DELETE(request: Request) {
  try {
    // Verify admin authentication
    const adminPassword = request.headers.get('x-admin-password');
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
    }

    // Soft delete - mark as inactive
    await sql`
      UPDATE curated_images
      SET is_active = false, updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting curated image:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
