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
            const offsetTop = target.offsetTop - 80; // Ajustar por header fijo
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Cerrar menú móvil si está abierto
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
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
        name: 'System Production',
        description: 'Sistema de gestión de producción empresarial con dashboard interactivo, escáner QR y control en tiempo real desarrollado por FGameStudio Software',
        html_url: './atl-production-system/index.html',
        homepage: './atl-production-system/demo.html',
        language: 'JavaScript',
        topics: ['web', 'dashboard', 'production', 'qr-scanner'],
        stargazers_count: 0,
        forks_count: 0,
        status: 'En desarrollo',
        has_pages: true,
        isLocal: true
    },
    {
        name: 'programa de control de finansas personales',
        description: 'Sistema de gestión de finanzas personales desarrollado por FGameStudio Software',
        html_url: './control de finansas/index.html',
        homepage: './control de finansas/index.html',
        language: 'JavaScript',
        topics: ['web', 'dashboard', 'finanzas', 'divisas controller'],
        stargazers_count: 0,
        forks_count: 0,
        status: 'En desarrollo',
        has_pages: true,
        isLocal: true
    },
    {
        name: 'Puerto Alcazar - Servidor Minecraft',
        description: 'Servidor de Minecraft Java con mods de rol y lore medieval. Incluye boss épicos distribuidos por todo el mundo para batallas legendarias. Experiencia de juego inmersiva con historia rica y mecánicas de RPG avanzadas.',
        html_url: '#',
        homepage: '#',
        language: 'Java',
        topics: ['minecraft', 'java', 'rpg', 'medieval', 'mods', 'gaming'],
        stargazers_count: 15,
        forks_count: 3,
        has_pages: false,
        isLocal: true,
        status: 'Terminado',
        technologies: ['Minecraft Forge', 'Java', 'ModAPI', 'JSON', 'YAML']
    },
    {
        name: 'Explorador Espacial 3D',
        description: 'Juego interactivo 3D de exploración espacial con simulación realista del Sistema Solar. Incluye navegación de nave espacial, misiones, física orbital y controles inmersivos. Desarrollado con Three.js.',
        html_url: './explorador-espacial/index.html',
        homepage: './explorador-espacial/index.html',
        language: 'JavaScript',
        topics: ['game', '3d', 'threejs', 'space', 'simulation', 'interactive'],
        stargazers_count: 8,
        forks_count: 2,
        has_pages: true,
        isLocal: true,
        status: 'Terminado',
        technologies: ['Three.js', 'WebGL', 'JavaScript', 'HTML5', 'CSS3', 'Física 3D']
    },
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

    // Obtener el lenguaje principal y tecnologías adicionales
    const languages = repo.language ? [repo.language] : [];
    const technologies = repo.technologies || [];
    const allTechs = [...new Set([...languages, ...technologies])];

    // Icono específico para cada tipo de proyecto
    let projectIcon = '<i class="fas fa-code"></i>';
    if (repo.name.includes('Minecraft') || repo.topics.includes('minecraft')) {
        projectIcon = '<i class="fas fa-cube" style="color: #00ff00;"></i>';
    } else if (repo.isLocal) {
        projectIcon = '<i class="fas fa-star" style="color: #f59e0b;"></i>';
    }

    // Badge de estado para proyectos locales
    const statusBadge = repo.status ? `<span class="status-badge-project ${repo.status.toLowerCase()}">${repo.status}</span>` : '';

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${projectIcon} ${repo.name}</h3>
            <div class="project-stats">
                ${statusBadge}
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
        </div>
        <p class="project-description">${repo.description || 'Sin descripción disponible'}</p>
        ${allTechs.length > 0 ? `
            <div class="project-languages">
                ${allTechs.slice(0, 5).map(tech => `<span class="language-tag">${tech}</span>`).join('')}
                ${allTechs.length > 5 ? `<span class="language-tag">+${allTechs.length - 5}</span>` : ''}
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
    if (topics.includes('game') || topics.includes('gaming') || topics.includes('minecraft') || 
        name.includes('game') || name.includes('minecraft') || name.includes('puerto-alcazar') ||
        description.includes('juego') || description.includes('game') || description.includes('minecraft') ||
        description.includes('servidor') && description.includes('minecraft')) {
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

// Servicios WhatsApp
function contactarServicio(servicio) {
    const mensajes = {
        'desarrollo': 'Hola, estoy interesado en sus servicios de desarrollo de software. Me gustaría obtener más información.',
        'reparacion': 'Hola, necesito servicios de reparación técnica. ¿Podrían ayudarme?',
        'consultoria': 'Hola, me gustaría solicitar una consultoría tecnológica. ¿Cuáles son sus disponibilidades?'
    };
    
    const telefono = '1234567890'; // Reemplazar con tu número de teléfono
    const mensaje = mensajes[servicio] || 'Hola, me gustaría obtener más información sobre sus servicios.';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
}

// Función para descargar CV
function downloadCV() {
    // Simulación de descarga de CV
    const link = document.createElement('a');
    link.href = '#'; // Aquí iría la ruta real del archivo PDF del CV
    link.download = 'Fabricio_Alcazar_CV.pdf';
    
    // Mostrar mensaje de que el CV está siendo preparado
    const btn = document.querySelector('.download-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando descarga...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Mostrar alerta de que el CV no está disponible (desarrollo)
        alert('El CV en PDF estará disponible próximamente. Mientras tanto, puedes contactarme directamente para solicitarlo.');
    }, 2000);
}

// Animación de barras de habilidades al hacer scroll
function animarBarrasHabilidades() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Inicialización de animaciones CV
document.addEventListener('DOMContentLoaded', function() {
    animarBarrasHabilidades();
});

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
