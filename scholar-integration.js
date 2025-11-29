// Google Scholar Integration - JSON-based Static Version
// This file reads Google Scholar data from data/scholar.json

const SCHOLAR_JSON_PATH = 'data/scholar.json';

let currentPublications = [];
let currentSortMode = 'citations'; // Default to citations
let currentPage = 1;
const PUBLICATIONS_PER_PAGE = 3;

async function fetchScholarData() {
    try {
        console.log('Fetching scholar data from JSON file...');
        const response = await fetch(SCHOLAR_JSON_PATH);

        if (!response.ok) {
            throw new Error('Failed to load scholar data');
        }

        const scholarData = await response.json();
        console.log('Scholar data loaded from JSON successfully');

        updateScholarStats(scholarData);
        updatePublicationsList(scholarData);

    } catch (error) {
        console.error('Error loading scholar data:', error);
        // Show error message to user
        const publicationsGrid = document.querySelector('.publications-grid');
        if (publicationsGrid) {
            publicationsGrid.innerHTML = '<p style="color: #ff4444; text-align: center;">Unable to load publications. Please try again later.</p>';
        }
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
        animateCounter(citationsHeroStat, profile.citedby || 440);
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
            animateCounter(citationsCount, profile.citedby || 440);
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
    if (!scholarData || !scholarData.publications) return;

    // Store publications for filtering
    currentPublications = scholarData.publications;
    currentPage = 1; // Reset to first page

    // Add filter buttons and pagination before displaying
    addFilterButtons(scholarData);

    // Display publications with current sort
    displayPublications(scholarData);

    // Add "View More" link after the publications grid
    addViewMoreLink(scholarData);
}

function addFilterButtons(scholarData) {
    const publicationsSection = document.querySelector('#publications .container');
    if (!publicationsSection) return;

    // Remove existing filter buttons if present
    const existingFilter = document.getElementById('publication-filter');
    if (existingFilter) {
        existingFilter.remove();
    }

    // Create filter buttons container (positioned at top right)
    const filterDiv = document.createElement('div');
    filterDiv.id = 'publication-filter';
    filterDiv.className = 'publication-filter';
    filterDiv.innerHTML = `
        <div class="filter-label">Sort by:</div>
        <button class="filter-btn ${currentSortMode === 'citations' ? 'active' : ''}" data-sort="citations">
            <i class="fas fa-quote-right"></i> Citations
        </button>
        <button class="filter-btn ${currentSortMode === 'date' ? 'active' : ''}" data-sort="date">
            <i class="fas fa-calendar"></i> Date
        </button>
    `;

    // Insert after section header, before publications grid
    const sectionHeader = publicationsSection.querySelector('.section-header');
    if (sectionHeader) {
        sectionHeader.appendChild(filterDiv);
    }

    // Add click handlers
    const filterButtons = filterDiv.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sortMode = btn.getAttribute('data-sort');
            currentSortMode = sortMode;
            currentPage = 1; // Reset to first page when sorting changes

            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Re-display with new sort
            displayPublications(scholarData);
        });
    });
}

function displayPublications(scholarData) {
    const publicationsGrid = document.querySelector('.publications-grid');
    if (!publicationsGrid) return;

    // Sort publications based on current mode
    let sortedPubs = [...currentPublications];
    if (currentSortMode === 'citations') {
        sortedPubs.sort((a, b) => b.citations - a.citations);
    } else if (currentSortMode === 'date') {
        sortedPubs.sort((a, b) => b.year - a.year);
    }

    // Calculate pagination
    const totalPages = Math.ceil(sortedPubs.length / PUBLICATIONS_PER_PAGE);
    const startIndex = (currentPage - 1) * PUBLICATIONS_PER_PAGE;
    const endIndex = startIndex + PUBLICATIONS_PER_PAGE;
    const paginatedPubs = sortedPubs.slice(startIndex, endIndex);

    // Clear existing publications
    publicationsGrid.innerHTML = '';

    // Add publications for current page
    paginatedPubs.forEach(pub => {
        const publicationCard = document.createElement('div');
        publicationCard.className = 'publication-card';

        publicationCard.innerHTML = `
            <div class="publication-year">${pub.year}</div>
            <div class="publication-content">
                <h3 class="publication-title">${pub.title}</h3>
                <p class="publication-authors">${pub.authors}</p>
                <p class="publication-venue">${pub.venue}</p>
                <div class="publication-citations">
                    <i class="fas fa-quote-right"></i> Cited by ${pub.citations}
                </div>
                ${pub.url ? `<a href="${pub.url}" target="_blank" class="publication-link">
                    <i class="fas fa-external-link-alt"></i> View Publication
                </a>` : ''}
            </div>
        `;

        publicationsGrid.appendChild(publicationCard);
    });

    // Add pagination controls
    addPaginationControls(totalPages, scholarData);
}

function addPaginationControls(totalPages, scholarData) {
    const publicationsSection = document.querySelector('#publications .container');
    if (!publicationsSection) return;

    // Remove existing pagination if present
    const existingPagination = document.getElementById('publications-pagination');
    if (existingPagination) {
        existingPagination.remove();
    }

    // Only show pagination if more than one page
    if (totalPages <= 1) return;

    // Create pagination container
    const paginationDiv = document.createElement('div');
    paginationDiv.id = 'publications-pagination';
    paginationDiv.className = 'publications-pagination';

    // Create pagination buttons
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn page-number ${currentPage === i ? 'active' : ''}"
                    data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationDiv.innerHTML = paginationHTML;

    // Insert after publications grid, before view more link
    const publicationsGrid = publicationsSection.querySelector('.publications-grid');
    const viewMoreLink = document.getElementById('view-more-publications');

    if (viewMoreLink) {
        publicationsSection.insertBefore(paginationDiv, viewMoreLink);
    } else if (publicationsGrid) {
        publicationsGrid.after(paginationDiv);
    }

    // Add click handlers
    const paginationButtons = paginationDiv.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;

            const page = parseInt(btn.getAttribute('data-page'));
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                displayPublications(scholarData);

                // Scroll to publications section
                const publicationsSection = document.getElementById('publications');
                if (publicationsSection) {
                    publicationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function addViewMoreLink(scholarData) {
    // Check if we have the scholar URL
    const scholarUrl = scholarData.profile?.scholar_url || 'https://scholar.google.com/citations?user=lw70gLkAAAAJ&hl=en';

    // Find the publications section
    const publicationsSection = document.querySelector('#publications .container');
    if (!publicationsSection) {
        return;
    }

    // Remove existing view more link if present
    const existingLink = document.getElementById('view-more-publications');
    if (existingLink) {
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

    // Insert after pagination (or publications grid if no pagination), before research stats
    const researchStats = publicationsSection.querySelector('.research-stats');
    if (researchStats) {
        publicationsSection.insertBefore(viewMoreDiv, researchStats);
    } else {
        publicationsSection.appendChild(viewMoreDiv);
    }
}

// Load scholar data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - scholar-integration.js');
    // Wait a bit for other scripts to load
    setTimeout(() => {
        console.log('Fetching scholar data now...');
        fetchScholarData();
    }, 500);
});

// Also try when window loads (backup)
window.addEventListener('load', function() {
    console.log('Window loaded - checking if scholar data is loaded');
    const filterExists = document.getElementById('publication-filter');
    const viewMoreExists = document.getElementById('view-more-publications');

    if (!filterExists || !viewMoreExists) {
        console.log('Filter or View More button missing, fetching again...');
        setTimeout(() => {
            fetchScholarData();
        }, 100);
    }
});
