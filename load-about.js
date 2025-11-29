// Load about data from JSON file
async function loadAboutData() {
    try {
        const response = await fetch('data/about.json');
        const data = await response.json();

        const aboutData = data.about;

        // Update section header
        const sectionTitle = document.querySelector('#about .section-title');
        if (sectionTitle) {
            sectionTitle.textContent = aboutData.title;
        }

        const sectionSubtitle = document.querySelector('#about .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = aboutData.subtitle;
        }

        // Update description paragraphs
        const aboutText = document.querySelector('.about-text');
        if (aboutText && aboutData.description) {
            // Clear existing paragraphs
            const existingParagraphs = aboutText.querySelectorAll('.about-description');
            existingParagraphs.forEach(p => p.remove());

            // Add new paragraphs
            aboutData.description.forEach(text => {
                const p = document.createElement('p');
                p.className = 'about-description';
                p.textContent = text;
                aboutText.insertBefore(p, aboutText.querySelector('.about-highlights'));
            });
        }

        // Update education
        const educationHighlight = document.querySelector('.about-highlights .highlight:nth-child(1) p');
        if (educationHighlight && aboutData.education) {
            educationHighlight.textContent = `${aboutData.education.degree} - ${aboutData.education.institution}`;
        }

        // Update location
        const locationHighlight = document.querySelector('.about-highlights .highlight:nth-child(2) p');
        if (locationHighlight && aboutData.location) {
            locationHighlight.textContent = aboutData.location;
        }

        // Email section is kept as-is in HTML (hardcoded)
        // Interests are not displayed in highlights to preserve email section

        console.log('About data loaded successfully from JSON');
    } catch (error) {
        console.error('Error loading about data:', error);
    }

    // Load timeline from experience data
    try {
        const expResponse = await fetch('data/experience.json');
        const expData = await expResponse.json();

        const timeline = document.querySelector('.about-image .timeline');
        if (timeline && expData.experience) {
            // Clear existing timeline items
            timeline.innerHTML = '';

            // Add ALL experiences to timeline
            expData.experience.forEach(exp => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>${exp.period}</h4>
                        <p>${exp.title} at ${exp.company}</p>
                    </div>
                `;
                timeline.appendChild(timelineItem);
            });

            console.log('Timeline loaded successfully from experience.json');
        }
    } catch (error) {
        console.error('Error loading timeline from experience:', error);
    }
}

// Load about data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAboutData();
});
