# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Configure Environment Variables

Create a `.env.local` file for local development:
```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

In Vercel Dashboard, add these environment variables:
- `NEXT_PUBLIC_SOCKET_URL` = `https://your-app-name.vercel.app` (update after first deployment)
- `CORS_ORIGIN` = `https://your-app-name.vercel.app` (optional, for stricter CORS)
- `PORT` = `3000` (optional)
- `HOSTNAME` = `0.0.0.0` (optional)

### 4. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

**Option B: Using GitHub Integration**
1. Push your code to GitHub
2. Connect your repository in Vercel Dashboard
3. Vercel will auto-deploy on every push to main branch

### 5. Post-Deployment Configuration

After first deployment, update the `NEXT_PUBLIC_SOCKET_URL` environment variable:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_SOCKET_URL` to match your deployment URL (e.g., `https://your-app-name.vercel.app`)
3. Redeploy the project for changes to take effect

## Important Notes

### Socket.IO Limitations on Vercel
⚠️ **Important**: Vercel's serverless functions have limitations that may affect real-time multiplayer:
- Serverless functions have a maximum execution time (10 seconds for Hobby plan)
- WebSocket connections may not persist between requests
- For production multiplayer, consider using:
  - **Vercel + External WebSocket Server** (Railway, Render, Heroku)
  - **Pusher** or **Ably** (managed real-time services)
  - **Supabase Realtime** (PostgreSQL + real-time subscriptions)

### Single Player Mode
The game works perfectly in single-player mode on Vercel without any modifications.

### Multiplayer Alternative (Recommended for Production)
For reliable multiplayer, host the Socket.IO server separately:

1. **Deploy Socket.IO server to Railway/Render:**
   - Create a new repository with just `server.js` and `package.json`
   - Deploy to Railway.app or Render.com
   - Get your server URL (e.g., `https://your-server.railway.app`)

2. **Update environment variables:**
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-server.railway.app
   ```

## Testing Deployment

1. Open your deployed URL
2. Test single-player mode first
3. For multiplayer:
   - Create a party
   - Join from another browser/device
   - Verify real-time synchronization

## Troubleshooting

### Socket connection fails
- Check browser console for errors
- Verify `NEXT_PUBLIC_SOCKET_URL` is correctly set
- Ensure CORS settings allow your domain

### Game doesn't load
- Check Vercel function logs
- Verify build completed successfully
- Check for any TypeScript errors

### Multiplayer doesn't sync
- Vercel serverless limitations may cause issues
- Consider external Socket.IO server (see above)

## Build Commands (Vercel auto-detects these)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Cost Considerations
- **Hobby Plan** (Free): Limited function execution time, may not work for long multiplayer sessions
- **Pro Plan**: Better for multiplayer with longer function execution times
- **External WebSocket Server**: Most reliable for production multiplayer
