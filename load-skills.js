// Load skills data from JSON file
async function loadSkillsData() {
    try {
        const response = await fetch('data/skills.json');
        const data = await response.json();

        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        // Clear existing content
        skillsGrid.innerHTML = '';

        // Group skills by category
        const categories = {};
        data.skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = [];
            }
            categories[skill.category].push(skill);
        });

        // Create skill categories
        Object.entries(categories).forEach(([category, skills]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';

            // Sort skills by level (highest first)
            skills.sort((a, b) => b.level - a.level);

            // Build skills HTML - compact pill style
            const skillsHTML = skills.map(skill => {
                return `
                    <div class="skill-pill" data-level="${skill.level}">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}</span>
                    </div>
                `;
            }).join('');

            categoryDiv.innerHTML = `
                <h3 class="category-title">${category}</h3>
                <div class="skills-list">
                    ${skillsHTML}
                </div>
            `;

            skillsGrid.appendChild(categoryDiv);
        });

        // Animate skill bars when they come into view
        animateSkillBars();

        console.log('Skills data loaded successfully from JSON');
    } catch (error) {
        console.error('Error loading skills data:', error);
    }
}

// Animate skill bars on scroll
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Load skills data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadSkillsData();
});
