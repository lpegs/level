# 🚀 Ready to Deploy!

Your project is ready for Vercel deployment. Follow these steps:

## Step 1: Commit Changes (Optional but Recommended)

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

## Step 2: Deploy to Vercel

### Option A: Quick Deploy (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-deploy

## Step 3: Configure Environment Variables

After your first deployment:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add this variable:

   **Key**: `NEXT_PUBLIC_SOCKET_URL`  
   **Value**: `https://your-app-name.vercel.app` (replace with your actual Vercel URL)  
   **Environments**: Select all (Production, Preview, Development)

5. Click **Save**

## Step 4: Redeploy

After adding the environment variable, redeploy:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel Dashboard.

## Step 5: Test Your Deployment

1. Open your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Test single-player mode ✅
3. Test multiplayer:
   - Click "Multiplayer"
   - Create a party
   - Join from another browser/device
   - Start game and verify synchronization

## ⚠️ Important Notes

### Multiplayer Limitations on Vercel

Vercel's serverless functions have limitations:
- ✅ Single-player works perfectly
- ⚠️ Multiplayer works but may have issues with long sessions
- 💡 For production multiplayer, consider deploying Socket.IO server separately

### If Multiplayer Doesn't Work Well

See `DEPLOYMENT.md` for instructions on deploying the Socket.IO server to:
- Railway.app (recommended, easy)
- Render.com
- Heroku
- Any VPS

## 🎮 What's Deployed

- ✅ All game features
- ✅ Character selection
- ✅ Skills and combat system
- ✅ XP and leveling
- ✅ Single-player mode
- ✅ Multiplayer party system
- ✅ Real-time synchronization

## 📝 Files Changed for Deployment

- `lib/socket.ts` - Dynamic socket URL
- `server.js` - Environment variable support
- `types/game.ts` - Fixed TypeScript errors
- `vercel.json` - Vercel configuration
- `.env.local.example` - Environment variable template

## 🆘 Troubleshooting

### Build fails
```bash
npm run build
```
Fix any errors locally first.

### Socket connection fails
- Check browser console
- Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Make sure you redeployed after adding env vars

### Can't find vercel command
```bash
npm install -g vercel
```

## 📚 More Info

- Full guide: `DEPLOYMENT.md`
- Step-by-step: `VERCEL_CHECKLIST.md`
- Summary: `VERCEL_SUMMARY.md`

## 🚀 Quick Deploy (Copy-Paste)

```bash
# If you haven't committed changes yet
git add .
git commit -m "Configure for Vercel deployment"

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login and deploy
vercel login
vercel --prod

# After deployment, add NEXT_PUBLIC_SOCKET_URL in Vercel Dashboard
# Then redeploy
vercel --prod
```

---

**Need help?** Check the troubleshooting section in `DEPLOYMENT.md`
