# Whispering Art - Quick Start Guide

## Immediate Next Steps

### 1. Create Environment File

Copy the example and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual keys.

### 2. Get Your API Keys

#### OpenAI (Required for text generation)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account / Sign in
3. Go to API Keys section
4. Create a new key and copy it to `OPENAI_API_KEY`

#### Stripe (Required for payments)
1. Visit [stripe.com](https://stripe.com)
2. Create an account
3. Get your test keys from the Dashboard
4. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`

#### Vercel Blob (Required for image storage)
1. Visit [vercel.com](https://vercel.com)
2. Create a project
3. Go to Storage > Create Database > Blob
4. Copy the token to `BLOB_READ_WRITE_TOKEN`

#### Resend (Required for emails)
1. Visit [resend.com](https://resend.com)
2. Create an account
3. Verify a domain or use their test domain
4. Create an API key and add to `RESEND_API_KEY`
5. Update `lib/email.ts` line 9 with your verified email

#### Admin Password
- Set a secure password in `ADMIN_PASSWORD`
- You'll use this to access `/admin`

### 3. Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Test the Flow (Without Real Payments)

1. Select occasion, mood, and style
2. Click "Open MidJourney" (it will open the site)
3. Upload any test image
4. Review the AI-generated text
5. Customize the design
6. **Stop before checkout** (needs real Stripe setup)

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd whispering-art
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## Testing Checklist

- [ ] Intent selection works
- [ ] Image upload works
- [ ] Text generation returns results (requires OpenAI key)
- [ ] Design preview displays correctly
- [ ] Checkout form validates
- [ ] Admin login works (requires admin password)
- [ ] Stripe checkout redirects (requires Stripe keys)
- [ ] Email sends (requires Resend key)
- [ ] PDF generates (requires jsPDF)

## Common Issues

### "Failed to generate text"
- Check your `OPENAI_API_KEY` is valid
- Make sure you have credits in your OpenAI account

### "Upload failed"
- Check your `BLOB_READ_WRITE_TOKEN` is correct
- Ensure Vercel Blob storage is set up

### Stripe errors
- Use test mode keys for development
- Set up webhook endpoint after deployment

### Email not sending
- Verify your domain with Resend
- Update the `from` email in `lib/email.ts`

## Architecture Overview

```
User Flow:
1. Intent Selection → 2. Image Upload → 3. Text Generation → 4. Design → 5. Checkout

API Routes:
/api/upload-image → Vercel Blob
/api/generate-text → OpenAI GPT-4o
/api/create-checkout → Stripe
/api/webhooks/stripe → Order processing
/api/generate-pdf → jsPDF

Admin:
/admin → Order management dashboard
```

## What's Included

✅ Complete 5-step card creation flow
✅ MidJourney integration (manual)
✅ AI text generation with ChatGPT
✅ Live design preview
✅ Stripe checkout
✅ Email confirmations
✅ PDF generation for printing
✅ Admin dashboard
✅ Beautiful brand aesthetic
✅ Fully responsive design
✅ TypeScript throughout

## What You Need to Add

- **Database**: Currently uses placeholders. Add PostgreSQL/MongoDB for production
- **Order Storage**: Connect admin dashboard to real database
- **Image Optimization**: Add image processing/optimization
- **Error Monitoring**: Add Sentry or similar
- **Analytics**: Add Google Analytics or similar

## Production Checklist

Before going live:

- [ ] Replace all placeholder API keys
- [ ] Set up production Stripe account
- [ ] Configure Stripe webhooks
- [ ] Verify email domain with Resend
- [ ] Add a real database
- [ ] Set up error monitoring
- [ ] Test complete flow end-to-end
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Review and test print quality
- [ ] Set up your Epson printer connection

## Support

Questions? Check the main [README.md](./README.md) for detailed documentation.

---

✨ Happy building!
