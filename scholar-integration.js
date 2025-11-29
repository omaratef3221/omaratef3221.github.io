// Google Scholar Integration
// This file handles displaying Google Scholar data

const SCHOLAR_USER_ID = 'lw70gLkAAAAJ'; // Omar's Google Scholar ID
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en`;

// Fallback data for GitHub Pages (static hosting)
const FALLBACK_SCHOLAR_DATA = {
    profile: {
        name: "Omar Elgendy",
        affiliation: "AI Engineer and Researcher",
        citedby: 438,
        hindex: 3,
        i10index: 2,
        scholar_url: SCHOLAR_URL
    },
    top_publications: [
        {
            title: "Breast cancer detection using artificial intelligence techniques: A systematic literature review",
            authors: "Ali Bou Nassif and Manar Abu Talib and Qassim Nasir and Yaman Afadar and Omar Elgendy",
            venue: "Artificial Intelligence in Medicine",
            year: 2022,
            citations: 336,
            url: "https://www.sciencedirect.com/science/article/pii/S0933365722000410"
        },
        {
            title: "Arabic fake news detection based on deep contextualized embedding models",
            authors: "Ali Bou Nassif, Ashraf Elnagar, Omar Elgendy, and Yaman Afadar",
            venue: "Neural Computing and Applications - Springer",
            year: 2022,
            citations: 89,
            url: "https://link.springer.com/article/10.1007/s00521-022-07206-4"
        },
        {
            title: "Alzheimer Detection using Different Deep Learning Methods with MRI Images",
            authors: "O. Elgendy and A. B. Nassif",
            venue: "2023 Advances in Science and Engineering Technology International Conferences (ASET) - IEEE",
            year: 2023,
            citations: 45,
            url: "https://ieeexplore.ieee.org/document/10180640/"
        },
        {
            title: "Heart Failure Prediction using Machine learning with Meta-heuristic feature selection techniques",
            authors: "O. Elgendy, A. B. Nassif, and B. Soudan",
            venue: "The 2024 OkIP International Conference on Advances in Health Information Technology (AHIT)",
            year: 2024,
            citations: 12,
            url: "https://doi.org/10.55432/978-1-6692-0007-9_4"
        }
    ],
    total_publications: 6
};

async function fetchScholarData() {
    try {
        // Try to fetch from Flask backend if available (local development)
        const response = await fetch(`/api/scholar/${SCHOLAR_USER_ID}`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const data = await response.json();
        const scholarData = data.fallback ? data.data : data;

        updateScholarStats(scholarData);
        updatePublicationsList(scholarData);

        console.log('Google Scholar data loaded from backend successfully');
    } catch (error) {
        console.log('Backend not available, using fallback data for GitHub Pages');
        // Use fallback data for GitHub Pages deployment
        updateScholarStats(FALLBACK_SCHOLAR_DATA);
        updatePublicationsList(FALLBACK_SCHOLAR_DATA);
    }
}

function updateScholarStats(scholarData) {
    if (!scholarData || !scholarData.profile) return;

    const profile = scholarData.profile;

    // Update hero section stats
    const publicationsHeroStat = document.querySelector('.hero-stats .stat:nth-child(2) .stat-number');
    if (publicationsHeroStat) {
        animateCounter(publicationsHeroStat, scholarData.total_publications || 6);
    }

    const citationsHeroStat = document.querySelector('.hero-stats .stat:nth-child(3) .stat-number');
    if (citationsHeroStat) {
        animateCounter(citationsHeroStat, profile.citedby || 350);
    }

    // Update publications section stats
    const statCards = document.querySelectorAll('.research-stats .stat-card');

    if (statCards.length >= 1) {
        const pubsCount = statCards[0].querySelector('h3');
        if (pubsCount) {
            animateCounter(pubsCount, scholarData.total_publications || 6);
        }
    }

    if (statCards.length >= 2) {
        const citationsCount = statCards[1].querySelector('h3');
        if (citationsCount) {
            animateCounter(citationsCount, profile.citedby || 350);
        }
    }

    if (statCards.length >= 3) {
        const hindexCount = statCards[2].querySelector('h3');
        if (hindexCount) {
            hindexCount.textContent = profile.hindex || 3;
        }
    }
}

function animateCounter(element, targetValue) {
    const duration = 1000; // 1 second
    const startValue = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        element.textContent = currentValue + (currentValue > 0 ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue + '+';
        }
    }

    requestAnimationFrame(updateCounter);
}

function updatePublicationsList(scholarData) {
    if (!scholarData || !scholarData.top_publications) return;

    const publicationsGrid = document.querySelector('.publications-grid');
    if (!publicationsGrid) return;

    // Clear existing publications
    publicationsGrid.innerHTML = '';

    // Add top 4 publications from scholar data
    scholarData.top_publications.forEach(pub => {
        const publicationCard = document.createElement('div');
        publicationCard.className = 'publication-card';

        publicationCard.innerHTML = `
            <div class="publication-year">${pub.year}</div>
            <div class="publication-content">
                <h3 class="publication-title">${pub.title}</h3>
                <p class="publication-authors">${pub.authors}</p>
                <p class="publication-venue">${pub.venue}</p>
                ${pub.url ? `<a href="${pub.url}" target="_blank" class="publication-link">
                    <i class="fas fa-external-link-alt"></i> View Publication
                </a>` : ''}
            </div>
        `;

        publicationsGrid.appendChild(publicationCard);
    });

    // Add "View More" link after the publications grid
    addViewMoreLink(scholarData);
}

function addViewMoreLink(scholarData) {
    console.log('addViewMoreLink called with data:', scholarData);

    // Check if we have the scholar URL
    const scholarUrl = scholarData.profile?.scholar_url || 'https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en';
    console.log('Scholar URL:', scholarUrl);

    // Find the publications section
    const publicationsSection = document.querySelector('#publications .container');
    console.log('Publications section found:', publicationsSection);
    if (!publicationsSection) {
        console.error('Publications section not found!');
        return;
    }

    // Remove existing view more link if present
    const existingLink = document.getElementById('view-more-publications');
    if (existingLink) {
        console.log('Removing existing view more link');
        existingLink.remove();
    }

    // Create view more link
    const viewMoreDiv = document.createElement('div');
    viewMoreDiv.id = 'view-more-publications';
    viewMoreDiv.className = 'view-more-container';
    viewMoreDiv.innerHTML = `
        <a href="${scholarUrl}" target="_blank" class="btn btn-secondary view-more-btn">
            <i class="fas fa-graduation-cap"></i> View All Publications on Google Scholar
        </a>
    `;

    // Insert after publications grid, before research stats
    const researchStats = publicationsSection.querySelector('.research-stats');
    console.log('Research stats found:', researchStats);
    if (researchStats) {
        publicationsSection.insertBefore(viewMoreDiv, researchStats);
        console.log('View More button inserted before research stats');
    } else {
        publicationsSection.appendChild(viewMoreDiv);
        console.log('View More button appended to publications section');
    }
}

function updateScholarStatsFromHTML() {
    // Fallback: keep existing static values
    console.log('Using static Google Scholar data from HTML');
}

// Load scholar data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        fetchScholarData();
    }, 500);
});
