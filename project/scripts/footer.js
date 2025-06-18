// Dynamic footer loading for Garden Planner

function loadFooter() {
    const footer = document.getElementById('garden-footer');
    
    if (!footer) return;

    const currentYear = new Date().getFullYear();
    
    const footerContent = `
        <div>
            <div>
                <h3>Garden Planner</h3>
                <p>Your digital gardening companion for sustainable growing.</p>
            </div>
            <div>
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="planner.html">Plant Planner</a></li>
                    <li><a href="my-garden.html">My Garden</a></li>
                    <li><a href="#" id="attributions-link">Attributions</a></li>
                </ul>
            </div>
            <div>
                <h3>Project Info</h3>
                <p><a href="#" target="_blank" id="demo-link">Video Demonstration</a></p>
                <p>&copy; ${currentYear} Jose D. Leonett | WDD 231 Project</p>
            </div>
        </div>
    `;
    
    footer.innerHTML = footerContent;
    
    initializeFooterLinks();
}

function initializeFooterLinks() {
    const attributionsLink = document.getElementById('attributions-link');
    const demoLink = document.getElementById('demo-link');
    
    if (attributionsLink) {
        attributionsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAttributions();
        });
    }
    
    if (demoLink) {
        demoLink.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoVideo();
        });
    }
}

function showAttributions() {
    alert('Attributions page - To be implemented');
}

function showDemoVideo() {
    alert('Demo video - To be implemented');
}

document.addEventListener('DOMContentLoaded', loadFooter);
