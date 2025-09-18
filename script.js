// Tab-switching navigation logic
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');
let isTransitioning = false;

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

// Project filtering logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectLinks = document.querySelectorAll('.project-link');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to the clicked button
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