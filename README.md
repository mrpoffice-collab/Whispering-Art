# Whispering Art by Nana

> Where words and art whisper together

An art-centered greeting card atelier — a quiet, elegant digital space where art and words come together to create handcrafted greeting cards.

## Features

- **5-Step Card Creation Flow**
  1. Intent Selection (occasion, mood, art style)
  2. MidJourney Image Integration
  3. AI-Generated Text with ChatGPT
  4. Design Composition with Live Preview
  5. Stripe Checkout & Email Confirmation

- **Brand Aesthetic**
  - Elegant typography (Lora, Playfair Display, Great Vibes, Allura)
  - Soft color palette (cream, sage, blush, gold)
  - Paper texture effects
  - Smooth animations and transitions

- **Tech Stack**
  - Next.js 15 with App Router
  - TypeScript
  - Tailwind CSS
  - Vercel Blob Storage
  - Stripe Payments
  - OpenAI GPT-4o
  - jsPDF for print generation
  - Resend for emails

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Vercel account
- Stripe account
- OpenAI API key
- Resend account (for email)
- MidJourney subscription

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Resend Email API
RESEND_API_KEY=your_resend_api_key_here

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password_here

# Base URL (update for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
cd whispering-art
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Configure Stripe Webhooks

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 6. Configure Vercel Blob Storage

1. In your Vercel project dashboard, go to Storage
2. Create a new Blob store
3. Copy the `BLOB_READ_WRITE_TOKEN` to your `.env.local`

### 7. Configure Resend Email

1. Go to [Resend](https://resend.com) and create an account
2. Verify your domain
3. Create an API key and add to `RESEND_API_KEY`
4. Update the `from` email in `lib/email.ts` to match your verified domain

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

```bash
# Or deploy via CLI
vercel --prod
```

### Post-Deployment

1. Update `NEXT_PUBLIC_BASE_URL` to your production URL
2. Update Stripe webhook URL to production endpoint
3. Test the complete flow with a test payment

## Usage

### Customer Flow

1. Visit the homepage
2. Select occasion, mood, and art style
3. Generate/upload MidJourney image
4. Review AI-generated text (can be refined)
5. Customize design layout
6. Enter recipient address and checkout
7. Receive email confirmation

### Admin Dashboard

1. Visit `/admin`
2. Enter admin password
3. View all orders with filter options
4. Download print-ready PDFs
5. Update order status (Paid → Printed → Mailed)

## Project Structure

```
whispering-art/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin authentication & orders
│   │   ├── create-checkout/ # Stripe checkout
│   │   ├── generate-pdf/   # PDF generation
│   │   ├── generate-text/  # ChatGPT integration
│   │   ├── upload-image/   # Image upload to Blob
│   │   └── webhooks/       # Stripe webhooks
│   ├── admin/              # Admin dashboard
│   ├── success/            # Success page after payment
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main app with step flow
│   └── globals.css         # Global styles
├── components/
│   ├── IntentSelection.tsx     # Step 1
│   ├── ImageSelection.tsx      # Step 2
│   ├── TextGeneration.tsx      # Step 3
│   ├── DesignComposition.tsx   # Step 4
│   └── Checkout.tsx            # Step 5
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── pdf-generator.ts    # jsPDF card generation
│   └── email.ts            # Resend email templates
├── types/
│   └── index.ts            # TypeScript types
└── tailwind.config.ts      # Tailwind configuration
```

## Artistic Standards

- **Typography**: Lora/Playfair for body, Great Vibes/Allura for signatures
- **Layout**: 0.25″ safe margins, A7 format (5×7 inches)
- **Colors**: Cream (#FAF7F2), Sage (#C9D5C5), Blush (#F2D5D7), Gold (#D4AF7A)
- **Tone**: Honest, sincere, emotional — never generic
- **Print**: 300 DPI, print-ready PDFs

## Pricing

- Card: $3.00
- Postage: $0.73 (first-class stamp)
- **Total: $3.73**

## Support

For questions or issues:
- Email: hello@whisperingart.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/whispering-art/issues)

## License

Private project for Whispering Art by Nana. All rights reserved.

---

✨ *Because some feelings deserve paper.*
