# JSON-Based Static Content System

## Overview

Your portfolio website has been converted to a **JSON-based static content system**. This means:

- ✅ All dynamic content is stored in JSON files
- ✅ Website reads from these JSON files (no backend needed)
- ✅ Python script updates JSON files whenever you want
- ✅ Works perfectly on GitHub Pages (static hosting)
- ✅ Easy to maintain and update

---

## 📁 File Structure

```
MyWebsite/
├── data/
│   ├── scholar.json          # Google Scholar publications & stats
│   └── github.json            # GitHub repositories data
├── scholar-integration.js     # Reads scholar.json
├── github-pinned.js           # Reads github.json
├── update_data.py             # Python script to update JSON files
└── index.html                 # Main website
```

---

## 📊 JSON Files Explained

### 1. `data/scholar.json`

Contains all Google Scholar data:

```json
{
  "profile": {
    "name": "Omar Elgendy",
    "affiliation": "AI Engineer and Researcher",
    "citedby": 440,
    "hindex": 3,
    "i10index": 2,
    "scholar_url": "https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en"
  },
  "publications": [
    {
      "title": "Paper title here",
      "authors": "Authors list",
      "venue": "Publication venue",
      "year": 2022,
      "citations": 338,
      "url": "https://..."
    }
  ],
  "total_publications": 6,
  "last_updated": "2025-11-29"
}
```

**What it controls:**
- Citation count in hero section
- Publication count in hero section
- All publication cards with titles, authors, venues
- Citation counts on each publication
- H-Index and i10-index in research stats

### 2. `data/github.json`

Contains all GitHub repository data:

```json
{
  "repositories": [
    {
      "name": "pytorch_tutorials",
      "description": "PyTorch exercises from beginner to advanced",
      "html_url": "https://github.com/omaratef3221/pytorch_tutorials",
      "language": "Jupyter Notebook",
      "topics": ["pytorch", "deep-learning", "neural-networks"],
      "stars": 85,
      "forks": 44,
      "owner": "omaratef3221"
    }
  ],
  "last_updated": "2025-11-29"
}
```

**What it controls:**
- All project cards in Projects section
- Star counts and fork counts
- Repository descriptions
- Technologies/topics displayed
- Links to GitHub repos

---

## 🔄 Updating Your Content

### Method 1: Automatic Update (Recommended)

Run the Python script to fetch latest data from APIs:

```bash
python update_data.py
```

**What it does:**
1. Fetches latest publications from Google Scholar
2. Fetches latest repositories from GitHub
3. Updates `data/scholar.json` with new data
4. Updates `data/github.json` with new data
5. Shows you a summary of what changed

**When to run it:**
- After publishing a new research paper
- When citation counts change significantly
- After creating new GitHub repositories
- Monthly or quarterly for regular updates

**Output example:**
```
============================================================
Portfolio Data Update Script
============================================================

Fetching Google Scholar data...
Found 6 publications
  ✓ Breast cancer detection... (338 citations)
  ✓ Arabic fake news detection... (89 citations)
  ✓ Death/recovery prediction... (8 citations)
  ✓ Alzheimer detection... (3 citations)

✓ Scholar data fetched successfully!
  - Total Citations: 440
  - H-Index: 3
  - Publications: 6
✓ Saved to data/scholar.json

Fetching GitHub data...
✓ GitHub data fetched successfully!
  - Total repositories: 18
  - Showing top 6 by stars:
    • pytorch_tutorials: 85⭐ 44🍴
    • SQL_Query_Generator_llm: 8⭐ 4🍴
    • tensorflow_tutorials: 8⭐ 3🍴
    • podcast-summarizer-agent: 6⭐ 1🍴
    • find-a-movie: 2⭐ 2🍴
    • youtube_downloader: 2⭐ 1🍴
✓ Saved to data/github.json

============================================================
Update Complete: 2/2 successful
============================================================
✓ All data updated successfully!

Your website will now display the latest information.
Push these changes to GitHub Pages to see them live.
```

### Method 2: Manual Update

You can manually edit the JSON files if needed:

1. Open `data/scholar.json` or `data/github.json`
2. Edit the values directly
3. Save the file
4. Refresh your browser to see changes

**Example: Update citation count**
```json
"citedby": 440  →  "citedby": 450
```

---

## 🎯 New Features Added

### 1. Pagination (3 Publications Per Page)

**What changed:**
- Publications section now shows **3 papers per page** (instead of 4)
- Page navigation buttons appear below publications
- Previous/Next buttons + page numbers (1, 2, 3...)
- Clicking a page smoothly scrolls to Publications section

**How it works:**
- Page 1: Shows publications 1-3
- Page 2: Shows publications 4-6
- Active page is highlighted in cyan
- Disabled buttons are grayed out

**User experience:**
```
[< Previous] [1] [2] [Next >]
      ↑       ↑   ↑     ↑
   Disabled  Active  Available  Available
```

### 2. Filter Buttons (Top Right Position)

**What changed:**
- Filter buttons moved to **top right** of Publications section
- Two options: "Citations" and "Date"
- Compact design (smaller buttons, less space)
- Part of section header (absolute positioning)

**How it works:**
- Default: Sorted by Citations (highest first)
- Click "Date": Sorts by publication year (newest first)
- Click "Citations": Sorts by citation count (most cited first)
- Active filter is highlighted in cyan

**Visual layout:**
```
Publications & Research                    [Sort by:] [Citations] [Date]
Academic contributions and research work
                                          ↑ Filter buttons here
```

### 3. Citation Count Display

