# Quick Guide: Updating Your Website Data

This guide shows you how to update your portfolio data for GitHub Pages deployment.

## 1. Update Publications & Citations

**File:** `scholar-integration.js` (lines 8-52)

Update the `FALLBACK_SCHOLAR_DATA` object:

```javascript
const FALLBACK_SCHOLAR_DATA = {
    profile: {
        name: "Omar Elgendy",
        affiliation: "AI Engineer and Researcher",
        citedby: 438,        // ← Update this number
        hindex: 3,           // ← Update this number
        i10index: 2,         // ← Update this number
        scholar_url: SCHOLAR_URL
    },
    top_publications: [
        // Add your top 4 most cited papers here
        {
            title: "Your Paper Title",
            authors: "Author Names",
            venue: "Conference/Journal Name",
            year: 2024,
            citations: 100,  // ← Update citation count
            url: "https://link-to-paper"
        },
        // ... 3 more papers
    ],
    total_publications: 6    // ← Update total count
};
```

**How to get latest data:**
1. Visit your [Google Scholar profile](https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en)
2. Update citation counts, h-index, and i10-index
3. Sort publications by citations
4. Copy the top 4 papers' information

## 2. Update GitHub Projects

**File:** `github-pinned.js` (lines 7-38)

Update the `FALLBACK_GITHUB_DATA` array:

```javascript
const FALLBACK_GITHUB_DATA = [
    {
        name: "project-name",
        description: "Project description",
        html_url: "https://github.com/omaratef3221/project-name",
        language: "Python",
        topics: ["ml", "nlp", "pytorch"],
        stars: 10,           // ← Update star count
        forks: 2,            // ← Update fork count
        owner: "omaratef3221"
    },
    // Add up to 6 projects total
];
```

**How to get latest data:**
1. Visit your [GitHub profile](https://github.com/omaratef3221)
2. Check your repositories' star and fork counts
3. Update the information for your top projects

## 3. Update Work Experience

**File:** `data/experience.json`

This file is already JSON-based and easy to edit:

```json
{
  "experience": [
    {
      "period": "2023 - Present",
      "title": "Your Job Title",
      "company": "Company Name, Location",
      "achievements": [
        "Achievement 1",
        "Achievement 2",
        "Achievement 3"
      ]
    }
  ]
}
```

## 4. Update Personal Information

**File:** `index.html`

### Update Email, Phone, Location (lines 572-590)
```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <div>
        <h4>Email</h4>
        <p>your.email@gmail.com</p>  <!-- Update here -->
    </div>
</div>
```

### Update Social Media Links (lines 596-602)
```html
<div class="social-links-grid">
    <a href="https://linkedin.com/in/yourprofile"><i class="fab fa-linkedin"></i></a>
    <a href="https://github.com/yourusername"><i class="fab fa-github"></i></a>
    <!-- etc. -->
</div>
```

### Update About Section (lines 240-255)
```html
<div class="about-text">
    <h2 class="section-title">About Me</h2>
    <p>Your bio text here...</p>
</div>
```

## 5. Deploy Updates to GitHub Pages

After making any changes:

```bash
git add .
git commit -m "Update publications/projects/experience"
git push
```

Wait 1-2 minutes for GitHub Pages to rebuild your site.

## 6. Update Schedule

Recommended update frequency:

- **Publications & Citations:** Monthly (or when you publish new papers)
- **GitHub Projects:** Quarterly (or when you create significant projects)
- **Work Experience:** As needed (when you change jobs/roles)
- **Skills & About:** Annually or as needed

## Quick Links

- [Google Scholar Profile](https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en)
- [GitHub Profile](https://github.com/omaratef3221)
- [Your Live Website](https://omaratef3221.github.io/MyWebsite/)

## Testing Locally Before Deploying

Always test your changes locally first:

```bash
# Start local server (if you have Flask installed)
python main.py

# Or use Python's built-in HTTP server for static files
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

Check that:
- All data appears correctly
- Links work
- No console errors (press F12)

Then push to GitHub:
```bash
git add .
git commit -m "Describe your changes"
git push
```

## Pro Tips

1. **Keep fallback data updated** - Even though your site can fetch live data locally, the fallback data is what visitors see on GitHub Pages

2. **Use descriptive commit messages** - This helps you track what changed over time

3. **Test in multiple browsers** - Chrome, Firefox, Safari to ensure compatibility

4. **Check mobile view** - Use browser dev tools to test responsive design

5. **Monitor your contact form** - Check Formspree dashboard regularly for messages

## Need Help?

- Check browser console for errors (F12 or Cmd+Option+I)
- Review the [deployment guide](GITHUB_PAGES_DEPLOYMENT.md)
- Verify all changes are committed: `git status`
