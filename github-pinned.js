// GitHub Pinned Repositories Integration
// This file fetches and displays pinned repositories from GitHub profile

const GITHUB_USERNAME = 'omaratef3221';

// Fallback data for GitHub Pages (static hosting)
const FALLBACK_GITHUB_DATA = [
    {
        name: "pytorch_tutorials",
        description: "Collection of PyTorch tutorials and implementations for deep learning",
        html_url: "https://github.com/omaratef3221/pytorch_tutorials",
        language: "Python",
        topics: ["pytorch", "deep-learning", "neural-networks", "ml"],
        stars: 73,
        forks: 12,
        owner: "omaratef3221"
    },
    {
        name: "SQL_Query_Generator_llm",
        description: "Natural language to SQL query generator using LLMs",
        html_url: "https://github.com/omaratef3221/SQL_Query_Generator_llm",
        language: "Python",
        topics: ["llm", "nlp", "sql", "generative-ai"],
        stars: 15,
        forks: 3,
        owner: "omaratef3221"
    },
    {
        name: "podcast-summarizer-agent",
        description: "AI agent for summarizing podcast episodes using LLMs",
        html_url: "https://github.com/omaratef3221/podcast-summarizer-agent",
        language: "Python",
        topics: ["nlp", "llm", "summarization", "ai-agents"],
        stars: 8,
        forks: 2,
        owner: "omaratef3221"
    }
];

async function fetchGitHubPinned() {
    try {
        // Try to fetch from Flask backend if available (local development)
        const response = await fetch(`/api/github/${GITHUB_USERNAME}/pinned`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const data = await response.json();

        if (data.pinned_repositories && data.pinned_repositories.length > 0) {
            updateProjectsWithPinned(data.pinned_repositories);
            console.log('GitHub pinned repositories loaded from backend successfully');
        } else {
            console.log('No pinned repositories found, using fallback data');
            updateProjectsWithPinned(FALLBACK_GITHUB_DATA);
        }
    } catch (error) {
        console.log('Backend not available, using fallback data for GitHub Pages');
        // Use fallback data for GitHub Pages deployment
        updateProjectsWithPinned(FALLBACK_GITHUB_DATA);
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
                ${repo.owner !== GITHUB_USERNAME ? `<div class="project-owner">by ${repo.owner}</div>` : ''}
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

// Load pinned repos when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        fetchGitHubPinned();
    }, 1000);
});
