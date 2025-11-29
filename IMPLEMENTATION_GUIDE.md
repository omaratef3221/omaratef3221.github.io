# Website Implementation Guide

This document describes all the improvements made to your personal website.

## Summary of Changes

### 1. Fixed Layout Alignments
- **File Modified**: `styles.css`
- **Changes Made**:
  - Added proper vertical alignment for hero content
  - Fixed about section alignment
  - Ensured experience items are properly centered
  - Set minimum height for project cards (400px) for consistency
  - Centered stat cards content
  - Aligned publication cards properly

### 2. Dynamic Work Experience (JSON-based)
- **Files Created**:
  - `data/experience.json` - Contains all your work experience data
  - `load-experience.js` - Loads and displays experience from JSON

**How to Update Your Experience**:
1. Open `data/experience.json`
2. Edit the JSON structure:
   ```json
   {
     "experience": [
       {
         "period": "2023 - Present",
         "title": "Your Job Title",
         "company": "Company Name, Location",
         "achievements": [
           "Achievement 1",
           "Achievement 2"
         ]
       }
     ]
   }
   ```
3. Save the file - changes will appear automatically on page reload

### 3. Google Scholar Integration (Dynamic Stats)
- **Files Created**:
  - `scholar-integration.js` - Fetches real-time data from Google Scholar

- **Backend Endpoint**: `/api/scholar/{author_id}`
- **Features**:
  - Automatically fetches your publication count
  - Updates citation count dynamically
  - Displays current h-index
  - Updates both hero section stats and publications section stats
  - Has fallback data if API is unavailable

**Your Scholar ID**: `lw70gLkAAAAJ` (already configured)

### 4. Contact Form Backend
- **Files Modified**:
  - `portfolio.py` - Added `/api/contact` endpoint
  - `script.js` - Updated contact form to use backend API

- **Features**:
  - Sends form data to backend API
  - Shows loading state while sending
  - Displays success/error notifications
  - Falls back to mailto if backend is unavailable
  - Server-side validation of required fields

**To Enable Email Sending**:
The contact form currently logs messages to the console. To send actual emails:

1. Install an email service (e.g., SendGrid, or use SMTP):
   ```bash
   pip install sendgrid
   # OR
   pip install secure-smtplib
   ```

2. In `portfolio.py`, uncomment and configure the email sending section:
   ```python
   # Example with SMTP:
   import smtplib
   from email.mime.text import MIMEText

   msg = MIMEText(message)
   msg['Subject'] = subject
   msg['From'] = email
   msg['To'] = 'omaratef3221@gmail.com'

   with smtplib.SMTP('smtp.gmail.com', 587) as server:
       server.starttls()
       server.login('your_email@gmail.com', 'your_app_password')
       server.send_message(msg)
   ```

### 5. GitHub Starred Repositories Integration
- **Files Created**:
  - `github-starred.js` - Fetches and displays your starred repos

- **Backend Endpoint**: `/api/github/{username}/starred`
- **Features**:
  - Fetches your starred repositories from GitHub
  - Displays them as project cards
  - Automatically categorizes by project type (ML, NLP, CV, Web)
  - Shows repo stats (stars, forks)
  - Indicates if repo is by another user
  - Updates dynamically when you star new repos

**Your GitHub Username**: `omaratef3221` (already configured)

## File Structure

```
MyWebsite/
├── index.html                  # Main HTML file
├── styles.css                  # Styles with alignment fixes
├── script.js                   # Main JavaScript with updated contact form
├── load-experience.js          # NEW: Loads experience from JSON
├── scholar-integration.js      # NEW: Google Scholar integration
├── github-starred.js           # NEW: GitHub starred repos integration
├── api-integration.js          # Existing API integration
├── portfolio.py                # Backend with new endpoints
├── main.py                     # Flask app entry point
├── data/
│   └── experience.json         # NEW: Your work experience data
└── assets/
    └── images/
        └── omar_portrait.png
```

## API Endpoints

### 1. Contact Form
```
POST /api/contact
Body: {
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### 2. Google Scholar Data
```
GET /api/scholar/lw70gLkAAAAJ
Response: {
  "profile": {
    "citedby": number,
    "hindex": number,
    "i10index": number
  },
  "top_publications": [],
  "total_publications": number
}
```

### 3. GitHub Starred Repositories
```
GET /api/github/omaratef3221/starred
Response: {
  "starred_repositories": [],
  "total_starred": number
}
```

### 4. Existing Endpoints
- `GET /api/linkedin/{username}` - LinkedIn profile data
- `GET /api/github/{username}` - GitHub profile and repos
- `GET /api/cache/clear` - Clear API cache
- `GET /api/cache/status` - Check cache status

## Running the Website

### Development Mode
```bash
# Install dependencies (if needed)
pip install flask flask-cors requests

# Run the Flask backend
python main.py
```

The website will be available at `http://localhost:5001`

### Static File Serving
The current setup serves static files from the root directory. All HTML, CSS, and JS files should be in the same directory as `main.py`.

## Customization Guide

### Updating Personal Information

1. **Work Experience**: Edit `data/experience.json`
2. **Skills**: Edit the skills section in `index.html` (lines 188-285)
3. **Publications**: These are now fetched from Google Scholar automatically
4. **Projects**: These are now fetched from your GitHub starred repos automatically
5. **Hero Stats**: Updated automatically from Google Scholar
6. **Social Links**: Edit links in `index.html` (lines 94-113)

### Styling Changes

All styles are in `styles.css`. Key CSS variables:
```css
--primary-color: #0a0e27;
--secondary-color: #00d4ff;
--accent-color: #00ff88;
```

Change these to customize your color scheme.

## Troubleshooting

### Contact Form Not Working
- Check that Flask server is running
- Check browser console for errors
- Verify `/api/contact` endpoint is accessible

### Google Scholar Data Not Loading
- Check if `scholarly` package is installed: `pip install scholarly`
- Google Scholar may rate-limit requests
- Fallback data will be used if API fails

### GitHub Starred Repos Not Loading
- Check GitHub API rate limits (60 requests/hour without auth)
- Verify your GitHub username is correct
- Check browser console for errors

### Experience Data Not Loading
- Verify `data/experience.json` exists and has valid JSON
- Check browser console for fetch errors
- Ensure the JSON structure matches the expected format

## Performance Optimization

- API responses are cached for 1 hour
- Static assets should be minified for production
- Consider using a CDN for Font Awesome and Google Fonts
- Enable gzip compression on your server

## Security Notes

- The contact form validates all input fields
- CORS is enabled for all origins (consider restricting in production)
- No sensitive data is stored in the frontend
- API endpoints include error handling

## Future Enhancements

Consider adding:
1. Email service integration (SendGrid, Mailgun)
2. Google Analytics for visitor tracking
3. Blog section with Markdown support
4. Dark/Light theme toggle
5. Multi-language support
6. Progressive Web App (PWA) capabilities
7. GitHub authentication for higher API rate limits

## Support

For issues or questions:
- Email: omaratef3221@gmail.com
- GitHub: https://github.com/omaratef3221
