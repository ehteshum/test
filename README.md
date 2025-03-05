# Stream By Ishmam

A web-based HLS video streaming application.

## Deployment Instructions

### Deploying to GitHub Pages

1. Create a GitHub repository for your project
2. Push your code to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourrepository.git
   git push -u origin main
   ```
3. Go to the repository settings
4. Navigate to "Pages" in the left sidebar
5. Under "Source", select "Deploy from a branch"
6. Select the branch you want to deploy (usually `main` or `master`)
7. Click "Save"
8. Your site will be published at `https://yourusername.github.io/repositoryname/`

### Important Notes

- The stream URL is configured to work both locally and when hosted on GitHub Pages
- When running on GitHub Pages, the application automatically uses a CORS proxy to avoid cross-origin issues
- If you need to change the stream URL, edit the `CONFIG.streamUrl` value in `config.js`

### Troubleshooting

If the stream doesn't work on GitHub Pages:

1. Try using the fallback.html page: `https://yourusername.github.io/repositoryname/fallback.html`
2. Check the browser console for error messages
3. Try different CORS proxies by clicking the buttons on the fallback page
4. Make sure the stream URL is accessible and working
5. Some CORS proxies may have usage limits or require registration

## Local Development

Simply open the `index.html` file in your browser or use a local server:

```
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.
