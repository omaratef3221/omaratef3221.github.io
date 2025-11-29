// Load experience data from JSON file
async function loadExperienceData() {
    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();

        const experienceTimeline = document.querySelector('.experience-timeline');
        if (!experienceTimeline) return;

        // Clear existing content
        experienceTimeline.innerHTML = '';

        // Add experience items from JSON
        data.experience.forEach((exp, index) => {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';

            // Create achievements list HTML
            const achievementsList = exp.achievements
                .map(achievement => `<li>${achievement}</li>`)
                .join('');

            experienceItem.innerHTML = `
                <div class="experience-date">${exp.period}</div>
                <div class="experience-content">
                    <h3 class="experience-title">${exp.title}</h3>
                    <h4 class="experience-company">${exp.company}</h4>
                    <ul class="experience-achievements">
                        ${achievementsList}
                    </ul>
                </div>
            `;

            experienceTimeline.appendChild(experienceItem);
        });

        console.log('Experience data loaded successfully from JSON');
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

// Load experience data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadExperienceData();
});