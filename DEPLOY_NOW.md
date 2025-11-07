# 🚀 Deploy to Vercel - Step by Step

## ✅ GitHub: DONE!

Your code is live at: **https://github.com/mrpoffice-collab/Whispering-Art**

## 🌐 Next: Deploy to Vercel

### Step 1: Go to Vercel

Open: [https://vercel.com/new](https://vercel.com/new)

### Step 2: Import Your Repository

1. Click **"Import Git Repository"**
2. Select **"mrpoffice-collab/Whispering-Art"**
3. Click **"Import"**

### Step 3: Configure Project

**Project Name:** `whispering-art` (or your choice)
**Framework Preset:** Next.js (auto-detected ✅)
**Root Directory:** `./` (default)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

```bash
# OpenAI (get from your .env.local file)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# Stripe (GET THESE FIRST from stripe.com/dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Vercel Blob (GET AFTER DEPLOYMENT)
BLOB_READ_WRITE_TOKEN=will_add_after_deployment

# Resend (get from your .env.local file)
RESEND_API_KEY=re_YOUR_RESEND_KEY_HERE

# Admin
ADMIN_PASSWORD=WhisperingArt2025

# Base URL (UPDATE AFTER DEPLOYMENT)
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

**Note:** Copy the actual values from your local `.env.local` file when adding to Vercel.

### Step 5: Deploy!

Click **"Deploy"**

Vercel will:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Build your app
- ✅ Deploy to production

**Wait 2-3 minutes...**

## 📋 After First Deployment

### 1. Get Your Vercel URL

After deployment completes, you'll see something like:
`https://whispering-art-xyz123.vercel.app`

**Copy this URL!**

### 2. Update Base URL

In Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Find `NEXT_PUBLIC_BASE_URL`
4. Update to your actual URL: `https://whispering-art-xyz123.vercel.app`
5. Click "Save"
6. Redeploy (Deployments → click "..." → Redeploy)

### 3. Create Vercel Blob Storage

In Vercel dashboard:
1. Go to **Storage** tab
2. Click **"Create Database"**
3. Select **"Blob"**
4. Create with default settings
5. Click on your new Blob store
6. Copy the **`BLOB_READ_WRITE_TOKEN`**
7. Go back to Settings → Environment Variables
8. Add `BLOB_READ_WRITE_TOKEN` with your token
9. Redeploy

### 4. Get Stripe Keys (If You Haven't)

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. **Toggle to TEST MODE** (important!)
3. Go to **Developers → API Keys**
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal"
5. Add both to Vercel Environment Variables
6. Redeploy

### 5. Configure Stripe Webhook

1. Still in Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-project.vercel.app/api/webhooks/stripe`
4. Click **"Select events"**
5. Choose: `checkout.session.completed`
6. Click **"Add endpoint"**
7. **Note:** The webhook secret should match the one you already have

### 6. Update Email Domain

Locally, edit `lib/email.ts` line 9:

```typescript
from: 'Whispering Art <noreply@YOUR-VERIFIED-DOMAIN.com>',
```

Then push to GitHub:
```bash
git add lib/email.ts
git commit -m "Update email domain"
git push
```

Vercel will auto-deploy! ✨

## 🧪 Test Your Live Site!

Visit your Vercel URL and test:

### Test Card Creation Flow
1. **Step 1:** Select occasion, mood, style ✅
2. **Step 2:** Upload an image ✅
3. **Step 3:** Generate text ✅
4. **Step 4:** Customize design ✅
5. **Step 5:** Complete checkout

### Test Stripe Payment

Use Stripe test card:
- **Card:** 4242 4242 4242 4242
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

### Test Admin Panel

- URL: `https://your-project.vercel.app/admin`
- Password: `WhisperingArt2025`

## 🎯 Checklist

**Deployment:**
- [ ] Pushed to GitHub ✅ (DONE!)
- [ ] Imported to Vercel
- [ ] Added environment variables
- [ ] First deployment completed
- [ ] Got Vercel URL

**Post-Deployment:**
- [ ] Updated `NEXT_PUBLIC_BASE_URL`
- [ ] Created Vercel Blob storage
- [ ] Added `BLOB_READ_WRITE_TOKEN`
- [ ] Got Stripe test keys
- [ ] Added Stripe keys to Vercel
- [ ] Configured Stripe webhook
- [ ] Updated email domain (optional)

**Testing:**
- [ ] Visited live site
- [ ] Created test card
- [ ] Completed checkout with test card
- [ ] Received confirmation email
- [ ] Logged into admin panel
- [ ] Downloaded PDF

## 🔄 Auto-Deploy on Every Push

Now that you're connected:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys! 🚀
```

## 📊 Vercel Dashboard Features

Your Vercel dashboard shows:
- **Deployments** - Every deployment history
- **Analytics** - Visitor stats
- **Logs** - Runtime logs for debugging
- **Domains** - Add custom domain
- **Environment Variables** - Manage secrets
- **Storage** - Your Blob storage

## 🆘 Troubleshooting

### Build fails
- Check build logs in Vercel
- Verify all env vars are added
- Make sure you pushed latest code

### "API key not found"
- Verify env var names match exactly
- Redeploy after adding variables

### Images won't upload
- Make sure `BLOB_READ_WRITE_TOKEN` is set
- Check Storage tab in Vercel

### Emails not sending
- Verify `RESEND_API_KEY` is correct
- Check your Resend dashboard for errors
- Update email domain in code

### Stripe checkout fails
- Verify you're using TEST mode keys
- Check both publishable and secret keys are set
- Make sure keys start with `pk_test_` and `sk_test_`

## 🎉 You're Live!

Once deployed, share your site:
- Main site: `https://your-project.vercel.app`
- Admin panel: `https://your-project.vercel.app/admin`

**Your art atelier is live!** 🌸

---

**Next:** Follow the steps above to deploy to Vercel!
