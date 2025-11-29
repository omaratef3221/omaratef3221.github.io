# GitHub Pages Deployment Guide

This guide will help you deploy your portfolio website to GitHub Pages.

## Overview

Your website is now configured to work both:
- **Locally** with Flask backend (for development)
- **On GitHub Pages** with static hosting (for production)

The JavaScript files automatically detect whether the Flask backend is available and fall back to static data when deployed on GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Your website files ready to push

## Step 1: Prepare Your Repository

### Create a .gitignore file (if not already present)

The `.gitignore` file is already configured to exclude:
- Python cache files (`__pycache__/`)
- Virtual environments (`venv/`, `env/`)
- macOS system files (`.DS_Store`)
- IDE files (`.vscode/`, `.idea/`)

### Files to Include in Git

Make sure these files are in your repository:
```
├── index.html
├── styles.css
├── script.js
├── scholar-integration.js
├── github-pinned.js
├── load-experience.js
├── api-integration.js
├── data/
│   └── experience.json
├── assets/
│   └── images/
│       └── omar_portrait.png
└── README.md
```

### Files NOT to Push (handled by .gitignore)

- `main.py` - Flask backend (optional, won't run on GitHub Pages)
- `portfolio.py` - Flask backend (optional, won't run on GitHub Pages)
- `__pycache__/` - Python cache
- `venv/` - Virtual environment
- `.DS_Store` - macOS system files

**Note:** You can keep the Flask files in your repo for local development. They won't affect GitHub Pages deployment.

## Step 2: Initialize Git Repository

If you haven't already initialized a git repository:

```bash
cd /Users/omaratef/Dropbox/Projects/Web_projects/MyWebsite
git init
git add .
git commit -m "Initial commit: Portfolio website ready for GitHub Pages"
```

## Step 3: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Name your repository (e.g., `portfolio` or `MyWebsite`)
5. Choose **Public** (required for free GitHub Pages)
6. **Do NOT** initialize with README, .gitignore, or license (you already have these)
7. Click **Create repository**

## Step 4: Push to GitHub

Copy the commands from GitHub's quick setup page, or use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (tab at the top)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will build and deploy your site. This takes 1-2 minutes.

## Step 6: Access Your Website

Your website will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example:
```
https://omaratef3221.github.io/MyWebsite/
```

### Custom Domain (Optional)

If you want to use a custom domain (e.g., `omarelgendy.com`):

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In your repository's **Settings > Pages**, add your custom domain
3. In your domain registrar's DNS settings, add these records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: A
   Name: @
   Value: 185.199.109.153

   Type: A
   Name: @
   Value: 185.199.110.153

   Type: A
   Name: @
   Value: 185.199.111.153

   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
4. Wait 24-48 hours for DNS propagation

## Step 7: Configure Formspree for Contact Form

The contact form needs a backend service on GitHub Pages:

1. Go to [Formspree.io](https://formspree.io)
2. Sign up for a **free account**
3. Click **+ New Form**
4. Enter your email address where you want to receive messages
5. Copy the form endpoint (looks like `https://formspree.io/f/xyzabc123`)
6. Update `index.html` line 615:
   ```html
   <form id="contactForm" action="https://formspree.io/f/YOUR_ACTUAL_ID" method="POST">
   ```
7. Commit and push the change:
   ```bash
   git add index.html
   git commit -m "Configure Formspree for contact form"
   git push
   ```

Formspree free tier allows:
- 50 submissions per month
- Email notifications
- Spam filtering

## Step 8: Update Data (Ongoing)

### Update Publications

Edit `scholar-integration.js` to update the `FALLBACK_SCHOLAR_DATA` object with your latest publications and citation counts.

### Update Projects

Edit `github-pinned.js` to update the `FALLBACK_GITHUB_DATA` array with your latest projects.

### Update Work Experience

Edit `data/experience.json` to add or modify your work experience.

### Deploy Changes

After any updates:
```bash
git add .
git commit -m "Update publications/projects/experience"
git push
```

GitHub Pages will automatically rebuild your site in 1-2 minutes.

## Troubleshooting

### Site Not Loading

1. Wait 2-3 minutes after first deployment
2. Check GitHub Actions tab for build errors
3. Clear your browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### CSS/JS Not Loading

1. Check browser console for errors (F12 or Cmd+Option+I)
2. Make sure all file paths are relative (no leading `/`)
3. Check that all files are committed and pushed

### Contact Form Not Working

1. Verify you replaced `YOUR_FORMSPREE_ID` with your actual Formspree form ID
2. Check Formspree dashboard for submissions
3. Check your email spam folder

### Images Not Loading

1. Make sure images are in `assets/images/` folder
2. Verify image paths in HTML are correct
3. Check image file extensions match (case-sensitive on Linux servers)

### Publications/Projects Not Showing

1. Open browser console (F12)
2. Look for console messages like "Backend not available, using fallback data"
3. Verify fallback data in `scholar-integration.js` and `github-pinned.js`

## Advanced: Continuous Deployment

Every time you push to GitHub, your site automatically updates:

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push
```

Wait 1-2 minutes, then refresh your GitHub Pages site.

## Performance Optimization

GitHub Pages serves static files with:
- HTTPS by default
- Global CDN (fast worldwide)
- Free bandwidth
- No server costs

## Monitoring

Track your site's performance:
1. Google Analytics (add to `index.html`)
2. GitHub repository insights (traffic tab)
3. Formspree submission dashboard

## Summary

Your website is now:
- ✅ Fully static (works on GitHub Pages)
- ✅ Has fallback data for publications and projects
- ✅ Uses Formspree for contact form
- ✅ Auto-deploys on git push
- ✅ Free to host forever
- ✅ Includes "View More" button linking to Google Scholar

**Your website URL:** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Enjoy your live portfolio website! 🎉
