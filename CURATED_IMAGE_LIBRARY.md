# 🎨 Curated Image Library System

## Overview

Your Whispering Art application now has a **curated image library** that allows you to pre-load MidJourney-generated images for users to choose from, eliminating the need for users to have MidJourney subscriptions.

## How It Works

### For You (Admin)

1. **Generate Images in MidJourney**
   - Use your MidJourney subscription
   - Create beautiful images for each occasion/mood/style combination
   - Download the high-quality images

2. **Upload to Your Library**
   - Go to `/admin/images` (Admin → Images)
   - Select: Occasion, Mood, Art Style
   - Add optional MidJourney prompt and tags
   - Upload the image file
   - Click "Upload Image"

3. **Images Are Stored Permanently**
   - Uploaded to Vercel Blob Storage
   - Saved in PostgreSQL database
   - Tagged with metadata for filtering
   - Reusable across all customers

### For Your Users

1. **User Selects Intent** (Step 1)
   - Choose: Occasion, Mood, Art Style
   - Example: Birthday + Joyful + Watercolor

2. **See Matching Gallery** (Step 2)
   - App shows **only images matching their selections**
   - Beautiful grid layout
   - Click to select
   - No MidJourney needed!

3. **Optional: Upload Their Own**
   - Button says "Or upload your own image"
   - For personal photos (sympathy cards, etc.)
   - Falls back to upload if no gallery images exist

## Database Schema

### `curated_images` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Unique identifier |
| `blob_url` | TEXT | Permanent Vercel Blob URL |
| `thumbnail_url` | TEXT | Optional smaller preview |
| `occasion` | TEXT | birthday, sympathy, etc. |
| `mood` | TEXT | gentle, joyful, etc. |
| `style` | TEXT | watercolor, vintage, etc. |
| `midjourney_prompt` | TEXT | Original MJ prompt (optional) |
| `tags` | TEXT[] | Additional search tags |
| `is_active` | BOOLEAN | Soft delete flag |
| `usage_count` | INTEGER | Times users selected this |
| `created_at` | TIMESTAMP | Upload date |
| `updated_at` | TIMESTAMP | Last modified |

### Indexes

- `idx_curated_occasion` - Fast filtering by occasion
- `idx_curated_mood` - Fast filtering by mood
- `idx_curated_style` - Fast filtering by style
- `idx_curated_filters` - Composite index for combined filters

## Admin Interface

### Upload New Images

**URL:** `/admin/images`

**Features:**
- Select occasion/mood/style dropdowns
- Add MidJourney prompt (saved for reference)
- Add tags (comma-separated)
- Drag & drop image upload
- Preview before uploading
- See all uploaded images in grid

**Process:**
1. Log in to `/admin` with your password
2. Navigate to "Images" or go directly to `/admin/images`
3. Fill out the form:
   - **Occasion:** Which event (birthday, sympathy, etc.)
   - **Mood:** Emotional tone (joyful, gentle, etc.)
   - **Art Style:** Visual aesthetic (watercolor, vintage, etc.)
   - **MidJourney Prompt:** (Optional) Save the prompt you used
   - **Tags:** (Optional) Additional keywords like "flowers, spring, pastel"
4. Upload the image file
5. Click "Upload Image"

### View/Manage Images

- Grid view of all uploaded images
- Shows occasion, mood, style
- Shows usage count (how many times selected)
- Delete button (soft delete - marks inactive)
- Sorted by least-used first (ensures variety)

## API Endpoints

### Public: Fetch Curated Images

```
GET /api/curated-images?occasion=birthday&mood=joyful&style=watercolor
```

**Response:**
```json
{
  "images": [
    {
      "id": "uuid",
      "blobUrl": "https://blob.vercel-storage.com/...",
      "occasion": "birthday",
      "mood": "joyful",
      "style": "watercolor",
      "tags": ["flowers", "spring"],
      "usageCount": 5
    }
  ]
}
```

### Admin: Upload Image

```
POST /api/admin/curated-images
Headers: x-admin-password: your_password
Body: FormData with file + metadata
```

### Admin: Get All Images

```
GET /api/admin/curated-images
Headers: x-admin-password: your_password
```

### Admin: Delete Image

```
DELETE /api/admin/curated-images?id=uuid
Headers: x-admin-password: your_password
```

## Recommended Image Collection

To provide a comprehensive gallery, consider uploading:

### Minimum Viable Collection (~56 images)

| Occasion | Count | Example Combinations |
|----------|-------|---------------------|
| Birthday | 8 | joyful+watercolor, playful+vintage, warm+floral |
| Sympathy | 8 | gentle+botanical, peaceful+minimalist, reflective+impressionist |
| Gratitude | 6 | warm+watercolor, joyful+floral, gentle+vintage |
| Love | 6 | warm+floral, playful+watercolor, gentle+vintage |
| Comfort | 6 | peaceful+botanical, gentle+watercolor, warm+minimalist |
| Faith | 6 | peaceful+vintage, gentle+botanical, reflective+minimalist |
| Celebration | 8 | joyful+watercolor, playful+vintage, warm+floral |
| Encouragement | 8 | hopeful+botanical, warm+watercolor, lighthearted+vintage |

