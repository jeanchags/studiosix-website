/**
 * Studio Six - Main JavaScript File
 * Author: Stack Pilot
 * Version: 1.1
 *
 * This script handles page navigation, header effects, mobile menu functionality,
 * and project filtering.
 */

document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile, .cta-link');
    const pages = document.querySelectorAll('.page');
    const filterContainer = document.getElementById('filters');
    const projectItems = document.querySelectorAll('.project-item');

    /**
     * Handles single-page navigation logic.
     * @param {string} pageId The ID of the page to display.
     */
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        window.scrollTo(0, 0);
    }

    /**
     * Handles project filtering on the 'projects' page.
     * @param {string} filter The category to filter by.
     */
    function filterProjects(filter) {
        projectItems.forEach(item => {
            const categories = item.dataset.category.split(' ');
            const matches = categories.includes(filter);

            if (filter === 'all' || matches) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // --- Event Listeners ---

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Project filter button clicks
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-filter')) {
                // Update active button state
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                // Filter projects
                const filterValue = e.target.dataset.filter;
                filterProjects(filterValue);
            }
        });
    }

    // --- Initial Page Load ---
    showPage('home');
});

