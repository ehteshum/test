# Stream By Ishmam

A web-based HLS video streaming application.

## Deployment Instructions

### Deploying to GitHub Pages

1. Create a GitHub repository for your project
2. Push your code to the repository
3. Go to the repository settings
4. Scroll down to the "GitHub Pages" section
5. Select the branch you want to deploy (usually `main` or `master`)
6. Click "Save"
7. Your site will be published at `https://yourusername.github.io/repositoryname/`

### Important Notes

- The stream URL is configured to work both locally and when hosted on GitHub Pages
- When running on GitHub Pages, the application automatically uses a CORS proxy to avoid cross-origin issues
- If you need to change the stream URL, edit the `CONFIG.streamUrl` value in `config.js`

## Local Development

Simply open the `index.html` file in your browser or use a local server.
