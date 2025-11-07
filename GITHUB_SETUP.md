# GitHub + Vercel Setup Guide

## 🔐 Security First

Your `.gitignore` is already configured to protect your secrets:
- ✅ `.env.local` will NOT be committed (contains your API keys)
- ✅ `.env.local.example` WILL be committed (template without keys)

**IMPORTANT:** Never commit real API keys to GitHub!

## 📤 Initial GitHub Setup

### 1. Initialize Git Repository

```bash
cd whispering-art

# Initialize git (if not already done)
git init

# Check what will be committed
git status

# You should see .env.local.example but NOT .env.local
```

### 2. Create Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name it: `whispering-art` (or your preferred name)
4. **Keep it Private** (recommended for business projects)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 3. Push to GitHub

```bash
# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Whispering Art by Nana complete application"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/whispering-art.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🚀 Connect to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. **Before deploying**, add environment variables:

   ```
   OPENAI_API_KEY=your_actual_key
   STRIPE_SECRET_KEY=your_actual_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_actual_key
   STRIPE_WEBHOOK_SECRET=your_actual_key
   BLOB_READ_WRITE_TOKEN=your_actual_key
   RESEND_API_KEY=your_actual_key
   ADMIN_PASSWORD=your_actual_password
   NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
   ```

6. Click "Deploy"
7. Vercel will automatically deploy on every push to main

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your GitHub repo
vercel link

# Add environment variables via CLI
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... add all others

# Deploy
vercel --prod
```

## 🔄 Continuous Deployment

Once connected, Vercel automatically:
- ✅ Deploys every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Runs your build and tests
- ✅ Updates your live site

### Workflow:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys!
# Check deployment status at vercel.com/dashboard
```

## 🌿 Branching Strategy (Recommended)

```bash
# Create development branch
git checkout -b develop

# Work on features
git checkout -b feature/new-card-style

# When done, merge to develop
git checkout develop
git merge feature/new-card-style

# Test on develop branch preview (Vercel auto-creates)

# When ready for production
git checkout main
git merge develop
git push

# Production deploys automatically!
```

## 📋 Vercel Configuration

Your app is already configured, but here's what Vercel uses:

**Framework:** Next.js (auto-detected)
**Build Command:** `npm run build`
**Output Directory:** `.next` (auto)
**Install Command:** `npm install`

## 🔗 Post-Deployment Setup

After your first deployment:

### 1. Update Stripe Webhook

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-project.vercel.app/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to Vercel env vars

### 2. Update Base URL

In Vercel dashboard:
- Update `NEXT_PUBLIC_BASE_URL` to your production URL
- Redeploy if needed

### 3. Test Complete Flow

- [ ] Visit your live site
- [ ] Create a test card
- [ ] Use Stripe test mode
- [ ] Verify email sends
- [ ] Check admin panel

## 🔒 Environment Variables Management

### View Current Variables
```bash
vercel env ls
```

### Update a Variable
```bash
vercel env rm OPENAI_API_KEY
vercel env add OPENAI_API_KEY
```

### Different Environments

Vercel supports three environments:
- **Production**: Used for `main` branch
- **Preview**: Used for pull requests
- **Development**: Used locally

You can set different values for each.

## 🐛 Troubleshooting

### "API key not found" errors
- Verify all env vars are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### Webhook not receiving events
- Verify webhook URL is correct in Stripe
- Check webhook signing secret matches Vercel env var
- Test webhook in Stripe dashboard

## 📱 Vercel Features You Get

- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic Preview URLs
- ✅ Build logs and analytics
- ✅ Automatic Git integration
- ✅ Zero-config deployment
- ✅ Edge functions
- ✅ Built-in monitoring

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev              # Local development
npm run build           # Test build locally

# Git
git status              # Check changes
git add .               # Stage changes
git commit -m "message" # Commit changes
git push                # Push to GitHub (auto-deploys)

# Vercel
vercel                  # Deploy to preview
vercel --prod          # Deploy to production
vercel logs            # View logs
vercel env ls          # List environment variables
```

## 📊 Recommended GitHub Actions (Optional)

You can add automated checks:

1. Create `.github/workflows/test.yml`
2. Add tests on pull requests
3. Auto-format code
4. Type checking

But Vercel already handles deployment, so this is optional!

## ✨ Benefits of GitHub + Vercel

1. **Version Control**: Track all changes
2. **Collaboration**: Easy to work with team
3. **Backups**: Code is always backed up
4. **Rollbacks**: Easy to revert if something breaks
5. **Preview Deploys**: Test before going live
6. **Automatic Deployments**: Push code, it deploys
7. **Professional Workflow**: Industry standard

## 🎯 Your Typical Workflow

```bash
# 1. Make changes locally
code .

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Added new feature"
git push

# 4. Vercel automatically deploys
# 5. Check deployment at vercel.com
# 6. Test live site
# 7. Done! ✨
```

---

**That's it!** Your GitHub + Vercel workflow is simple and professional.
