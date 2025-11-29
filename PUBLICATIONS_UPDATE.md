# Publications Update - Top 4 Most Cited Papers

## Summary

Updated the Google Scholar integration to display the **top 4 most cited papers** instead of 3, and added a "View All Publications" button that links directly to your Google Scholar profile.

## Changes Made

### Backend ([portfolio.py](portfolio.py))
1. **Line 576-578**: Changed from top 3 to top 4 publications
2. **Line 590**: Added `scholar_url` to profile data
3. **Lines 621, 651-659**: Updated fallback data to include 4 papers and scholar URL

### Frontend ([scholar-integration.js](scholar-integration.js))
1. **Lines 107-129**: Updated to display 4 publications
2. **Lines 131-162**: Added new `addViewMoreLink()` function
3. Creates a centered button below publications
4. Button links to your Google Scholar profile

### Styling ([styles.css](styles.css))
1. **Lines 1362-1381**: Added styles for "View More" button
2. Centered container with proper spacing
3. Hover effects matching site design

## What You'll See

### Publications Section Now Shows:
1. ✅ **Top 4 most cited papers** (sorted by citation count)
2. ✅ **"View All Publications on Google Scholar"** button
3. ✅ Links to your full Google Scholar profile
4. ✅ Research stats (publications, citations, h-index) below

### Button Features:
- 🎨 Styled to match your site's design
- 🔗 Opens Google Scholar in new tab
- 📊 Shows graduation cap icon
- ✨ Smooth hover animation

## API Response

The API now includes `scholar_url` in the profile:

```json
{
  "profile": {
    "citedby": 350,
    "hindex": 3,
    "scholar_url": "https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en"
  },
  "top_publications": [
    // 4 papers sorted by citations
  ],
  "total_publications": 6
}
```

## Your Top 4 Papers (by citations):

Based on fallback data:
1. **Arabic fake news detection** - 89 citations
2. **Alzheimer Detection with MRI** - 45 citations
3. **Heart Failure Prediction** - 12 citations
4. **Text Toxicity Detection** - 8 citations

(Real data will be fetched from your Google Scholar profile when the API is available)

## How It Works

1. **Fetches** your Google Scholar profile
2. **Sorts** all publications by citation count
3. **Returns** top 4 most cited
4. **Displays** them in the publications section
5. **Adds** "View More" button linking to your full profile

## Fallback Behavior

If Google Scholar API is unavailable:
- Shows 4 hardcoded papers
- "View More" button still works
- Links to your profile: https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en

---

**All changes are live!** Just reload your browser to see the updates.
