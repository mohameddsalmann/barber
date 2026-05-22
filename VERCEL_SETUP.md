# Quick Vercel Setup Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Import Project to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository: `mohameddsalmann/barber`
4. Click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect these settings (already configured in `vercel.json`):

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Click on "Environment Variables" and add the following:

| Variable Name | Description | Required |
|--------------|-------------|----------|
| `HF_API_KEY` | Hugging Face API Key | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API Key | Yes |
| `FAL_API_KEY` | FAL AI API Key | Yes |
| `REPLICATE_API_TOKEN` | Replicate API Token | Yes |

**Important**: Add these variables for all environments (Production, Preview, Development)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## 📝 Getting API Keys

### Hugging Face API Key
1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token with read access
3. Copy the token (starts with `hf_`)

### OpenRouter API Key
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Create a new API key
3. Copy the key (starts with `sk-or-`)

### FAL AI API Key
1. Go to [https://fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
2. Create a new API key
3. Copy the key

### Replicate API Token
1. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Create a new token
3. Copy the token (starts with `r8_`)

## ✅ Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] Build completed successfully
- [ ] Application loads without errors
- [ ] Test the Style Studio AI features
- [ ] Test barber and client dashboards
- [ ] Verify queue management works
- [ ] Check POS functionality

## 🔧 Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Features Not Working
- Double-check all environment variables are set correctly
- Ensure API keys are valid and have proper permissions
- Check API rate limits

### Blank Page After Deployment
- Check browser console for errors
- Verify the output directory is set to `dist`
- Check that the build command completed successfully

## 🔄 Continuous Deployment

Once set up, Vercel will automatically:
- Deploy every push to `master` branch
- Create preview deployments for pull requests
- Run builds before deployment

## 📞 Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check GitHub repository issues

---

**Repository**: https://github.com/mohameddsalmann/barber
**Vercel Dashboard**: https://vercel.com/dashboard
