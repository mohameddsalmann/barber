# Vercel Deployment Checklist ✅

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

- [x] Code pushed to GitHub repository
- [x] `vercel.json` configuration file created
- [x] `.vercelignore` file created
- [x] Build scripts verified in `package.json`
- [ ] All environment variables documented
- [ ] API keys obtained and ready

## Vercel Setup

- [ ] Vercel account created/logged in
- [ ] GitHub repository connected to Vercel
- [ ] Project imported to Vercel
- [ ] Build settings verified:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`

## Environment Variables

Add these in Vercel project settings → Environment Variables:

- [ ] `HF_API_KEY` (Hugging Face)
- [ ] `OPENROUTER_API_KEY` (OpenRouter)
- [ ] `FAL_API_KEY` (FAL AI)
- [ ] `REPLICATE_API_TOKEN` (Replicate)

**Important**: Add for all environments (Production, Preview, Development)

## Deployment

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Verify deployment URL is accessible

## Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works across all pages
- [ ] Responsive design works on mobile/tablet/desktop

### Dashboard Features
- [ ] Admin dashboard accessible
- [ ] POS system functional
- [ ] Analytics display correctly
- [ ] Calendar loads and works
- [ ] Client management works
- [ ] Barber management works

### Barber Features
- [ ] Barber dashboard loads
- [ ] Queue view works
- [ ] Profile management functional
- [ ] Earnings display correctly

### Client Features
- [ ] Client dashboard accessible
- [ ] Barber selection works
- [ ] Queue status updates
- [ ] Profile management works

### AI Features (Critical)
- [ ] Style Studio loads
- [ ] Image upload works
- [ ] AI try-on generates results
- [ ] Style discovery works
- [ ] Error handling works for API failures

## Troubleshooting

If issues occur:

1. **Build Fails**
   - Check Vercel build logs
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Blank Page**
   - Check browser console for errors
   - Verify environment variables are set
   - Check network tab for failed requests

3. **AI Features Not Working**
   - Verify all API keys are correct
   - Check API key permissions
   - Test each API provider individually
   - Check API rate limits

4. **Slow Performance**
   - Check bundle size in build logs
   - Verify images are optimized
   - Check for unnecessary re-renders

## Continuous Deployment

- [ ] Automatic deployments enabled for `master` branch
- [ ] Preview deployments enabled for pull requests
- [ ] Deployment notifications configured (optional)

## Documentation

- [ ] README.md updated with deployment info
- [ ] Team members informed of deployment
- [ ] Environment variables shared securely with team
- [ ] Deployment URL shared with stakeholders

## Monitoring

- [ ] Set up Vercel Analytics (optional)
- [ ] Configure error tracking (optional)
- [ ] Set up uptime monitoring (optional)

## Security

- [ ] Environment variables not exposed in client code
- [ ] API keys have appropriate permissions
- [ ] CORS configured correctly (if needed)
- [ ] Rate limiting considered for API routes

---

## Quick Links

- **GitHub Repository**: https://github.com/mohameddsalmann/barber
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Deployment Guide**: [VERCEL_SETUP.md](../VERCEL_SETUP.md)

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [TanStack Start Docs](https://tanstack.com/start)
- [Project README](../README.md)

---

**Last Updated**: May 22, 2026
