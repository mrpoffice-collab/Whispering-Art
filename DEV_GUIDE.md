# Development Guide - Whispering Art

## Handling Cache Issues

Next.js with Turbopack can sometimes have cache issues, especially with CSS updates. Here are your solutions:

### Quick Cache Clearing

**Option 1: Use the clean script (fastest)**
```bash
npm run clean
```
This removes the `.next` folder and clears the build cache.

**Option 2: Clean and restart dev server**
```bash
npm run dev:clean
```
This cleans the cache and starts the dev server in one command.

**Option 3: Deep clean (if issues persist)**
```bash
npm run clean:all
```
This removes both `.next` and `node_modules/.cache` folders.

### Development Workflow

**When to clean cache:**
- CSS changes not reflecting
- Unexpected styling issues
- Build errors after major changes
- Server behaving strangely

**Best practice:**
1. Make your changes
2. If changes don't appear: Stop server (Ctrl+C)
3. Run `npm run dev:clean`
4. Server starts fresh with no cache

### Configuration Changes Made

**package.json scripts added:**
- `clean` - Removes .next folder
- `clean:all` - Deep clean (includes node_modules/.cache)
- `dev:clean` - Clean and start dev server

**next.config.ts optimizations:**
- Reduced page buffer to prevent stale caching
- Configured Turbopack for better CSS handling
- Shorter inactive age for faster updates

### Multiple Server Instances

If you have multiple dev servers running (causing port conflicts):

**Windows:**
```bash
taskkill /F /IM node.exe
```

**Then start fresh:**
```bash
npm run dev:clean
```

### Recommended Development Process

1. **Start development:**
   ```bash
   npm run dev:clean
   ```

2. **Make changes** - Edit files as needed

3. **If changes don't appear:**
   - Stop server (Ctrl+C)
   - Run `npm run dev:clean` again

4. **For major refactors:**
   ```bash
   npm run clean:all
   npm install
   npm run dev
   ```

### Key Files for Styling

- `app/globals.css` - Global styles, paper textures, animations
- `tailwind.config.ts` - Color system, shadows, animations
- `app/layout.tsx` - Font configuration

**After editing these files:** Always run `npm run dev:clean` for guaranteed fresh start.

## Design System Quick Reference

### Colors (Ink Tones - NO GREY)
- `whisper-inkBlack` - #0D0B0B (primary text)
- `whisper-plum` - #5B3E43 (accent)
- `whisper-parchment` - #F9F4EE (background)
- `whisper-blushRose` - #EAD8CF (soft highlight)
- `whisper-sage` - #C7C8B8 (muted tone)

### Fonts
- `font-cormorant` - Primary serif (body text, headers)
- `font-greatVibes` - Script (signatures, special headers)
- `font-baskerville` - Alternative serif

### Key CSS Classes
- `.paper-bg` - Premium paper background (5 layers)
- `.paper-card` - Elevated card with shadows
- `.watermark-whisper` - Subtle watermark
- `.hover-shimmer` - Gentle lift on hover
- `.click-settle` - Subtle press effect
- `.glow-soft` - Luminous glow

### Transitions
All transitions under 200ms for gentle feel:
- `duration-150` for most interactions
- `duration-100` for active states

## Port Configuration

Default: http://localhost:3000
If 3000 is busy: http://localhost:3001

To specify port:
```bash
PORT=3002 npm run dev
```
