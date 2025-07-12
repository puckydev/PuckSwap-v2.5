# Vercel Deployment Guide for PuckSwap

## Quick Deploy

1. **Push your changes to GitHub**
   ```bash
   git add vercel.json
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Your project should automatically redeploy at https://vercel.com/puckys-projects/puck-swap-v2-5
   - If not, go to your Vercel dashboard and click "Redeploy"

## Configuration Details

### vercel.json
The `vercel.json` file in your root directory handles:
- Routing requests to the correct subdirectory (`PuckSwap-v2.5/puckswap/`)
- Serving static assets (images, JS files, CSS, MP3s)
- Handling the single-page application routing

### Environment Variables (Optional)
If you want to secure your Blockfrost API key:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Key: `VITE_BLOCKFROST_API_KEY`
   - Value: `preprodd86p4euUeF6yIUbwl03sJJMD03aICMxL`

Then update your `index.html` to use the environment variable instead of hardcoding it.

### Build Settings
- Framework Preset: Other
- Build Command: `echo "No build needed"`
- Output Directory: `.`
- Install Command: `npm install`

## Troubleshooting

### 404 Errors
If you still get 404 errors:
1. Check that `vercel.json` is in your root directory
2. Verify all file paths in the routes section
3. Check the Vercel deployment logs for errors

### Assets Not Loading
If images or other assets aren't loading:
1. Check the browser console for 404 errors
2. Verify the asset paths in `vercel.json`
3. Ensure assets are committed to your repository

### Module Import Errors
The app uses ES modules from CDN, so no build step is required. If you see import errors:
1. Check that you're using a modern browser
2. Verify the CDN URLs are accessible

## Production Considerations

1. **API Key Security**: Move the Blockfrost API key to environment variables
2. **Error Handling**: Add better error pages for 404s
3. **Performance**: Consider adding caching headers for static assets
4. **Analytics**: Add Vercel Analytics for monitoring

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the browser console for errors
3. Ensure all files are properly committed to Git
4. Verify the project structure matches what's expected 