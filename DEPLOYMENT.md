# Deployment Guide for BarberFlow POS

## Vercel Deployment

This project is configured to deploy seamlessly on Vercel.

### Prerequisites
- A Vercel account
- GitHub repository connected to Vercel

### Environment Variables

Before deploying, make sure to set up the following environment variables in your Vercel project settings:

```
HF_API_KEY=your_huggingface_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
FAL_API_KEY=your_fal_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin master
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework settings

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add all the required API keys listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Build Configuration

The project uses the following build settings (already configured in `vercel.json`):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Post-Deployment

After deployment:
1. Test all features to ensure they work correctly
2. Check that API integrations are functioning
3. Verify that environment variables are properly loaded
4. Test the Style Studio AI features

### Troubleshooting

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure the build completes without errors
4. Check that all API keys are valid and have proper permissions

### Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to the master branch
- Create preview deployments for pull requests
- Run builds and tests before deployment
