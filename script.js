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
});
