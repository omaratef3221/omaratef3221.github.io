// API Integration for Omar's Portfolio
// This file handles fetching data from the backend APIs

const API_BASE_URL = '/api';

// Loading states
let loadingStates = {
    linkedin: false,
    github: false,
    scholar: false
};

// Data cache
let apiData = {
    linkedin: null,
    github: null,
    scholar: null
};

// Initialize API data fetching
document.addEventListener('DOMContentLoaded', function() {
    // Show loading indicators
    showLoadingStates();
    
    // Fetch data from all APIs
    Promise.all([
        fetchLinkedInData(),
        fetchGitHubData(),
        fetchScholarData()
    ]).then(() => {
        console.log('All API data loaded successfully');
        hideLoadingStates();
    }).catch(error => {
        console.error('Error loading API data:', error);
        hideLoadingStates();
    });
});

function showLoadingStates() {
    // Add loading indicators to relevant sections
    const sections = ['experience', 'projects', 'publications'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator';
            loadingDiv.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading ${section} data...</p>
            `;
            element.appendChild(loadingDiv);
        }
    });
}

function hideLoadingStates() {
    const loadingIndicators = document.querySelectorAll('.loading-indicator');
    loadingIndicators.forEach(indicator => {
        indicator.remove();
    });
}

async function fetchLinkedInData() {
    try {
        loadingStates.linkedin = true;
        console.log('Fetching LinkedIn data...');
        
        const response = await fetch(`${API_BASE_URL}/linkedin/omaratef3221`);
        const data = await response.json();
        
        if (response.ok) {
            apiData.linkedin = data;
            updateExperienceSection(data);
            updateAboutSection(data);
            console.log('LinkedIn data loaded successfully');
        } else {
            console.error('LinkedIn API error:', data.error);
            // Use fallback data if available
            if (data.fallback && data.data) {
                apiData.linkedin = data.data;
                updateExperienceSection(data.data);
                updateAboutSection(data.data);
            }
        }
    } catch (error) {
        console.error('Error fetching LinkedIn data:', error);
    } finally {
        loadingStates.linkedin = false;
    }
}

async function fetchGitHubData() {
    try {
        loadingStates.github = true;
        console.log('Fetching GitHub data...');
        
        const response = await fetch(`${API_BASE_URL}/github/omaratef3221`);
        const data = await response.json();
        
        if (response.ok) {
            apiData.github = data;
            updateProjectsSection(data);
            updateHeroStats(data);
            console.log('GitHub data loaded successfully');
        } else {
            console.error('GitHub API error:', data.error);
            // Use fallback data if available
            if (data.fallback && data.data) {
                apiData.github = data.data;
                updateProjectsSection(data.data);
                updateHeroStats(data.data);
            }
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    } finally {
        loadingStates.github = false;
    }
}

async function fetchScholarData() {
    try {
        loadingStates.scholar = true;
        console.log('Fetching Google Scholar data...');
        
        const response = await fetch(`${API_BASE_URL}/scholar/lw70gLkAAAAJ`);
        const data = await response.json();
        
        if (response.ok) {
            apiData.scholar = data;
            updatePublicationsSection(data);
            updateHeroStatsScholar(data);
            console.log('Google Scholar data loaded successfully');
        } else {
            console.error('Google Scholar API error:', data.error);
            // Use fallback data if available
            if (data.fallback && data.data) {
                apiData.scholar = data.data;
                updatePublicationsSection(data.data);
                updateHeroStatsScholar(data.data);
            }
        }
    } catch (error) {
        console.error('Error fetching Google Scholar data:', error);
    } finally {
        loadingStates.scholar = false;
    }
}

function updateExperienceSection(linkedinData) {
    const experienceTimeline = document.querySelector('.experience-timeline');
    if (!experienceTimeline || !linkedinData.experience) return;
    
    // Clear existing content except the timeline line
    const existingItems = experienceTimeline.querySelectorAll('.experience-item');
    existingItems.forEach(item => item.remove());
    
    // Add new experience items
    linkedinData.experience.forEach((exp, index) => {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        
        experienceItem.innerHTML = `
            <div class="experience-date">${exp.startDate} - ${exp.endDate}</div>
            <div class="experience-content">
                <h3 class="experience-title">${exp.title}</h3>
                <h4 class="experience-company">${exp.company}${exp.location ? ', ' + exp.location : ''}</h4>
                <p class="experience-description">${exp.description}</p>
                <div class="experience-duration">${exp.duration}</div>
            </div>
        `;
        
        experienceTimeline.appendChild(experienceItem);
    });
}

function updateAboutSection(linkedinData) {
    // Update about description
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription && linkedinData.summary) {
        aboutDescription.textContent = linkedinData.summary;
    }
    
    // Update location in highlights
    const locationHighlight = document.querySelector('.highlight:nth-child(2) p');
    if (locationHighlight && linkedinData.location) {
        locationHighlight.textContent = linkedinData.location;
    }
}

function updateProjectsSection(githubData) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !githubData.repositories) return;
    
    // Clear existing projects
    projectsGrid.innerHTML = '';
    
    // Add new projects from GitHub
    githubData.repositories.slice(0, 6).forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Determine category based on language and topics
        const categories = determineProjectCategories(repo);
        projectCard.setAttribute('data-category', categories.join(' '));
        
        projectCard.innerHTML = `
            <div class="project-image">
                <div class="project-overlay">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-tech">
                    ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                    ${repo.topics.slice(0, 3).map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${repo.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

function determineProjectCategories(repo) {
    const categories = [];
    const language = repo.language ? repo.language.toLowerCase() : '';
    const topics = repo.topics.map(t => t.toLowerCase());
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    
    // Machine Learning
    if (topics.some(t => ['ml', 'machine-learning', 'pytorch', 'tensorflow', 'sklearn'].includes(t)) ||
        description.includes('machine learning') || description.includes('ml') ||
        name.includes('ml') || name.includes('pytorch')) {
        categories.push('ml');
    }
    
    // NLP
    if (topics.some(t => ['nlp', 'nlp-models', 'transformers', 'bert'].includes(t)) ||
        description.includes('nlp') || description.includes('natural language') ||
        name.includes('nlp') || name.includes('text')) {
        categories.push('nlp');
    }
    
    // Computer Vision
    if (topics.some(t => ['cv', 'computer-vision', 'opencv', 'image'].includes(t)) ||
        description.includes('computer vision') || description.includes('image') ||
        name.includes('vision') || name.includes('image')) {
        categories.push('cv');
    }
    
    // Web Development
    if (['javascript', 'html', 'css', 'react', 'vue', 'angular'].includes(language) ||
        topics.some(t => ['web', 'frontend', 'backend', 'react', 'vue'].includes(t))) {
        categories.push('web');
    }
    
    // Default to ml if no categories found and it's a Python project
    if (categories.length === 0 && language === 'python') {
        categories.push('ml');
    }
    
    return categories.length > 0 ? categories : ['ml'];
}

function updatePublicationsSection(scholarData) {
    const publicationsGrid = document.querySelector('.publications-grid');
    if (!publicationsGrid || !scholarData.top_publications) return;
    
    // Clear existing publications
    publicationsGrid.innerHTML = '';
    
    // Add top publications
    scholarData.top_publications.forEach(pub => {
        const publicationCard = document.createElement('div');
        publicationCard.className = 'publication-card';
        
        publicationCard.innerHTML = `
            <div class="publication-year">${pub.year}</div>
            <div class="publication-content">
                <h3 class="publication-title">${pub.title}</h3>
                <p class="publication-authors">${pub.authors}</p>
                <p class="publication-venue">${pub.venue}</p>
                <div class="publication-stats">
                    <span class="citation-count">Citations: ${pub.citations}</span>
                </div>
                ${pub.url ? `<a href="${pub.url}" target="_blank" class="publication-link">
                    <i class="fas fa-external-link-alt"></i> View Publication
                </a>` : ''}
            </div>
        `;
        
        publicationsGrid.appendChild(publicationCard);
    });
    
    // Update research stats
    updateResearchStats(scholarData);
}

function updateResearchStats(scholarData) {
    const profile = scholarData.profile;
    if (!profile) return;
    
    // Update publications count
    const pubsStatCard = document.querySelector('.stat-card:nth-child(1) h3');
    if (pubsStatCard) {
        pubsStatCard.textContent = `${scholarData.total_publications}+`;
    }
    
    // Update citations count
    const citationsStatCard = document.querySelector('.stat-card:nth-child(2) h3');
    if (citationsStatCard) {
        citationsStatCard.textContent = `${profile.citedby}+`;
    }
    
    // Update h-index
    const hindexStatCard = document.querySelector('.stat-card:nth-child(3) h3');
    if (hindexStatCard) {
        hindexStatCard.textContent = profile.hindex.toString();
    }
}

function updateHeroStats(githubData) {
    // Update years of experience (calculate from GitHub join date)
    const profile = githubData.profile;
    if (profile && profile.created_at) {
        const joinDate = new Date(profile.created_at);
        const yearsActive = new Date().getFullYear() - joinDate.getFullYear();
        
        const experienceStat = document.querySelector('.stat:nth-child(1) .stat-number');
        if (experienceStat) {
            experienceStat.textContent = `${Math.max(yearsActive, 5)}+`;
        }
    }
}

function updateHeroStatsScholar(scholarData) {
    const profile = scholarData.profile;
    if (!profile) return;
    
    // Update publications count in hero
    const publicationsStat = document.querySelector('.stat:nth-child(2) .stat-number');
    if (publicationsStat) {
        publicationsStat.textContent = `${scholarData.total_publications}+`;
    }
    
    // Update citations count in hero
    const citationsStat = document.querySelector('.stat:nth-child(3) .stat-number');
    if (citationsStat) {
        citationsStat.textContent = `${profile.citedby}+`;
    }
}

// Add loading spinner styles
const loadingStyles = `
<style>
.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 212, 255, 0.3);
    border-top: 3px solid var(--secondary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.experience-description {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    line-height: 1.6;
}

.experience-duration {
    color: var(--accent-color);
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.5rem;
}

.publication-stats {
    margin: 0.5rem 0;
}

.citation-count {
    color: var(--accent-color);
    font-weight: 500;
    font-size: 0.9rem;
}
</style>
`;

// Inject loading styles
document.head.insertAdjacentHTML('beforeend', loadingStyles);

// Export functions for external use
window.portfolioAPI = {
    fetchLinkedInData,
    fetchGitHubData,
    fetchScholarData,
    apiData,
    loadingStates
};

