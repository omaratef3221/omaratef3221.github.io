// GitHub Repositories Integration - JSON-based Static Version
// This file reads GitHub data from data/github.json

const GITHUB_JSON_PATH = 'data/github.json';

async function fetchGitHubPinned() {
    try {
        console.log('Fetching GitHub data from JSON file...');
        const response = await fetch(GITHUB_JSON_PATH);

        if (!response.ok) {
            throw new Error('Failed to load GitHub data');
        }

        const data = await response.json();
        console.log('GitHub data loaded from JSON successfully');

        if (data.repositories && data.repositories.length > 0) {
            updateProjectsWithPinned(data.repositories);
            updateGitHubStats(data.repositories.length);
        } else {
            throw new Error('No repositories found in JSON');
        }

    } catch (error) {
        console.error('Error loading GitHub data:', error);
        // Show error message to user
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p style="color: #ff4444; text-align: center;">Unable to load projects. Please try again later.</p>';
        }
    }
}

function updateProjectsWithPinned(pinnedRepos) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Clear existing projects
    projectsGrid.innerHTML = '';

    // Add pinned repositories as project cards
    pinnedRepos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        // Determine category based on language and topics
        const categories = determineProjectCategories(repo);
        projectCard.setAttribute('data-category', categories.join(' '));

        // Clean up repo name for display
        const displayName = repo.name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

        projectCard.innerHTML = `
            <div class="project-image">
                <div class="project-overlay">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${displayName}</h3>
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-tech">
                    ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                    ${repo.topics.slice(0, 3).map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${repo.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                </div>
                ${repo.owner !== 'omaratef3221' ? `<div class="project-owner">by ${repo.owner}</div>` : ''}
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });

    // Reinitialize animations
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
}

function determineProjectCategories(repo) {
    const categories = [];
    const language = repo.language ? repo.language.toLowerCase() : '';
    const topics = repo.topics.map(t => t.toLowerCase());
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();

    // Machine Learning
    if (topics.some(t => ['ml', 'machine-learning', 'pytorch', 'tensorflow', 'sklearn', 'scikit-learn'].includes(t)) ||
        description.includes('machine learning') || description.includes('ml') ||
        name.includes('ml') || name.includes('pytorch') || name.includes('tensorflow')) {
        categories.push('ml');
    }

    // NLP
    if (topics.some(t => ['nlp', 'nlp-models', 'transformers', 'bert', 'gpt', 'llm'].includes(t)) ||
        description.includes('nlp') || description.includes('natural language') ||
        description.includes('llm') || description.includes('language model') ||
        name.includes('nlp') || name.includes('text') || name.includes('llm')) {
        categories.push('nlp');
    }

    // Computer Vision
    if (topics.some(t => ['cv', 'computer-vision', 'opencv', 'image', 'vision'].includes(t)) ||
        description.includes('computer vision') || description.includes('image') ||
        description.includes('vision') || description.includes('object detection') ||
        name.includes('vision') || name.includes('image') || name.includes('detection')) {
        categories.push('cv');
    }

    // Web Development
    if (['javascript', 'typescript', 'html', 'css', 'react', 'vue', 'angular'].includes(language) ||
        topics.some(t => ['web', 'frontend', 'backend', 'react', 'vue', 'angular', 'nodejs'].includes(t)) ||
        description.includes('web') || description.includes('frontend') || description.includes('backend')) {
        categories.push('web');
    }

    // Default to ml if no categories found and it's a Python project
    if (categories.length === 0 && language === 'python') {
        categories.push('ml');
    }

    // If still no categories, add 'ml' as default
    if (categories.length === 0) {
        categories.push('ml');
    }

    return categories;
}

function updateGitHubStats(repoCount) {
    // Update hero section GitHub repos stat
    const githubHeroStat = document.querySelector('.hero-stats .stat:nth-child(4) .stat-number');
    if (githubHeroStat) {
        animateCounter(githubHeroStat, repoCount);
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

// Add CSS for project owner badge
const ownerStyle = document.createElement('style');
ownerStyle.textContent = `
    .project-owner {
        margin-top: 0.5rem;
        padding: 0.25rem 0.5rem;
        background: rgba(0, 255, 136, 0.1);
        border-left: 2px solid var(--accent-color);
        color: var(--text-secondary);
        font-size: 0.85rem;
        font-style: italic;
    }
`;
document.head.appendChild(ownerStyle);

// Load GitHub data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - github-pinned.js');
    // Wait a bit for other scripts to load
    setTimeout(() => {
        console.log('Fetching GitHub data now...');
        fetchGitHubPinned();
    }, 1000);
});