**On each publication card:**
- Green badge showing "Cited by X"
- Quote icon for visual clarity
- Helps identify paper impact at a glance

---

## 🚀 Deployment to GitHub Pages

### Step 1: Commit JSON Files

```bash
git add data/scholar.json data/github.json
git commit -m "Update content data"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

### Step 3: Wait for GitHub Pages to Deploy

- GitHub Pages automatically rebuilds (takes 1-2 minutes)
- Visit your website URL
- Content will be updated!

**Important:** You must commit and push the JSON files for changes to appear live.

---

## 🔧 Troubleshooting

### Problem: Publications not showing

**Check:**
1. Is `data/scholar.json` present in your repository?
2. Open browser console (F12) and look for errors
3. Check if JSON is valid at [jsonlint.com](https://jsonlint.com)

**Solution:**
- Ensure the file is committed and pushed to GitHub
- Check file path is exactly `data/scholar.json`

### Problem: Update script fails

**Common errors:**

**Error:** `ModuleNotFoundError: No module named 'scholarly'`
**Solution:**
```bash
pip install scholarly requests
```

**Error:** `Failed to fetch Scholar data`
**Solution:**
- Google Scholar may be rate limiting
- Wait a few minutes and try again
- Alternatively, manually update the JSON

### Problem: Filter buttons not appearing

**Check:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Open browser console and check for JavaScript errors
3. Ensure `scholar-integration.js` is loaded

**Solution:**
- Hard refresh the page
- Check that `data/scholar.json` is loading successfully

### Problem: Pagination not working

**Check:**
1. Do you have more than 3 publications in `scholar.json`?
2. Is JavaScript enabled in your browser?

**Solution:**
- Pagination only shows when there are 4+ publications
- Ensure `publications` array in JSON has multiple entries

---

## 📝 Maintenance Schedule

### Weekly
- ❌ No action needed

### Monthly
- ✅ Run `python update_data.py` to fetch latest data
- ✅ Commit and push updated JSON files

### After Major Events
- ✅ New publication? Run update script
- ✅ New GitHub repo? Run update script
- ✅ Paper gets cited? Run update script (if significant increase)

---

## 🎨 Customization

### Change Publications Per Page

Edit `scholar-integration.js`:
```javascript
const PUBLICATIONS_PER_PAGE = 3;  // Change to 4, 5, etc.
```

### Change Number of GitHub Repos Shown

Edit `update_data.py`:
```python
top_repos = user_repos[:6]  # Change to [:8], [:10], etc.
```

### Change Default Sort Mode

Edit `scholar-integration.js`:
```javascript
let currentSortMode = 'citations';  // Change to 'date'
```

---

## 📊 Comparison: Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Content Source** | API calls at runtime | Static JSON files |
| **Update Method** | Automatic on page load | Run Python script when needed |
| **GitHub Pages** | Some features didn't work | Everything works perfectly |
| **Publications Display** | 4 per page, no pagination | 3 per page with pagination |
| **Filter Position** | Center below header | Top right corner |
| **Maintenance** | No control over updates | Full control with update script |
| **Load Speed** | Slower (API calls) | Faster (static files) |
| **Reliability** | Depends on APIs | Always works |

---

## ✅ What's Working Now

### Publications Section
- ✅ Shows 3 publications per page
- ✅ Pagination with Previous/Next and page numbers
- ✅ Filter buttons at top right (Citations/Date)
- ✅ Citation counts on each publication
- ✅ "View All Publications" button to Google Scholar
- ✅ Correct citation count in hero section (440+)

### Projects Section
- ✅ Shows top 6 GitHub repositories
- ✅ Star and fork counts displayed
- ✅ Auto-categorized by ML/NLP/CV/Web
- ✅ Project filtering works

### Update System
- ✅ Python script fetches latest data
- ✅ Updates JSON files automatically
- ✅ Shows detailed progress and summary
- ✅ Error handling if APIs fail

---

## 🎯 Next Steps

1. **Test the update script:**
   ```bash
   python update_data.py
   ```

2. **Check the changes:**
   - Look at `data/scholar.json` and `data/github.json`
   - Verify data looks correct

3. **Test locally:**
   - Open your website in browser
   - Check Publications section
   - Try pagination and filtering

4. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "Convert to JSON-based system with pagination and filters"
   git push origin main
   ```

5. **Verify live:**
   - Wait 1-2 minutes for GitHub Pages to rebuild
   - Visit your live website
   - Check all features work

---

## 📞 Quick Reference

### Update Content
```bash
python update_data.py
```

### Deploy Changes
```bash
git add data/*.json
git commit -m "Update content data"
git push origin main
```

### File Locations
- Publications data: `data/scholar.json`
- GitHub data: `data/github.json`
- Update script: `update_data.py`
- Publications JS: `scholar-integration.js`
- GitHub JS: `github-pinned.js`

---

## 🎉 Summary

You now have a **fully static, JSON-based portfolio website** with:

1. ✅ **Easy Updates** - Run one Python script to fetch latest data
2. ✅ **Full Control** - Update content whenever you want
3. ✅ **GitHub Pages Ready** - Works perfectly on static hosting
4. ✅ **Professional Features** - Pagination, filtering, sorting
5. ✅ **Zero Maintenance** - No backend servers to manage
6. ✅ **Future-Proof** - Simple JSON files anyone can edit

Your website will automatically show:
- Latest citation counts
- Newest publications
- Current GitHub projects
- Up-to-date stats

Just run `python update_data.py` whenever you want to refresh the data!