### Comprehensive Collection (~200 images)

Cover all major combinations:
- 8 occasions × 8 moods × 7 styles = 448 total possible combinations
- Focus on popular combinations (200 covers ~45%)
- Prioritize based on usage analytics

### Starting Point (10 images to test)

1. Birthday + Joyful + Watercolor
2. Sympathy + Gentle + Botanical
3. Gratitude + Warm + Floral
4. Love + Playful + Watercolor
5. Birthday + Playful + Vintage
6. Sympathy + Peaceful + Minimalist
7. Celebration + Joyful + Floral
8. Encouragement + Hopeful + Botanical
9. Comfort + Gentle + Watercolor
10. Faith + Peaceful + Vintage

## Workflow: Building Your Library

### Phase 1: Initial Collection (Week 1)

1. **Generate 10 test images** in MidJourney
   - Use diverse occasion/mood/style combinations
   - Download high-resolution versions
   - Save prompts used

2. **Upload via Admin**
   - Go to `/admin/images`
   - Upload each image with metadata
   - Test user flow with real customers

3. **Gather Analytics**
   - Monitor which combinations are most requested
   - Note which gallery slots are empty

### Phase 2: Expand Based on Demand (Week 2-4)

1. **Fill Popular Gaps**
   - If users often select "Birthday + Joyful + ..." but no images exist
   - Generate batch of images for that combination

2. **Generate in Batches**
   - Do 10-20 images per MidJourney session
   - Keep prompts consistent for cohesive aesthetic
   - Upload same day

3. **Track Usage**
   - Check `usage_count` in admin
   - Regenerate under-performing images
   - Add variety to over-used categories

### Phase 3: Complete Coverage (Month 2+)

1. **Aim for 150-200 images**
   - Covers most popular paths
   - Rare combinations can fall back to upload

2. **Seasonal Updates**
   - Add holiday-specific images
   - Refresh styles based on trends
   - Archive outdated aesthetics

## User Experience Flow

### Scenario A: Images Exist in Gallery

```
User: Selects "Birthday + Joyful + Watercolor"
  ↓
App: Queries database for matching images
  ↓
App: Shows 3-5 beautiful watercolor birthday images
  ↓
User: Clicks favorite
  ↓
User: Continues to text generation
```

### Scenario B: No Images in Gallery

```
User: Selects rare combination
  ↓
App: Queries database → 0 results
  ↓
App: Shows "Upload your own image" prompt
  ↓
User: Uploads from computer
  ↓
App: Stores in Blob, continues flow
```

### Scenario C: User Wants Personal Photo

```
User: Sees gallery
  ↓
User: Clicks "Or upload your own image"
  ↓
User: Uploads personal photo
  ↓
App: Stores in Blob, continues flow
```

## Benefits of This System

### For You
- ✅ **One-time MidJourney cost** → Infinite customer reuse
- ✅ **Control quality** → Curate beautiful consistent images
- ✅ **Build brand aesthetic** → Cohesive visual identity
- ✅ **Track popularity** → Data-driven image creation
- ✅ **Fast user experience** → No generation wait time

### For Your Users
- ✅ **No MidJourney needed** → Lower barrier to entry
- ✅ **Instant selection** → Browse and pick
- ✅ **Beautiful options** → Professionally curated
- ✅ **Still flexible** → Can upload personal photos
- ✅ **Better UX** → Gallery vs empty upload box

## Cost Analysis

### Before (User has MidJourney)
- User: $10/month MidJourney subscription
- You: Free
- **Total: $10/month per user**

### After (Curated Library)
- User: $0
- You:
  - $10/month MidJourney (one-time generations)
  - ~$0.15/GB Blob storage (negligible for 200 images)
  - PostgreSQL: Free tier
- **Total: ~$10/month total for unlimited users**

### Break-Even

- 2+ customers = Already cheaper than each having MidJourney
- 10+ customers = 10x cost savings
- 100+ customers = 100x cost savings

## Next Steps

1. **Initialize Database** (Automatic on first deployment)
   - Tables created automatically via `initDatabase()`
   - Indexes optimized for fast queries

2. **Create Starter Collection** (Manual)
   - Generate 10 test images in MidJourney
   - Upload via `/admin/images`
   - Test user flow

3. **Launch & Monitor** (Ongoing)
   - Deploy to production
   - Watch which combinations users select
   - Fill gaps based on demand

4. **Scale Collection** (Monthly)
   - Add 20-50 images per month
   - Reach 150-200 total over 3-6 months
   - Maintain and refresh based on analytics

## Support

- Gallery not showing? Check `/admin/images` to ensure images are uploaded
- Wrong images showing? Verify occasion/mood/style tags match user selections
- Upload failing? Check `BLOB_READ_WRITE_TOKEN` in environment variables
- Database error? Run `initDatabase()` or check DATABASE_URL

---

**Your curated image library makes Whispering Art accessible to everyone, not just MidJourney users!** 🎨✨
