# Troubleshooting: Chatbot Running in Offline Mode

If your chatbot is showing "offline mode" even after adding `KIMI_API_KEY` to Vercel, follow these steps:

## Step 1: Verify Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify `KIMI_API_KEY` is set:
   - **Key**: `KIMI_API_KEY` (no quotes, no spaces)
   - **Value**: Your actual API key starting with `sk-`
   - **Environment**: Should be set for **Production** (and optionally Preview/Development)

## Step 2: Redeploy After Adding Environment Variables

**CRITICAL**: After adding/changing environment variables, you MUST redeploy:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

OR push a new commit to trigger a new deployment.

## Step 3: Check Vercel Function Logs

1. In Vercel dashboard, go to **Functions** tab
2. Look for `/api/chat` function
3. Click on it to see logs
4. Check for errors like:
   - "Missing KIMI_API_KEY"
   - Any 500 errors
   - Network errors

## Step 4: Test the API Route Directly

Test if the API route is working:

1. Open your deployed site (e.g., `your-site.vercel.app`)
2. Open browser DevTools (F12) → **Console** tab
3. Try sending a message in the chatbot
4. Check the console for error messages
5. Go to **Network** tab and look for `/api/chat` request
6. Click on it to see the response

## Step 5: Common Issues

### Issue: "Missing KIMI_API_KEY server env var"

**Solution**: 
- Verify the env var name is exactly `KIMI_API_KEY` (case-sensitive)
- Make sure it's set for the correct environment (Production)
- **Redeploy** after adding it

### Issue: 404 Error on `/api/chat`

**Solution**:
- Verify `app/api/chat.ts` exists in your repository
- Check that Vercel detected it (should appear in Functions tab)
- Make sure you pushed the file to GitHub

### Issue: CORS Error

**Solution**: The API route already includes CORS headers. If you still see CORS errors:
- Check browser console for specific error
- Verify the API route is being called correctly

### Issue: API Route Not Detected by Vercel

**Solution**:
- Make sure `app/api/chat.ts` is in your repository
- Verify the file structure:
  ```
  app/
    api/
      chat.ts
  ```
- Push to GitHub and redeploy

## Step 6: Verify Project Structure

Your project should have:
```
app/
  api/
    chat.ts          ← API route (serverless function)
  src/
    lib/
      chatbotService.ts  ← Calls /api/chat
  vercel.json        ← Vercel config
```

## Step 7: Check Browser Console

When testing the chatbot:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages when you send a message
4. Common errors:
   - `Failed to fetch` → API route not found or network error
   - `API error: 500` → Check Vercel function logs
   - `Missing KIMI_API_KEY` → Environment variable not set

## Still Not Working?

1. **Check Vercel Logs**: Go to your deployment → **Functions** → `/api/chat` → View logs
2. **Verify API Key**: Make sure your Kimi API key is valid and active
3. **Test Locally**: Add `KIMI_API_KEY` to `.env` file and test with `npm run dev`
4. **Contact Support**: Share the error messages from Vercel logs

## Quick Test

To quickly test if the API route works, you can use curl:

```bash
curl -X POST https://your-site.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "moonshot-v1-8k"
  }'
```

If you get an error about missing `KIMI_API_KEY`, the environment variable isn't set correctly.
