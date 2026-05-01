document.addEventListener('DOMContentLoaded', function () {
    const topNav = document.querySelector('.top-nav');
    const sectionLinks = document.querySelectorAll('.nav-bar a, .top-nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTopButton = document.getElementById('backToTop');

    initAnchorLinks();
    initScrollEvents();
    initBackToTopButton();
    updateNavigationOnScroll();
    updateBackToTopButtonVisibility();
    hideLoading();

    function getNavOffset() {
        return topNav ? topNav.offsetHeight + 14 : 0;
    }

    function initAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');

                if (href === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    updateNavigation(href);
                    return;
                }

                const target = document.querySelector(href);
                if (!target) {
                    return;
                }

                const top = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset();
                window.scrollTo({ top: top, behavior: 'smooth' });
                updateNavigation(href);
            });
        });
    }

    function initScrollEvents() {
        window.addEventListener('scroll', function () {
            updateNavigationOnScroll();
            updateBackToTopButtonVisibility();
        }, { passive: true });
    }

    function updateNavigationOnScroll() {
        let current = '';
        const offset = getNavOffset() + 40;

        sections.forEach(function (section) {
            if (window.pageYOffset >= section.offsetTop - offset) {
                current = section.getAttribute('id');
            }
        });

        sectionLinks.forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === '#' && current === '' && window.pageYOffset < 120) {
                link.classList.add('active');
            }

            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    function updateNavigation(href) {
        sectionLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        if (href === '#') {
            document.querySelectorAll('a[href="#"]').forEach(function (link) {
                link.classList.add('active');
            });
            return;
        }

        document.querySelectorAll('a[href="' + href + '"]').forEach(function (link) {
            link.classList.add('active');
        });
    }

    function initBackToTopButton() {
        if (!backToTopButton) {
            return;
        }

        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateNavigation('#');
        });
    }

    function updateBackToTopButtonVisibility() {
        if (!backToTopButton) {
            return;
        }

        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.classList.add('is-visible');
        } else {
            backToTopButton.classList.remove('is-visible');
        }
    }

    function hideLoading() {
        window.setTimeout(function () {
            const loader = document.getElementById('loader');
            if (!loader) {
                return;
            }

            loader.classList.add('is-hidden');
            window.setTimeout(function () {
                loader.style.display = 'none';
            }, 260);
        }, 300);
    }
});

window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (!loader) {
        return;
    }

    loader.classList.add('is-hidden');
    window.setTimeout(function () {
        loader.style.display = 'none';
    }, 260);
});