document.addEventListener('DOMContentLoaded', function() {
    initAnchorLinks();
    initScrollEvents();
    initBackToTopButton();
    hideLoading();
});

function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href === '#') {
                window.scrollTo({top: 0, behavior: 'smooth'});
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            updateNavigation(href);
        });
    });
}

function initScrollEvents() {
    window.addEventListener('scroll', function() {
        updateNavigationOnScroll();
        updateBackToTopButtonVisibility();
    });
}

function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-bar a, .top-nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

function updateNavigation(href) {
    document.querySelectorAll('.nav-bar a, .top-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (href !== '#') {
        document.querySelectorAll(`a[href="${href}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
}

function initBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
}

function updateBackToTopButtonVisibility() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
}

function hideLoading() {
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        const profileCard = document.querySelector('.profile-card');
        const mainContent = document.querySelector('.main-content');
        const publications = document.getElementById('publications');
        
        if (profileCard) profileCard.style.animationPlayState = 'running';
        if (mainContent) mainContent.style.animationPlayState = 'running';
        if (publications) publications.style.animationPlayState = 'running';
    }, 500);
}

window.addEventListener('load', hideLoading);
