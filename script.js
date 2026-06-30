// DOMContentLoaded ensures all elements are loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Elements --- //
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    const backgroundVideo = document.getElementById('smoke-video');
    const featureGrid = document.querySelector('.feature-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectLinks = document.querySelectorAll('.project-link');

    let isTransitioning = false;

    // --- Tab-switching navigation logic (original animation-based) --- //
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (isTransitioning) return;

            const targetPageName = this.textContent;
            const activePage = document.querySelector('.page.active');
            const targetPage = document.querySelector(`[data-page="${targetPageName}"]`);

            if (activePage === targetPage) return;

            isTransitioning = true;

            // Deactivate all nav links and activate the clicked one
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            // Animate out the current page
            activePage.classList.add('page-leave');
            activePage.addEventListener('animationend', function handler() {
                activePage.removeEventListener('animationend', handler);
                activePage.classList.remove('active', 'page-leave');

                // Animate in the new page
                targetPage.classList.add('active', 'page-enter');
                targetPage.addEventListener('animationend', function newHandler() {
                    targetPage.removeEventListener('animationend', newHandler);
                    targetPage.classList.remove('page-enter');
                    isTransitioning = false;
                });
            });
        });
    });

    // --- Project filtering logic --- //
    if (filterBtns.length && projectLinks.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;

                projectLinks.forEach(link => {
                    if (filter === 'all' || link.dataset.category === filter) {
                        link.classList.remove('hide');
                    } else {
                        link.classList.add('hide');
                    }
                });
            });
        });
    }

    // --- WhatsApp Contact Form Logic --- //
    const whatsappForm = document.getElementById('whatsapp-form');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;

            const whatsappNumber = "919650966875"; // Your WhatsApp number with country code

            // Construct the WhatsApp message
            const text = `Hello Shrey, %0A%0AMy Name: ${name} %0AMy Phone: ${phone} %0AMessage: ${message}`;
            
            // Construct the WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text.replace(/%0A/g, '\n'))}`;

            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- Email Contact Form Logic --- //
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const senderEmail = document.getElementById('email-sender').value;
            const subject = document.getElementById('email-subject').value;
            const message = document.getElementById('email-message').value;

            const targetEmail = "shraypratap@gmail.com";

            // Construct the mailto link
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + senderEmail + "\n\n" + message)}`;

            // Open the user's default email client
            window.location.href = mailtoUrl;
        });
    }

    // --- Background video hover effect in "About Me" --- //
    if (backgroundVideo && featureGrid) {
        const cards = {
            'data-science-card': 0,
            'data-analytics-card': 0,
            'web-designing-card': 0,
            'dashboard-designing-card': 0,
            'database-management-card': 3,
            'sports-card': 4
        };

        for (const cardId in cards) {
            const card = document.getElementById(cardId);
            if (card) {
                card.addEventListener('mouseenter', () => {
                    if (!backgroundVideo.paused) {
                        backgroundVideo.pause();
                    }
                    backgroundVideo.currentTime = cards[cardId];
                    backgroundVideo.play();
                    // Play for 4 seconds then pause
                    setTimeout(() => {
                        backgroundVideo.pause();
                    }, 4000); // Changed from 2000 to 4000
                });
            }
        }

        featureGrid.addEventListener('mouseleave', () => {
            backgroundVideo.pause();
        });
    }

    // --- Visitor Counter & Logger --- //
    // If you set up a Google Sheet Web App, paste its URL here to enable detailed private IP/location logging.
    // Otherwise, it falls back to using the free, instant counterapi.dev.
    const GOOGLE_SHEET_URL = ""; 

    async function initVisitorCounter() {
        const counterEl = document.getElementById('visitor-count');
        if (!counterEl) return;

        const hasVisited = sessionStorage.getItem('portfolio_visited');
        let count = 0;

        try {
            // Get location details using free IP API (only on first session load to save api limits)
            let geoData = {};
            if (!hasVisited) {
                try {
                    const geoRes = await fetch('https://freeipapi.com/api/json');
                    if (geoRes.ok) {
                        geoData = await geoRes.json();
                    }
                } catch (e) {
                    console.error("Geo API lookup failed:", e);
                }
            }

            if (GOOGLE_SHEET_URL) {
                // Prepare query parameters for Google Apps Script Web App
                const params = new URLSearchParams();
                
                // Only log detailed data if this is the first visit of the session
                if (!hasVisited) {
                    params.append('ipAddress', geoData.ipAddress || 'Unknown');
                    params.append('countryName', geoData.countryName || 'Unknown');
                    params.append('regionName', geoData.regionName || 'Unknown');
                    params.append('cityName', geoData.cityName || 'Unknown');
                    params.append('asnOrganization', geoData.asnOrganization || 'Unknown');
                    params.append('userAgent', navigator.userAgent);
                    params.append('pageUrl', window.location.href);
                } else {
                    params.append('action', 'get_count');
                }

                // Call Google Sheets Web App (single GET request handles logging + counts)
                const countRes = await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`);
                if (countRes.ok) {
                    const data = await countRes.json();
                    if (data && data.count !== undefined) {
                        count = data.count;
                        if (!hasVisited) {
                            sessionStorage.setItem('portfolio_visited', 'true');
                        }
                    }
                }
            } else {
                // Fallback to CounterAPI.dev (instant, zero-setup counter)
                const workspace = 'shreysisodiya';
                const key = 'portfolio';
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
                
                // Only increment using "/up" if it is a new session and not a local/test environment
                const url = (hasVisited || isLocal) 
                    ? `https://api.counterapi.dev/v1/${workspace}/${key}`
                    : `https://api.counterapi.dev/v1/${workspace}/${key}/up`;

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    count = data.count || 0;
                    if (!hasVisited && !isLocal) {
                        sessionStorage.setItem('portfolio_visited', 'true');
                    }
                }
            }
        } catch (err) {
            console.error("Visitor Counter error:", err);
        }

        // Display the count padded to 6 digits (e.g. 000142)
        if (count > 0) {
            counterEl.textContent = String(count).padStart(6, '0');
        } else {
            counterEl.textContent = '000001';
        }
    }

    initVisitorCounter();
});

