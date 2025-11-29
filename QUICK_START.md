# Quick Start Guide

## Getting Your Website Running

### Step 1: Install Dependencies
```bash
pip install flask flask-cors requests scholarly
```

### Step 2: Start the Server

**Option 1: Using the startup script (recommended)**
```bash
./start.sh
```

**Option 2: Direct Python command**
```bash
python main.py
```

You should see:
```
============================================================
🚀 Starting Omar's Portfolio Website
============================================================
📍 Server running at: http://localhost:5001
```

### Step 3: Open Your Website
Open your browser and go to: `http://localhost:5001`

## Testing the API

Run the test script to verify all endpoints are working:
```bash
python test_api.py
```

This will test:
- ✅ Google Scholar integration
- ✅ GitHub profile and repositories
- ✅ GitHub starred repositories
- ✅ Contact form submission
- ✅ API cache status

## Updating Your Content

### Update Work Experience
1. Open `data/experience.json`
2. Edit your jobs, titles, and achievements
3. Save and refresh your browser

### Update Skills
1. Open `index.html`
2. Find the Skills section (around line 188)
3. Edit skill names and percentages
4. Save and refresh

### Star More Projects on GitHub
1. Go to GitHub and star repositories you like
2. Your website will automatically show them in the Projects section
3. They'll appear next time the cache refreshes (1 hour) or on server restart

## Customization

### Change Colors
Edit `styles.css` and modify these variables:
```css
:root {
    --primary-color: #0a0e27;      /* Dark blue background */
    --secondary-color: #00d4ff;    /* Cyan accent */
    --accent-color: #00ff88;       /* Green accent */
}
```

### Update Personal Info
Edit `index.html`:
- **Name**: Line 60
- **Title**: Line 62
- **About text**: Lines 129-134
- **Email**: Line 154, 576
- **Phone**: Line 583
- **Location**: Line 147, 590

### Add Your Photo
Replace `assets/images/omar_portrait.png` with your photo.

## Troubleshooting

### Server won't start
- Check if port 5001 is already in use
- Try changing the port in `main.py` (line 46)

### Google Scholar not loading
- Install scholarly: `pip install scholarly`
- Google may rate-limit; fallback data will be used

### Contact form not sending
- Check Flask console for error messages
- Configure email service in `portfolio.py` (see IMPLEMENTATION_GUIDE.md)

### Projects not loading
- GitHub API has rate limits (60/hour without auth)
- Check browser console for errors
- Starred repos will load after page refresh

## Going Live

### Option 1: Deploy to GitHub Pages (Frontend Only)
```bash
# Create a new repository on GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main

# Enable GitHub Pages in repository settings
```

### Option 2: Deploy to Heroku (Full Stack)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-portfolio-name

# Deploy
git push heroku main
```

### Option 3: Deploy to PythonAnywhere
1. Sign up at pythonanywhere.com
2. Upload your files
3. Configure WSGI file to point to main.py
4. Set up static files mapping

## File Checklist

Make sure you have these files:
- ✅ index.html
- ✅ styles.css
- ✅ script.js
- ✅ load-experience.js
- ✅ scholar-integration.js
- ✅ github-starred.js
- ✅ api-integration.js
- ✅ main.py
- ✅ portfolio.py
- ✅ data/experience.json
- ✅ assets/images/omar_portrait.png
- ✅ OmarElgendyResumeSC-v2.pdf

## Next Steps

1. **Customize your content** using the guides above
2. **Test all features** using test_api.py
3. **Add your photo** to assets/images/
4. **Update your resume PDF**
5. **Configure email sending** for contact form
6. **Deploy to production** when ready

## Getting Help

- Check `IMPLEMENTATION_GUIDE.md` for detailed documentation
- Review browser console for JavaScript errors
- Check Flask console for backend errors
- Test individual endpoints with test_api.py

Enjoy your new portfolio website! 🚀
