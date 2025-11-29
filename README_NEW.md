# Omar Elgendy - Personal Portfolio Website

A modern, dynamic portfolio website showcasing Machine Learning Engineering expertise, projects, and research.

![Portfolio](https://img.shields.io/badge/Portfolio-Live-success)
![Python](https://img.shields.io/badge/Python-3.7+-blue)
![Flask](https://img.shields.io/badge/Flask-2.0+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🎨 **Modern UI/UX** - Sleek, professional design with smooth animations
- 📊 **Dynamic Data** - Real-time integration with Google Scholar and GitHub
- 📝 **Easy Updates** - JSON-based work experience management
- 📧 **Contact Form** - Fully functional backend contact system
- 🌟 **GitHub Integration** - Automatically displays starred repositories
- 📱 **Responsive** - Mobile-friendly design
- 🚀 **Fast** - API caching for optimal performance

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install flask flask-cors requests scholarly
```

### 2. Start the Server
```bash
./start.sh
# OR
python main.py
```

### 3. Open Your Browser
Visit: **http://localhost:5001**

## 📁 Project Structure

```
MyWebsite/
├── index.html              # Main HTML
├── styles.css              # Styles with alignment fixes
├── script.js               # Main JavaScript
├── load-experience.js      # Loads experience from JSON
├── scholar-integration.js  # Google Scholar integration
├── github-starred.js       # GitHub starred repos
├── main.py                 # Flask application
├── portfolio.py            # API endpoints
├── data/
│   └── experience.json     # Your work experience (EDIT THIS!)
└── start.sh                # Startup script
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scholar/lw70gLkAAAAJ` | Google Scholar profile data |
| GET | `/api/github/omaratef3221` | GitHub profile and repos |
| GET | `/api/github/omaratef3221/starred` | Starred repositories |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/cache/status` | Cache status |
| POST | `/api/cache/clear` | Clear cache |

## 📝 Updating Content

### Work Experience
Edit `data/experience.json`:
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

### Projects
Star repositories on GitHub - they automatically appear on your site!

### Publications
Automatically synced from Google Scholar (ID: lw70gLkAAAAJ)

### Personal Info
Edit `index.html` to update:
- Name, title, about text
- Email, phone, location
- Social media links

## 🎨 Customization

Change colors in `styles.css`:
```css
:root {
    --primary-color: #0a0e27;
    --secondary-color: #00d4ff;
    --accent-color: #00ff88;
}
```

## 🧪 Testing

Test all API endpoints:
```bash
python test_api.py
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed technical docs
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Summary of improvements

## ✅ What's Working

- ✅ Fixed layout alignments throughout
- ✅ Dynamic work experience from JSON
- ✅ Real-time Google Scholar stats
- ✅ Working contact form with backend
- ✅ GitHub starred repositories displayed
- ✅ Automatic project categorization
- ✅ API caching for performance
- ✅ Fallback data for reliability
- ✅ Responsive design
- ✅ Error handling and notifications

## 🚢 Deployment

### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
# Enable GitHub Pages in repository settings
```

### Heroku
```bash
heroku create your-portfolio-name
git push heroku main
```

### PythonAnywhere
1. Upload files to PythonAnywhere
2. Configure WSGI to point to main.py
3. Set up static files mapping

## 📧 Contact Form Setup

The contact form currently logs to console. To enable email sending:

1. Choose an email service (SendGrid, Gmail SMTP, etc.)
2. Install required package: `pip install sendgrid`
3. Configure in `portfolio.py` (see IMPLEMENTATION_GUIDE.md)

## 🔒 Security Notes

- CORS enabled (restrict in production)
- Input validation on all endpoints
- No sensitive data in frontend
- API rate limiting via caching

## 🐛 Troubleshooting

### Server won't start
- Check if port 5001 is in use
- Verify all dependencies installed
- See error messages in terminal

### Google Scholar not loading
- Install scholarly: `pip install scholarly`
- May be rate-limited by Google
- Fallback data will be used

### GitHub starred repos not loading
- Check GitHub API rate limits
- Verify username is correct
- Check browser console

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 🙏 Credits

Built by Omar Elgendy
- 🌐 [GitHub](https://github.com/omaratef3221)
- 💼 [LinkedIn](https://www.linkedin.com/in/omaratef3221/)
- 📧 omaratef3221@gmail.com

---

**Made with ❤️ using Flask, JavaScript, and modern web technologies**
