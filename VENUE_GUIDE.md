# Google Scholar Venue Information Guide

## Why "Unknown Venue" Appears

### The Problem

When running `python update_data.py`, some publications show "Unknown Venue" because:

1. **Google Scholar API Limitations**: The `scholarly` Python package scrapes Google Scholar, which doesn't always provide venue information in a structured format
2. **Inconsistent Data**: Different publications store venue information in different fields:
   - Some use `venue`
   - Some use `journal`
   - Some use `booktitle` (for conference papers)
   - Some use `publisher`
   - Some only have it in the `citation` string

### The Solution (Applied)

The `update_data.py` script has been improved to:

1. **Check Multiple Fields**: Tries to get venue from multiple possible fields
2. **Parse Citation String**: Extracts venue from citation if other fields are empty
3. **Better Default**: Uses "Conference/Journal" instead of "Unknown Venue"
4. **Debug Output**: Shows what venue was found for each publication

## Updated Code

```python
# Try multiple fields for venue information
venue = (
    bib.get('venue') or
    bib.get('journal') or
    bib.get('booktitle') or
    bib.get('publisher') or
    bib.get('citation', '').split(',')[0] if bib.get('citation') else None or
    'Conference/Journal'  # Better default
)
```

## Manual Updates (Recommended)

Even with the improved script, you may need to manually update venue information for accuracy. Here's how:

### Step 1: Run the Update Script

```bash
python update_data.py
```

The output will show what venue was found:
```
✓ Breast cancer detection using artificial inte...
  Citations: 338 | Venue: Artificial Intelligence in Medicine
```

### Step 2: Check for Generic Venues

Look for entries that show:
- "Conference/Journal" (generic default)
- Empty or unclear venue names
- Partial venue information

### Step 3: Manually Update in scholar.json

Open `data/scholar.json` and update the venue field:

```json
{
  "title": "Your Paper Title",
  "venue": "Correct Conference or Journal Name"
}
```

## Finding Correct Venue Information

### Method 1: Google Scholar Website
1. Go to your Google Scholar profile
2. Click on the publication
3. Look at the citation - the venue is usually after the authors
4. Example: "AB Nassif, MA Talib - **Artificial Intelligence in Medicine**, 2022"

### Method 2: Publisher Website
1. Click the publication link (DOI or URL)
2. The venue is shown on the publisher's page
3. Copy the full, official name

### Method 3: DOI Lookup
1. Use the DOI link if available
2. CrossRef or the publisher will show the correct venue

## Common Venue Formats

### Journal Papers
```
"venue": "Journal Name - Publisher"
```
Examples:
- "Artificial Intelligence in Medicine - Elsevier"
- "Neural Computing and Applications - Springer"

### Conference Papers
```
"venue": "Conference Full Name (Acronym) - Year"
```
Examples:
- "2023 Advances in Science and Engineering Technology International Conferences (ASET) - IEEE"
- "The 2024 OkIP International Conference on Advances in Health Information Technology (AHIT)"

### Book Chapters
```
"venue": "Book Title - Publisher"
```

## Automated vs Manual Updates

### What the Script Updates Automatically
- ✅ Publication titles
- ✅ Author lists
- ✅ Citation counts
- ✅ Publication years
- ✅ URLs
- ⚠️ Venue (tries its best, may need manual fix)

### What You Should Update Manually
- ✅ Venue names (for accuracy and formatting)
- ✅ Experience entries (always manual)
- ✅ About information (always manual)
- ✅ Skills (always manual)

## Workflow Recommendation

1. **Run Python Script Monthly**
   ```bash
   python update_data.py
   ```

2. **Review scholar.json**
   - Check citation counts updated ✅
   - Check new publications added ✅
   - Check venue information accuracy ⚠️

3. **Manual Venue Corrections**
   - Update any "Conference/Journal" entries
   - Fix incomplete venue names
   - Add publisher names for clarity

4. **Commit Changes**
   ```bash
   git add data/scholar.json
   git commit -m "Update publications and venue information"
   git push
   ```

## Example: Complete Publication Entry

```json
{
  "title": "Breast cancer detection using artificial intelligence techniques: A systematic literature review",
  "authors": "Ali Bou Nassif and Manar Abu Talib and Qassim Nasir and Yaman Afadar and Omar Elgendy",
  "venue": "Artificial Intelligence in Medicine - Elsevier",
  "year": 2022,
  "citations": 338,
  "url": "https://www.sciencedirect.com/science/article/pii/S0933365722000410"
}
```

## Troubleshooting

### Issue: Script still shows "Conference/Journal"
**Cause**: Google Scholar doesn't have venue data for this publication

**Solution**: Manually look up the venue and update `data/scholar.json`

### Issue: Venue is incomplete or wrong
**Cause**: Google Scholar data is incomplete or incorrectly parsed

**Solution**: Manually correct in `data/scholar.json`

### Issue: Script is very slow
**Cause**: 2-second delay between requests to avoid rate limiting

**Solution**: This is normal - Google Scholar scraping requires delays

---

## Summary

**Automatic (Python Script):**
- Fetches latest citation counts ✅
- Gets publication metadata ✅
- Attempts to get venue (may be incomplete) ⚠️

**Manual (You Edit JSON):**
- Correct venue names ✅
- Format consistency ✅
- Publisher information ✅

**Best Practice:**
Run the script to get updated citations, then manually verify/update venue information for a professional appearance.

---

**Updated:** 2025-11-29
**Status:** Script improved, manual verification recommended
