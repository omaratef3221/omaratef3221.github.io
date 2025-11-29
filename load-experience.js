// Load experience data from JSON file
async function loadExperienceData() {
    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();

        const experienceTimeline = document.querySelector('.experience-timeline');
        if (!experienceTimeline) return;

        // Clear existing content
        experienceTimeline.innerHTML = '';

        // Group experiences by company
        const groupedExperiences = groupExperiencesByCompany(data.experience);

        // Add experience items from JSON
        groupedExperiences.forEach((group, index) => {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';

            // If it's a group of multiple positions at same company
            if (group.positions.length > 1) {
                experienceItem.classList.add('experience-group');
            }

            // Company header with logo
            const logoHTML = group.logo ? `
                <div class="company-logo">
                    <img src="${group.logo}" alt="${group.company}" onerror="this.style.display='none'">
                </div>
            ` : '';

            // Period spans for the group
            const periodStart = group.positions[group.positions.length - 1].period.split(' - ')[0];
            const periodEnd = group.positions[0].period.split(' - ')[1];
            const fullPeriod = `${periodStart} - ${periodEnd}`;

            // Build positions HTML
            let positionsHTML = '';
            group.positions.forEach((position, idx) => {
                const achievementsList = position.achievements
                    .map(achievement => `<li>${achievement}</li>`)
                    .join('');

                positionsHTML += `
                    <div class="position ${idx > 0 ? 'position-secondary' : ''}">
                        <div class="position-header">
                            <h3 class="experience-title">${position.title}</h3>
                            <span class="position-period">${position.period}</span>
                        </div>
                        <ul class="experience-achievements">
                            ${achievementsList}
                        </ul>
                    </div>
                `;
            });

            experienceItem.innerHTML = `
                <div class="experience-date">${fullPeriod}</div>
                <div class="experience-content">
                    <div class="company-header">
                        ${logoHTML}
                        <div class="company-info">
                            <h4 class="experience-company">${group.company}</h4>
                            <span class="company-location">${group.location}</span>
                        </div>
                    </div>
                    <div class="positions-container">
                        ${positionsHTML}
                    </div>
                </div>
            `;

            experienceTimeline.appendChild(experienceItem);
        });

        console.log('Experience data loaded successfully from JSON');
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

// Group experiences by company
function groupExperiencesByCompany(experiences) {
    const grouped = [];
    const companyMap = new Map();

    experiences.forEach(exp => {
        if (companyMap.has(exp.company)) {
            // Add to existing company group
            companyMap.get(exp.company).positions.push(exp);
        } else {
            // Create new company group
            const group = {
                company: exp.company,
                location: exp.location,
                logo: exp.logo,
                positions: [exp]
            };
            companyMap.set(exp.company, group);
            grouped.push(group);
        }
    });

    return grouped;
}

// Load experience data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadExperienceData();
});
