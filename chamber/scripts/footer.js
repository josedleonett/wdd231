document.addEventListener('DOMContentLoaded', function() {
    window.chamberConfig = window.chamberConfig || {};
    const config = window.chamberConfig.footer || {};
    
    function createFooter() {
        const footer = document.createElement('footer');
        
        const companyInfoDiv = document.createElement('div');
        companyInfoDiv.className = 'footer-company-info';
        
        const companyTitle = document.createElement('h2');
        companyTitle.textContent = config.companyName || 'Chamber of Commerce of Province of Cordoba';
        
        const address = document.createElement('address');
        
        const addressLine = document.createElement('p');
        addressLine.textContent = config.address || '123 Main St, Cordoba, Argentina';
        
        const emailLine = document.createElement('p');
        const emailAddress = config.email || 'info@chambercordoba.com';
        emailLine.innerHTML = `Email: <a href="mailto:${emailAddress}">${emailAddress}</a>`;
        
        const phoneLine = document.createElement('p');
        const phoneNumber = config.phone || '(123) 456-7890';
        phoneLine.innerHTML = `Phone: <a href="tel:${phoneNumber.replace(/[^0-9+]/g, '')}">${phoneNumber}</a>`;
        
        address.appendChild(addressLine);
        address.appendChild(emailLine);
        address.appendChild(phoneLine);
        
        companyInfoDiv.appendChild(companyTitle);
        companyInfoDiv.appendChild(address);
        
        const socialMediaDiv = document.createElement('div');
        socialMediaDiv.className = 'footer-social-media';
        
        const socialTitle = document.createElement('h2');
        socialTitle.textContent = 'Follow Us';
        
        const socialIcons = document.createElement('ul');
        socialIcons.className = 'social-icons';
        
        const defaultSocialLinks = [
            { href: 'https://www.facebook.com/chambercordoba', label: 'Facebook', icon: 'facebook-f' },
            { href: 'https://www.twitter.com/chambercordoba', label: 'Twitter', icon: 'twitter' },
            { href: 'https://www.instagram.com/chambercordoba', label: 'Instagram', icon: 'instagram' },
            { href: 'https://www.linkedin.com/company/chambercordoba', label: 'LinkedIn', icon: 'linkedin-in' }
        ];
        
        const socialLinks = config.socialLinks || defaultSocialLinks;
        socialLinks.forEach(social => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = social.href;
            a.target = '_blank';
            a.setAttribute('aria-label', social.label);
            
            const img = document.createElement('img');
            img.src = `images/icons/${social.icon}.svg`;
            img.alt = social.label;
            img.className = 'icon';
            
            a.appendChild(img);
            li.appendChild(a);
            socialIcons.appendChild(li);
        });
        
        socialMediaDiv.appendChild(socialTitle);
        socialMediaDiv.appendChild(socialIcons);
        
        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.className = 'footer-author-info';
        
        const projectTitle = document.createElement('h2');
        projectTitle.textContent = config.projectTitle || 'WDD231 Chamber Project';
        
        const authorName = document.createElement('p');
        authorName.textContent = config.authorName || 'Jose D. Leonett';
        
        const copyright = document.createElement('p');
        copyright.innerHTML = 'Copyright © <span id="current-year"></span>';
        
        const website = document.createElement('p');
        const authorWebsite = config.authorWebsite || 'https://josedleonett.github.io';
        const authorWebsiteText = config.authorWebsiteText || 'josedleonett.github.io';
        website.innerHTML = `<a href="${authorWebsite}" target="_blank">${authorWebsiteText}</a>`;
        
        const lastMod = document.createElement('p');
        lastMod.innerHTML = 'Last Modification: <span id="last-modification-date"></span>';
        
        authorInfoDiv.appendChild(projectTitle);
        authorInfoDiv.appendChild(authorName);
        authorInfoDiv.appendChild(copyright);
        authorInfoDiv.appendChild(website);
        authorInfoDiv.appendChild(lastMod);
        
        footer.appendChild(companyInfoDiv);
        footer.appendChild(socialMediaDiv);
        footer.appendChild(authorInfoDiv);
        
        return footer;
    }
    
    function initFooter() {
        const body = document.body;
        const existingFooter = document.querySelector('footer');
        
        if (existingFooter) {
            existingFooter.remove();
        }
        const footer = createFooter();
        body.appendChild(footer);
        
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
        const lastModSpan = document.getElementById('last-modification-date');
        if (lastModSpan) {
            lastModSpan.textContent = document.lastModified;
        }
    }
    
    initFooter();
});
