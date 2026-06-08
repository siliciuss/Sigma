// ===== ROUTER =====
const router = {
    currentPage: 'home',

    navigate(page) {
        if (page === this.currentPage) return;

        // Transition effect
        const transition = document.querySelector('.page-transition');
        transition.classList.add('active');

        setTimeout(() => {
            // Hide current page
            document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

            // Show new page
            const newPage = document.getElementById(`page-${page}`);
            if (newPage) {
                newPage.classList.remove('hidden');
                this.currentPage = page;

                // Update nav
                document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
                    link.classList.toggle('active', link.dataset.page === page);
                });

                // Update URL hash
                window.location.hash = page;

                // Scroll to top
                window.scrollTo(0, 0);

                // Initialize page-specific content
                this.initPage(page);
            }

            transition.classList.remove('active');
        }, 300);
    },

    initPage(page) {
        switch(page) {
            case 'home':
                this.animateStats();
                break;
            case 'analytics':
                this.initCharts();
                break;
        }
    },

    animateStats() {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.dataset.count);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 30);
        });
    },

    initCharts() {
        // Complexity Chart
        const complexityCtx = document.getElementById('complexityChart');
        if (complexityCtx) {
            new Chart(complexityCtx, {
                type: 'line',
                data: {
                    labels: ['Baseline', 'Artifacts', 'Language', 'Methodology', 'Training', 'Full System'],
                    datasets: [{
                        label: 'Complexity Handling',
                        data: [15, 45, 70, 85, 92, 98],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#606070' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#606070' }
                        }
                    }
                }
            });
        }

        // Efficiency Chart
        const efficiencyCtx = document.getElementById('efficiencyChart');
        if (efficiencyCtx) {
            new Chart(efficiencyCtx, {
                type: 'bar',
                data: {
                    labels: ['Sensory', 'Cognitive', 'Motor', 'Integration'],
                    datasets: [{
                        label: 'Efficiency Gain (%)',
                        data: [400, 600, 350, 520],
                        backgroundColor: [
                            'rgba(0, 212, 255, 0.7)',
                            'rgba(255, 107, 107, 0.7)',
                            'rgba(255, 217, 61, 0.7)',
                            'rgba(107, 203, 119, 0.7)'
                        ],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#606070' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#606070' }
                        }
                    }
                }
            });
        }

        // Matrix Chart
        const matrixCtx = document.getElementById('matrixChart');
        if (matrixCtx) {
            this.matrixChart = new Chart(matrixCtx, {
                type: 'radar',
                data: {
                    labels: ['Reach', 'Precision', 'Speed', 'Scale', 'Integration', 'Reliability'],
                    datasets: [
                        {
                            label: 'Artifacts',
                            data: [85, 92, 78, 95, 70, 88],
                            borderColor: '#00d4ff',
                            backgroundColor: 'rgba(0, 212, 255, 0.2)',
                            pointBackgroundColor: '#00d4ff'
                        },
                        {
                            label: 'Language',
                            data: [95, 88, 82, 90, 85, 92],
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                            pointBackgroundColor: '#ff6b6b'
                        },
                        {
                            label: 'Methodology',
                            data: [70, 90, 85, 75, 80, 95],
                            borderColor: '#ffd93d',
                            backgroundColor: 'rgba(255, 217, 61, 0.2)',
                            pointBackgroundColor: '#ffd93d'
                        },
                        {
                            label: 'Training',
                            data: [60, 95, 90, 65, 95, 98],
                            borderColor: '#6bcb77',
                            backgroundColor: 'rgba(107, 203, 119, 0.2)',
                            pointBackgroundColor: '#6bcb77'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            pointLabels: { color: '#606070' },
                            ticks: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: '#a0a0b0' }
                        }
                    }
                }
            });
        }
    }
};

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Re-render charts if on analytics page
    if (router.currentPage === 'analytics') {
        setTimeout(() => router.initCharts(), 300);
    }
});

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== NAVIGATION =====
document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        router.navigate(page);
    });
});

// ===== ECOSYSTEM NODE SELECTION =====
const ecosystemData = {
    artifact: {
        title: 'Artifacts',
        code: 'MEANS_01',
        color: '#00d4ff',
        desc: 'Physical objects designed to provide for human comfort, for the manipulation of things or materials, and for the manipulation of symbols. These extend the human motor channels beyond biological limitations.',
        metrics: { reach: 85, precision: 92, speed: 78 },
        tags: ['Tools', 'Computers', 'Displays', 'Storage', 'Input Devices']
    },
    language: {
        title: 'Language',
        code: 'MEANS_02',
        color: '#ff6b6b',
        desc: 'The way in which the individual parcels out the picture of his world into the concepts that his mind uses to model that world, and the symbols that he attaches to those concepts for conscious manipulation.',
        metrics: { reach: 95, precision: 88, speed: 82 },
        tags: ['Natural Language', 'Mathematics', 'Programming', 'Notation']
    },
    methodology: {
        title: 'Methodology',
        code: 'MEANS_03',
        color: '#ffd93d',
        desc: 'The methods, procedures, strategies, etc., with which an individual organizes his goal-centered (problem-solving) activity. Provides structured approaches to complexity.',
        metrics: { reach: 70, precision: 90, speed: 85 },
        tags: ['Algorithms', 'Heuristics', 'Workflows', 'Design Patterns']
    },
    training: {
        title: 'Training',
        code: 'MEANS_04',
        color: '#6bcb77',
        desc: 'The conditioning needed by the human being to bring his skills in using Means 1, 2, and 3 to the point where they are operationally effective. Transforms potential into performance.',
        metrics: { reach: 60, precision: 95, speed: 90 },
        tags: ['Education', 'Practice', 'Muscle Memory', 'Cognitive Drills']
    }
};

