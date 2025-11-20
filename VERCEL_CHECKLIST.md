# Vercel Deployment Checklist

## Before Deploying

- [ ] All TypeScript errors fixed
- [ ] Code committed to Git
- [ ] `.env.local.example` reviewed
- [ ] Vercel CLI installed: `npm i -g vercel`

## First Deployment

1. [ ] Login to Vercel
   ```bash
   vercel login
   ```

2. [ ] Deploy to production
   ```bash
   vercel --prod
   ```

3. [ ] Note your deployment URL (e.g., `https://your-app-name.vercel.app`)

## Post-Deployment Configuration

4. [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables

5. [ ] Add environment variable:
   - **Name**: `NEXT_PUBLIC_SOCKET_URL`
   - **Value**: `https://your-app-name.vercel.app` (your deployment URL)
   - **Environment**: All (Production, Preview, Development)

6. [ ] Optional: Add CORS_ORIGIN for stricter security
   - **Name**: `CORS_ORIGIN`
   - **Value**: `https://your-app-name.vercel.app`
   - **Environment**: Production

7. [ ] Redeploy to apply environment variables
   ```bash
   vercel --prod
   ```

## Testing

8. [ ] Open your deployed URL
9. [ ] Test single-player mode
10. [ ] Test multiplayer (create party, join from another browser)
11. [ ] Check browser console for any errors

## For Production Multiplayer (Optional)

If multiplayer doesn't work reliably on Vercel:

12. [ ] Deploy Socket.IO server separately (Railway, Render, or Heroku)
13. [ ] Update `NEXT_PUBLIC_SOCKET_URL` to point to external server
14. [ ] Redeploy

## Common Issues

### Socket connection fails
- Verify `NEXT_PUBLIC_SOCKET_URL` environment variable is set
- Check browser console for CORS errors
- Ensure you redeployed after adding environment variables

### Multiplayer lag or disconnections
- Vercel's serverless functions have execution time limits
- Consider deploying Socket.IO server separately for better performance

### Build fails
- Check Vercel function logs
- Run `npm run build` locally to catch errors
- Verify all dependencies are in `package.json`

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

## Next Steps After Successful Deployment

- [ ] Share the URL with others to test multiplayer
- [ ] Monitor Vercel analytics and function logs
- [ ] Consider upgrading to Vercel Pro for better multiplayer performance
- [ ] Or set up external Socket.IO server for production-grade multiplayer
