# Deployment Guide: Vercel + Supabase Setup

This guide will walk you through deploying your website to Vercel and setting up Supabase as your database for form submissions.

## Prerequisites

- A GitHub account (for Vercel deployment)
- A Supabase account (free tier is sufficient)
- Your website code ready to deploy

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "quantnova-website")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be set up

### 1.2 Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql` file
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### 1.3 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API** (left sidebar)
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")
3. Copy both values - you'll need them for Vercel

## Step 2: Deploy to Vercel

### 2.1 Prepare Your Code

1. Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
2. If not already done, initialize git and push to GitHub:
   ```bash
   cd app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 2.2 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. **Important**: Before clicking "Deploy", click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
   | `GEMINI_API_KEY` | Your Google Gemini API key (server-side only) |

7. Click "Deploy"
8. Wait for deployment to complete (usually 1-2 minutes)

### 2.3 Verify Deployment

1. Once deployed, Vercel will give you a URL (e.g., `your-project.vercel.app`)
2. Visit the URL and test the contact form
3. Go back to Supabase → **Table Editor** → `contact_submissions`
4. You should see your test submission!

## Step 3: Test Your Form

1. Fill out the contact form on your deployed site
2. Submit it
3. Check Supabase:
   - Go to **Table Editor** → `contact_submissions`
   - You should see the new submission with all the form data

## Troubleshooting

### Form submissions not working?

1. **Check Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Redeploy after adding/changing environment variables

2. **Check Supabase RLS Policies**:
   - Go to Supabase → Authentication → Policies
   - Make sure the "Allow anonymous inserts" policy exists for `contact_submissions`

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for any error messages
   - Check the Network tab for failed requests

### Can't see submissions in Supabase?

- Make sure you're looking at the correct table: `contact_submissions`
- Check that RLS policies allow inserts (see SQL schema file)
- Verify your Supabase credentials are correct in Vercel

### Local Development

To test locally:

1. Create a `.env` file in the `app` directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

2. Run `npm run dev`
3. Test the form - submissions will go to your Supabase database

## Viewing Form Submissions

### Option 1: Supabase Dashboard (Recommended)
- Go to Supabase → **Table Editor** → `contact_submissions`
- View all submissions in a table format
- Export as CSV if needed

### Option 2: Supabase SQL Editor
Run this query to see all submissions:
```sql
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

### Option 3: Build an Admin Panel (Future)
You can create a simple admin page to view submissions. This would require:
- Adding authentication (Supabase Auth)
- Creating a read-only admin interface
- Querying the `contact_submissions` table

## Security Notes

- The current setup allows **anyone** to submit forms (which is what you want)
- Only **authenticated users** can read submissions (if you add auth later)
- For now, view submissions through the Supabase dashboard
- Consider adding rate limiting or CAPTCHA if you get spam

## Next Steps

- Set up email notifications when forms are submitted (using Supabase Edge Functions)
- Add form validation and spam protection
- Create an admin dashboard to view submissions
- Set up automated backups

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Check Supabase logs (Dashboard → Logs)
4. Verify all environment variables are set correctly
