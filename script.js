// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// GitHub Projects API
const GITHUB_USERNAME = 'FabriGamerYT'; // Tu username de GitHub
const projectsGrid = document.getElementById('projectsGrid');

// Configuración de proyectos destacados (opcional)
const featuredProjects = [
    // Puedes agregar repositorios específicos que quieras destacar
    // {
    //     name: 'nombre-del-repo',
    //     category: 'web' // web, app, game
    // }
];

// Proyectos locales destacados
const localProjects = [
    {
        name: 'ATL Production System',
        description: 'Sistema de gestión de producción empresarial con dashboard interactivo, escáner QR y control en tiempo real',
        html_url: './atl-production-system/index.html',
        homepage: './atl-production-system/demo.html',
        language: 'JavaScript',
        topics: ['web', 'dashboard', 'production', 'qr-scanner'],
        stargazers_count: 0,
        forks_count: 0,
        has_pages: true,
        isLocal: true
    }
];

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`);
        const repos = await response.json();

        if (response.ok) {
            // Combinar proyectos locales con los de GitHub
            const allProjects = [...localProjects, ...repos];
            displayProjects(allProjects);
        } else {
            // Si falla GitHub, mostrar solo proyectos locales
            displayProjects(localProjects);
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        // Si hay error de conexión, mostrar proyectos locales
        displayProjects(localProjects);
    }
}

function displayProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Filtrar repositorios (excluir forks y repositorios sin descripción, excepto proyectos locales)
    const filteredRepos = repos.filter(repo => 
        repo.isLocal || // Incluir proyectos locales siempre
        (!repo.fork && 
        repo.description && 
        repo.name !== `${GITHUB_USERNAME}.github.io`)
    );

    if (filteredRepos.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <h3>¡Proyectos próximamente!</h3>
                <p>Estoy trabajando en nuevos proyectos que aparecerán aquí pronto.</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = '';

    filteredRepos.forEach(repo => {
        const projectCard = createProjectCard(repo);
        projectsGrid.appendChild(projectCard);
    });

    // Initialize filter functionality after projects are loaded
    initializeFilters();
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', categorizeProject(repo));

    // Obtener el lenguaje principal y otros lenguajes
    const languages = repo.language ? [repo.language] : [];

    // Icono especial para proyectos locales
    const projectIcon = repo.isLocal ? '<i class="fas fa-star" style="color: #f59e0b;"></i>' : '';

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${projectIcon} ${repo.name}</h3>
            <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
        </div>
        <p class="project-description">${repo.description || 'Sin descripción disponible'}</p>
        ${languages.length > 0 ? `
            <div class="project-languages">
                ${languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
            </div>
        ` : ''}
        <div class="project-links">
            ${!repo.isLocal ? `
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> Código
                </a>
            ` : ''}
            ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" class="project-link">
                    <i class="fas fa-${repo.isLocal ? 'play' : 'external-link-alt'}"></i> ${repo.isLocal ? 'Ver Demo' : 'Demo'}
                </a>
            ` : ''}
            ${(repo.has_pages && !repo.isLocal) ? `
                <a href="https://${GITHUB_USERNAME}.github.io/${repo.name}" target="_blank" class="project-link">
                    <i class="fas fa-globe"></i> Sitio
                </a>
            ` : ''}
        </div>
    `;

    return card;
}

function categorizeProject(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics || [];
    
    // Categorizar basado en el nombre, descripción y topics
    if (topics.includes('game') || name.includes('game') || description.includes('juego') || description.includes('game')) {
        return 'game';
    }
    
    if (topics.includes('web') || topics.includes('website') || topics.includes('dashboard') || 
        name.includes('web') || description.includes('web') || description.includes('dashboard') || 
        repo.has_pages) {
        return 'web';
    }
    
    if (topics.includes('app') || topics.includes('application') || name.includes('app') || 
        description.includes('aplicación') || description.includes('application') ||
        description.includes('sistema') || description.includes('production')) {
        return 'app';
    }
    
    // Por defecto, categorizar como 'web' si tiene GitHub Pages habilitado
    return repo.has_pages ? 'web' : 'app';
}

function showError(message) {
    projectsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Oops! ${message}</h3>
            <p>Mientras tanto, puedes visitar mi <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">perfil de GitHub</a></p>
        </div>
    `;
}

// Project filtering
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Load GitHub projects
    fetchGitHubProjects();
});

// Add some CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .error-message, .no-projects {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        background-color: var(--bg-card);
        border-radius: var(--border-radius);
        border: 2px dashed var(--border-color);
    }

    .error-message i, .no-projects i {
        font-size: 3rem;
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }

    .error-message h3, .no-projects h3 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }

    .error-message a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .error-message a:hover {
        text-decoration: underline;
    }

    .project-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .project-stats span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
`;
document.head.appendChild(style);