function selectEcosystemNode(type) {
    const data = ecosystemData[type];
    if (!data) return;

    // Update indicator
    const indicator = document.getElementById('detailIndicator');
    indicator.style.background = data.color;
    indicator.style.boxShadow = `0 0 10px ${data.color}`;

    // Update title and code
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailTitle').style.color = data.color;
    document.getElementById('detailCode').textContent = data.code;

    // Update description
    document.getElementById('detailDesc').textContent = data.desc;

    // Update metrics
    document.getElementById('metricReach').style.width = data.metrics.reach + '%';
    document.getElementById('metricReach').style.background = data.color;
    document.getElementById('metricReachVal').textContent = data.metrics.reach + '%';
    document.getElementById('metricReachVal').style.color = data.color;

    document.getElementById('metricPrecision').style.width = data.metrics.precision + '%';
    document.getElementById('metricPrecision').style.background = data.color;
    document.getElementById('metricPrecisionVal').textContent = data.metrics.precision + '%';
    document.getElementById('metricPrecisionVal').style.color = data.color;

    document.getElementById('metricSpeed').style.width = data.metrics.speed + '%';
    document.getElementById('metricSpeed').style.background = data.color;
    document.getElementById('metricSpeedVal').textContent = data.metrics.speed + '%';
    document.getElementById('metricSpeedVal').style.color = data.color;

    // Update tags
    const tagsContainer = document.querySelector('.detail-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach((tag, i) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        span.style.background = data.color + '1a';
        span.style.color = data.color;
        span.style.borderColor = data.color + '33';
        tagsContainer.appendChild(span);
    });
}

// ===== GALLERY FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        document.querySelectorAll('.gallery-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden-item');
                item.style.animation = 'pageEnter 0.4s ease forwards';
            } else {
                item.classList.add('hidden-item');
            }
        });
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    let valid = true;
    const fields = ['name', 'email', 'subject', 'message'];

    fields.forEach(field => {
        const input = document.getElementById(field);
        const group = input.closest('.form-group');

        if (!input.value.trim()) {
            group.classList.add('error');
            valid = false;
        } else {
            group.classList.remove('error');
        }
    });

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        valid = false;
    }

    if (valid) {
        // Simulate submission
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'pageEnter 0.5s ease forwards';

        // Reset form
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.style.display = 'none';
        }, 5000);
    }
});

// Remove error on input
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('error');
    });
});

// ===== MATRIX TOGGLES =====
document.querySelectorAll('.matrix-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
        const layer = toggle.dataset.layer;
        const colors = {
            artifact: '#00d4ff',
            language: '#ff6b6b',
            methodology: '#ffd93d',
            training: '#6bcb77'
        };

        if (router.matrixChart) {
            const datasetIndex = ['artifact', 'language', 'methodology', 'training'].indexOf(layer);
            if (datasetIndex !== -1) {
                router.matrixChart.data.datasets[datasetIndex].hidden = !toggle.checked;
                router.matrixChart.update();
            }
        }

        // Update status
        const activeCount = document.querySelectorAll('.matrix-toggle:checked').length;
        const percent = 20 + (activeCount * 20);
        const statusCircle = document.getElementById('statusCircle');
        const statusPercent = document.getElementById('statusPercent');
        const statusLabel = document.getElementById('statusLabel');

        if (statusCircle) {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (percent / 100) * circumference;
            statusCircle.style.strokeDashoffset = offset;
        }

        if (statusPercent) statusPercent.textContent = percent + '%';

        if (statusLabel) {
            if (activeCount === 4) statusLabel.textContent = 'Fully Augmented';
            else if (activeCount === 0) statusLabel.textContent = 'Baseline Human';
            else statusLabel.textContent = 'Partially Augmented';
        }
    });
});

// ===== GSAP ANIMATIONS =====
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero title animation
    gsap.from('.hero-title .line', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
    });

    gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 1.0,
        ease: 'power3.out'
    });

    gsap.from('.stat-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power3.out'
    });

    // Feature cards scroll animation
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Page headers
    gsap.from('.page-header', {
        scrollTrigger: {
            trigger: '.page-header',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== HASH ROUTING =====
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'home';
    router.navigate(hash);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Check initial hash
    const hash = window.location.hash.slice(1) || 'home';
    if (hash !== 'home') {
        router.navigate(hash);
    } else {
        router.animateStats();
    }

    // Initialize matrix status
    const statusCircle = document.getElementById('statusCircle');
    if (statusCircle) {
        const circumference = 2 * Math.PI * 45;
        statusCircle.style.strokeDasharray = circumference;
        statusCircle.style.strokeDashoffset = circumference * 0.02;
    }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    const pages = ['home', 'ecosystem', 'framework', 'analytics', 'gallery', 'contact'];
    const currentIndex = pages.indexOf(router.currentPage);

    if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
        router.navigate(pages[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        router.navigate(pages[currentIndex - 1]);
    }
});