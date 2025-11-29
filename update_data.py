#!/usr/bin/env python3
"""
Dynamic Data Update Script for Portfolio Website
This script fetches the latest data from Google Scholar and GitHub,
then updates the JSON files used by the static website.

Usage:
    python update_data.py
"""

import json
import requests
from datetime import datetime
from scholarly import scholarly
import time

# Configuration
SCHOLAR_USER_ID = 'lw70gLkAAAAJ'
GITHUB_USERNAME = 'omaratef3221'
SCHOLAR_JSON_PATH = 'data/scholar.json'
GITHUB_JSON_PATH = 'data/github.json'

def fetch_scholar_data():
    """Fetch latest Google Scholar data"""
    print("Fetching Google Scholar data...")
    try:
        # Search for author
        search_query = scholarly.search_author_id(SCHOLAR_USER_ID)
        author = scholarly.fill(search_query)

        # Get publications
        publications = []
        print(f"Found {len(author.get('publications', []))} publications")

        for pub in author.get('publications', []):
            try:
                # Fill publication details
                pub_filled = scholarly.fill(pub)
                bib = pub_filled.get('bib', {})

                pub_data = {
                    'title': bib.get('title', 'Unknown Title'),
                    'authors': bib.get('author', 'Unknown Authors'),
                    'venue': bib.get('venue', bib.get('journal', 'Unknown Venue')),
                    'year': int(bib.get('pub_year', 0)) if bib.get('pub_year') else 0,
                    'citations': pub_filled.get('num_citations', 0),
                    'url': pub_filled.get('pub_url', pub_filled.get('eprint_url', ''))
                }

                publications.append(pub_data)
                print(f"  ✓ {pub_data['title'][:50]}... ({pub_data['citations']} citations)")

                # Small delay to avoid rate limiting
                time.sleep(2)

            except Exception as e:
                print(f"  ✗ Error fetching publication: {e}")
                continue

        # Sort by citations
        publications.sort(key=lambda x: x['citations'], reverse=True)

        scholar_data = {
            'profile': {
                'name': author.get('name', 'Omar Elgendy'),
                'affiliation': author.get('affiliation', 'AI Engineer and Researcher'),
                'citedby': author.get('citedby', 0),
                'hindex': author.get('hindex', 0),
                'i10index': author.get('i10index', 0),
                'scholar_url': f'https://scholar.google.com/citations?user={SCHOLAR_USER_ID}&hl=en'
            },
            'publications': publications,
            'total_publications': len(publications),
            'last_updated': datetime.now().strftime('%Y-%m-%d')
        }

        print(f"\n✓ Scholar data fetched successfully!")
        print(f"  - Total Citations: {scholar_data['profile']['citedby']}")
        print(f"  - H-Index: {scholar_data['profile']['hindex']}")
        print(f"  - Publications: {len(publications)}")

        return scholar_data

    except Exception as e:
        print(f"✗ Error fetching Scholar data: {e}")
        return None

def fetch_github_data():
    """Fetch latest GitHub repositories data"""
    print("\nFetching GitHub data...")
    try:
        # Fetch all user repositories
        url = f'https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=100'
        response = requests.get(url)
        response.raise_for_status()

        repos = response.json()

        # Filter out forks and sort by stars
        user_repos = [
            {
                'name': repo['name'],
                'description': repo.get('description', 'No description available'),
                'html_url': repo['html_url'],
                'language': repo.get('language', 'Unknown'),
                'topics': repo.get('topics', []),
                'stars': repo['stargazers_count'],
                'forks': repo['forks_count'],
                'owner': repo['owner']['login']
            }
            for repo in repos
            if not repo['fork']  # Exclude forked repositories
        ]

        # Sort by stars
        user_repos.sort(key=lambda x: x['stars'], reverse=True)

        # Take top 6
        top_repos = user_repos[:6]

        github_data = {
            'repositories': top_repos,
            'last_updated': datetime.now().strftime('%Y-%m-%d')
        }

        print(f"✓ GitHub data fetched successfully!")
        print(f"  - Total repositories: {len(user_repos)}")
        print(f"  - Showing top 6 by stars:")
        for repo in top_repos:
            print(f"    • {repo['name']}: {repo['stars']}⭐ {repo['forks']}🍴")

        return github_data

    except Exception as e:
        print(f"✗ Error fetching GitHub data: {e}")
        return None

def save_json(data, file_path):
    """Save data to JSON file"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved to {file_path}")
        return True
    except Exception as e:
        print(f"✗ Error saving {file_path}: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("Portfolio Data Update Script")
    print("=" * 60)
    print()

    success_count = 0
    total_count = 2

    # Fetch and save Scholar data
    scholar_data = fetch_scholar_data()
    if scholar_data:
        if save_json(scholar_data, SCHOLAR_JSON_PATH):
            success_count += 1

    # Fetch and save GitHub data
    github_data = fetch_github_data()
    if github_data:
        if save_json(github_data, GITHUB_JSON_PATH):
            success_count += 1

    # Summary
    print()
    print("=" * 60)
    print(f"Update Complete: {success_count}/{total_count} successful")
    print("=" * 60)

    if success_count == total_count:
        print("✓ All data updated successfully!")
        print("\nYour website will now display the latest information.")
        print("Push these changes to GitHub Pages to see them live.")
    else:
        print("⚠ Some updates failed. Check the errors above.")

    return success_count == total_count

if __name__ == '__main__':
    main()
