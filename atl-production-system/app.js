// ATL Production System Application
class ATLProductionApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.isLoggedIn = false;
        this.mockData = this.initializeMockData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Check if user is already logged in (for demo purposes)
        const savedUser = localStorage.getItem('atlUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showApp();
        }
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePassword());
        }

        // Navigation links
        document.querySelectorAll('.nav-link[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('[data-view]').dataset.view;
                this.navigateToView(view);
            });
        });

        // QR Scanner tabs
        document.getElementById('tab-lotes')?.addEventListener('click', () => this.switchQRTab('lotes'));
        document.getElementById('tab-operarios')?.addEventListener('click', () => this.switchQRTab('operarios'));

        // QR Scanner buttons
        document.getElementById('start-scanner-lotes')?.addEventListener('click', () => this.startQRScanner('lotes'));
        document.getElementById('start-scanner-operarios')?.addEventListener('click', () => this.startQRScanner('operarios'));

        // Modal close buttons
        document.getElementById('qr-continue-btn')?.addEventListener('click', () => this.closeModal('qr-success-modal'));

        // User menu toggle
        document.getElementById('user-menu-button')?.addEventListener('click', () => this.toggleUserMenu());

        // Mobile menu
        document.getElementById('mobile-menu-button')?.addEventListener('click', () => this.toggleMobileMenu());

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });
    }

    initializeMockData() {
        return {
            users: [
                { id: 'admin', password: 'admin123', name: 'Carlos Rodríguez', role: 'Supervisor' },
                { id: 'op001', password: 'op123', name: 'María González', role: 'Operario' },
                { id: 'sup001', password: 'sup123', name: 'Juan Pérez', role: 'Supervisor' }
            ],
            productionLines: [
                { id: 1, name: 'Línea A', status: 'Activa', efficiency: 95, currentOrder: 'ORD-2024-001' },
                { id: 2, name: 'Línea B', status: 'Activa', efficiency: 87, currentOrder: 'ORD-2024-002' },
                { id: 3, name: 'Línea C', status: 'Mantenimiento', efficiency: 0, currentOrder: null },
                { id: 4, name: 'Línea D', status: 'Inactiva', efficiency: 0, currentOrder: null }
            ],
            orders: [
                { 
                    id: 'ORD-2024-001', 
                    product: 'Widget A', 
                    quantity: 1000, 
                    completed: 750, 
                    status: 'En Producción', 
                    dueDate: '2024-01-15',
                    createdDate: '2024-01-01',
                    startTime: '08:00 AM',
                    client: 'Cliente Industrial S.A.',
                    productCode: 'WA-001',
                    lot: '2024-001',
                    supervisor: 'Carlos Rodriguez',
                    location: 'Almacén Central',
                    deliveryMethod: 'Transporte Propio',
                    specifications: [
                        'Material: Acero inoxidable',
                        'Dimensiones: 25x15x10 cm',
                        'Peso: 1.2 kg'
                    ],
                    productionHistory: [
                        { date: '2024-01-02', time: '10:00 AM', event: 'Inicio de Control de Calidad', responsible: 'Responsable Ana Martinez', status: 'En Progreso' },
                        { date: '2024-01-02', time: '09:45 AM', event: 'Fabricación completada para 5,000 unidades de cableado antisismico', responsible: 'Responsable Juan Lozano', status: 'Completado' },
                        { date: '2024-01-02', time: '08:30 AM', event: 'Ajuste de máquinaria', responsible: 'Responsable Roberto Gómez', status: 'Completado' },
                        { date: '2024-01-01', time: '10:00 AM', event: 'Orden Creada', responsible: 'Responsable Jose Martinez', status: 'Completado' }
                    ]
                },
                { 
                    id: 'ORD-2024-002', 
                    product: 'Widget B', 
                    quantity: 500, 
                    completed: 200, 
                    status: 'En Producción', 
                    dueDate: '2024-01-12',
                    createdDate: '2024-01-02',
                    startTime: '09:30 AM',
                    client: 'Empresa Manufacturera Ltd.',
                    productCode: 'WB-002',
                    lot: '2024-002',
                    supervisor: 'Ana Martinez',
                    location: 'Almacén Norte',
                    deliveryMethod: 'Transporte Externo',
                    specifications: [
                        'Material: Aluminio',
                        'Dimensiones: 30x20x5 cm',
                        'Peso: 0.8 kg'
                    ],
                    productionHistory: [
                        { date: '2024-01-03', time: '11:30 AM', event: 'Control de calidad en progreso', responsible: 'Responsable Carlos Rodriguez', status: 'En Progreso' },
                        { date: '2024-01-02', time: '09:30 AM', event: 'Orden iniciada', responsible: 'Responsable Ana Martinez', status: 'Completado' }
                    ]
                },
                { 
                    id: 'ORD-2024-003', 
                    product: 'Widget C', 
                    quantity: 2000, 
                    completed: 2000, 
                    status: 'Completada', 
                    dueDate: '2024-01-10',
                    createdDate: '2023-12-28',
                    startTime: '07:00 AM',
                    client: 'Corporación Global Inc.',
                    productCode: 'WC-003',
                    lot: '2023-045',
                    supervisor: 'Roberto Gómez',
                    location: 'Almacén Sur',
                    deliveryMethod: 'Transporte Marítimo',
                    specifications: [
                        'Material: Plástico ABS',
                        'Dimensiones: 15x15x8 cm',
                        'Peso: 0.5 kg'
                    ],
                    productionHistory: [
                        { date: '2024-01-10', time: '16:00 PM', event: 'Orden completada y lista para envío', responsible: 'Responsable Roberto Gómez', status: 'Completado' },
                        { date: '2024-01-09', time: '14:30 PM', event: 'Control de calidad aprobado', responsible: 'Responsable Ana Martinez', status: 'Completado' },
                        { date: '2024-01-08', time: '10:00 AM', event: 'Fabricación completada', responsible: 'Responsable Juan Lozano', status: 'Completado' },
                        { date: '2023-12-28', time: '08:00 AM', event: 'Orden creada', responsible: 'Responsable Carlos Rodriguez', status: 'Completado' }
                    ]
                }
            ],
            stats: {
                activeOrders: 8,
                completedToday: 1250,
                efficiency: 91,
                quality: 98.5
            }
        };
    }

    handleLogin(e) {
        e.preventDefault();
        const employeeId = document.getElementById('employee-id').value;
        const password = document.getElementById('password').value;

        const user = this.mockData.users.find(u => u.id === employeeId && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('atlUser', JSON.stringify(user));
            this.showLoginSuccess();
        } else {
            this.showError('Credenciales incorrectas. Intenta con admin/admin123');
        }
    }

    showLoginSuccess() {
        // Show success animation then transition to app
        setTimeout(() => {
            this.showApp();
        }, 1500);
    }

    showApp() {
        this.isLoggedIn = true;
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        
        // Update user info
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.currentUser.role;
        
        // Load default view
        this.navigateToView('dashboard');
    }

    navigateToView(view) {
        // Update active navigation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

        this.currentView = view;
        this.loadViewContent(view);
        this.updatePageTitle(view);
    }

    updatePageTitle(view) {
        const titles = {
            dashboard: 'Dashboard Supervisor',
            production: 'Gestión de Producción',
            orders: 'Órdenes de Producción',
            staff: 'Gestión de Personal',
            inventory: 'Control de Inventario',
            quality: 'Control de Calidad',
            reports: 'Reportes y Análisis',
            settings: 'Configuración del Sistema'
        };

        document.getElementById('page-title').textContent = titles[view] || 'FGameStudio production system';
    }

    loadViewContent(view) {
        const mainContent = document.getElementById('main-content');
        
        switch (view) {
            case 'dashboard':
                mainContent.innerHTML = this.getDashboardContent();
                this.initializeDashboardCharts();
                break;
            case 'production':
                mainContent.innerHTML = this.getProductionContent();
                this.initializeProductionCharts();
                break;
            case 'orders':
                mainContent.innerHTML = this.getOrdersContent();
                break;
            case 'staff':
                mainContent.innerHTML = this.getStaffContent();
                break;
            case 'inventory':
                mainContent.innerHTML = this.getInventoryContent();
                break;
            case 'quality':
                mainContent.innerHTML = this.getQualityContent();
                break;
            case 'reports':
                mainContent.innerHTML = this.getReportsContent();
                break;
            case 'settings':
                mainContent.innerHTML = this.getSettingsContent();
                break;
            default:
                mainContent.innerHTML = '<div class="text-center py-12"><h3 class="text-xl text-gray-600">Contenido en desarrollo</h3></div>';
        }
    }

    getDashboardContent() {
        return `
            <!-- Date and Time -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800" id="current-date">Cargando...</h2>
                    <p class="text-gray-600" id="current-time">--:--:-- --</p>
                </div>
                <div class="flex space-x-2">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Nueva Orden
                    </button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Exportar
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="card bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Órdenes Activas</p>
                            <p class="text-2xl font-semibold text-gray-800">${this.mockData.stats.activeOrders}</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Producidos Hoy</p>
                            <p class="text-2xl font-semibold text-gray-800">${this.mockData.stats.completedToday.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Eficiencia</p>
                            <p class="text-2xl font-semibold text-gray-800">${this.mockData.stats.efficiency}%</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500">Calidad</p>
                            <p class="text-2xl font-semibold text-gray-800">${this.mockData.stats.quality}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Production Lines and Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Production Lines Status -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Estado de Líneas de Producción</h3>
                    <div class="space-y-4">
                        ${this.mockData.productionLines.map(line => `
                            <div class="production-line bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-medium text-gray-800">${line.name}</h4>
                                    <span class="status-badge ${line.status === 'Activa' ? 'active' : line.status === 'Mantenimiento' ? 'maintenance' : 'inactive'}">
                                        ${line.status}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between text-sm text-gray-600">
                                    <span>Eficiencia: ${line.efficiency}%</span>
                                    ${line.currentOrder ? `<span>Orden: ${line.currentOrder}</span>` : '<span>Sin órdenes</span>'}
                                </div>
                                <div class="mt-2">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${line.efficiency}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Production Chart -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Producción Semanal</h3>
                    <div class="chart-container">
                        <canvas id="productionChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Activity and Alerts -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Recent Activity -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="timeline-dot w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm text-gray-800">Orden ORD-2024-001 completada al 75%</p>
                                <p class="text-xs text-gray-500">Hace 15 minutos</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="timeline-dot w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm text-gray-800">Línea C programada para mantenimiento</p>
                                <p class="text-xs text-gray-500">Hace 32 minutos</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="timeline-dot w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm text-gray-800">Nueva orden ORD-2024-004 asignada</p>
                                <p class="text-xs text-gray-500">Hace 1 hora</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alerts and Notifications -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Alertas</h3>
                    <div class="space-y-3">
                        <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                            <p class="text-sm font-medium text-red-800">Material bajo</p>
                            <p class="text-xs text-red-600">Revisar inventario de Widget B</p>
                        </div>
                        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                            <p class="text-sm font-medium text-yellow-800">Mantenimiento pendiente</p>
                            <p class="text-xs text-yellow-600">Línea C requiere servicio</p>
                        </div>
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                            <p class="text-sm font-medium text-blue-800">Meta alcanzada</p>
                            <p class="text-xs text-blue-600">Producción diaria completada</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProductionContent() {
        return `
            <!-- Date and Time -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800">Vista General de Producción</h2>
                    <p class="text-gray-600">Monitoreo en tiempo real del proceso productivo</p>
                </div>
                <div class="flex space-x-2">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Nueva Planificación</button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Exportar Datos</button>
                </div>
            </div>

            <!-- Production Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div class="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Líneas de Producción</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.mockData.productionLines.map(line => `
                            <div class="border border-gray-200 rounded-lg p-4 ${line.status === 'Activa' ? 'border-green-300 bg-green-50' : line.status === 'Mantenimiento' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 bg-gray-50'}">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="font-semibold text-gray-800">${line.name}</h4>
                                    <span class="status-badge ${line.status === 'Activa' ? 'active' : line.status === 'Mantenimiento' ? 'maintenance' : 'inactive'}">
                                        ${line.status}
                                    </span>
                                </div>
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Eficiencia</span>
                                        <span class="font-medium">${line.efficiency}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${line.efficiency}%"></div>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Orden Actual</span>
                                        <span class="font-medium">${line.currentOrder || 'N/A'}</span>
                                    </div>
                                </div>
                                <div class="mt-4 flex space-x-2">
                                    <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver Detalles</button>
                                    ${line.status === 'Activa' ? '<button class="text-red-600 hover:text-red-700 text-sm font-medium">Pausar</button>' : '<button class="text-green-600 hover:text-green-700 text-sm font-medium">Activar</button>'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Real-time Metrics -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Métricas en Tiempo Real</h3>
                    <div class="space-y-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${this.mockData.stats.efficiency}%</div>
                            <div class="text-sm text-gray-500">Eficiencia Global</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">${this.mockData.stats.completedToday}</div>
                            <div class="text-sm text-gray-500">Unidades/día</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${this.mockData.stats.quality}%</div>
                            <div class="text-sm text-gray-500">Calidad</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-orange-600">2.4h</div>
                            <div class="text-sm text-gray-500">Tiempo Inactivo</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Production Chart -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Producción por Hora</h3>
                <div class="chart-container">
                    <canvas id="hourlyProductionChart"></canvas>
                </div>
            </div>
        `;
    }

    getOrdersContent() {
        return `
            <!-- Orders Header -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800">Órdenes de Producción</h2>
                    <p class="text-gray-600">Gestiona y monitorea todas las órdenes de producción</p>
                </div>
                <div class="flex space-x-2">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Nueva Orden</button>
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Filtros</button>
                </div>
            </div>

            <!-- Orders Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this.mockData.orders.map(order => `
                    <div class="order-card bg-white rounded-lg shadow-md p-6 border-l-4 ${order.status === 'Completada' ? 'border-green-500' : order.status === 'En Producción' ? 'border-blue-500' : 'border-yellow-500'}">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">${order.id}</h3>
                            <span class="status-badge ${order.status === 'Completada' ? 'active' : order.status === 'En Producción' ? 'pending' : 'maintenance'}">
                                ${order.status}
                            </span>
                        </div>
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Producto</span>
                                <span class="font-medium">${order.product}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Cantidad</span>
                                <span class="font-medium">${order.quantity.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Completado</span>
                                <span class="font-medium">${order.completed.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Fecha Límite</span>
                                <span class="font-medium">${order.dueDate}</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span>Progreso</span>
                                <span>${Math.round((order.completed / order.quantity) * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(order.completed / order.quantity) * 100}%"></div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded text-sm font-medium" onclick="app.showOrderDetails('${order.id}')">
                                Ver Detalles
                            </button>
                            <button class="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 px-3 rounded text-sm font-medium">
                                Editar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showOrderDetails(orderId) {
        const order = this.mockData.orders.find(o => o.id === orderId);
        if (!order) return;

        const mainContent = document.getElementById('main-content');
        const pageTitle = document.getElementById('page-title');
        
        pageTitle.textContent = `Detalles de Orden - ${order.id}`;
        
        mainContent.innerHTML = `
            <!-- Header with navigation -->
            <div class="bg-blue-600 text-white p-6 rounded-lg mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold">FGameStudio production Software</h1>
                        <p class="text-blue-100">Órdenes de Producción</p>
                    </div>
                    <button onclick="app.navigateToView('orders')" class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors">
                        ← Volver
                    </button>
                </div>
            </div>

            <!-- Date and Order Info -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Lunes, 1 de Enero 2024</h2>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>06:00:00 AM</span>
                        <div class="flex items-center space-x-2">
                            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <span>Carlos Rodríguez</span>
                    </div>
                </div>
                
                <!-- Order Navigation -->
                <div class="border-b border-gray-200 mb-6">
                    <nav class="flex space-x-6">
                        <button class="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium">Todos los Órdenes</button>
                        <button class="pb-2 text-gray-500 hover:text-gray-700">Detalle de Orden</button>
                        <button class="pb-2 text-gray-500 hover:text-gray-700">Crear Orden</button>
                        <button class="pb-2 text-gray-500 hover:text-gray-700">Reportes</button>
                    </nav>
                </div>

                <!-- Main Order Details Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Order Details Card (Left Side) -->
                    <div class="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                        <div class="border-b border-gray-200 pb-4 mb-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold">${order.id}</h3>
                                <span class="px-3 py-1 text-sm font-medium rounded-full ${order.status === 'En Progreso' ? 'bg-blue-100 text-blue-800' : order.status === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${order.status}
                                </span>
                            </div>
                            <p class="text-gray-500 mt-1">Creado: ${order.createdDate} • ${order.startTime}</p>
                        </div>

                        <!-- Order Information Grid -->
                        <div class="grid grid-cols-2 gap-6 mb-6">
                            <!-- Product Information -->
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-3">Información del Producto</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Código:</span>
                                        <span class="font-medium">${order.productCode}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Lote:</span>
                                        <span class="font-medium">${order.lot}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Cantidad:</span>
                                        <span class="font-medium">${order.quantity.toLocaleString()} unidades</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Completado:</span>
                                        <span class="font-medium">${order.completed.toLocaleString()} unidades</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Delivery Information -->
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-3">Información de Entrega</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Cliente:</span>
                                        <span class="font-medium">${order.client}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Dirección:</span>
                                        <span class="font-medium">${order.location}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Teléfono:</span>
                                        <span class="font-medium">+52 55 1234 5678</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Método de Envío:</span>
                                        <span class="font-medium">${order.deliveryMethod}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Email:</span>
                                        <span class="font-medium">j.monterrubio@empresa.com</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Provincia:</span>
                                        <span class="font-medium">Ciudad de México</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Stages -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-800 mb-4">Etapas de Producción</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">✓</div>
                                    <span class="ml-2 text-sm font-medium text-green-600">Recibido</span>
                                </div>
                                <div class="flex-1 h-1 bg-green-500 mx-2"></div>
                                
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">✓</div>
                                    <span class="ml-2 text-sm font-medium text-green-600">Fabricación</span>
                                </div>
                                <div class="flex-1 h-1 ${order.status === 'Completada' ? 'bg-green-500' : 'bg-blue-500'} mx-2"></div>

                                <div class="flex items-center">
                                    <div class="w-8 h-8 ${order.status === 'Completada' ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        ${order.status === 'Completada' ? '✓' : '3'}
                                    </div>
                                    <span class="ml-2 text-sm font-medium ${order.status === 'Completada' ? 'text-green-600' : 'text-blue-600'}">Control de Calidad</span>
                                </div>
                                <div class="flex-1 h-1 ${order.status === 'Completada' ? 'bg-green-500' : 'bg-gray-300'} mx-2"></div>

                                <div class="flex items-center">
                                    <div class="w-8 h-8 ${order.status === 'Completada' ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        ${order.status === 'Completada' ? '✓' : '4'}
                                    </div>
                                    <span class="ml-2 text-sm font-medium ${order.status === 'Completada' ? 'text-green-600' : 'text-gray-500'}">Completado</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex space-x-3">
                            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                📄 Imprimir
                            </button>
                            <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                                📧 Enviar
                            </button>
                            <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                                ✅ Completar Etapa
                            </button>
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="space-y-6">
                        <!-- Control de Calidad -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-800 mb-3">Control de Calidad</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Muestras Analizadas</span>
                                    <span class="font-semibold">250 / 500</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Tasa de Aprobación</span>
                                    <span class="text-green-600 font-semibold">95%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Resultados de Pruebas</span>
                                    <span class="text-green-600 font-semibold">Aprobado</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Responsable</span>
                                    <span class="font-semibold">${order.supervisor}</span>
                                </div>
                            </div>
                            <button class="w-full mt-3 bg-blue-50 text-blue-600 py-2 rounded text-sm font-medium hover:bg-blue-100 transition-colors">
                                Ver Reporte Completo
                            </button>
                        </div>

                        <!-- Equipo de Producción -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-800 mb-3">Equipo de Producción</h3>
                            <div class="space-y-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">👤</div>
                                    <div>
                                        <div class="text-sm font-medium">Juan Pérez</div>
                                        <div class="text-xs text-gray-500">Operador Senior</div>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                        <span class="text-xs text-gray-500 ml-1">Activo</span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">👤</div>
                                    <div>
                                        <div class="text-sm font-medium">María López</div>
                                        <div class="text-xs text-gray-500">Técnico de Calidad</div>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                        <span class="text-xs text-gray-500 ml-1">Activo</span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">👤</div>
                                    <div>
                                        <div class="text-sm font-medium">Pedro Gómez</div>
                                        <div class="text-xs text-gray-500">Técnico de Mantenimiento</div>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="w-2 h-2 bg-yellow-500 rounded-full inline-block"></span>
                                        <span class="text-xs text-gray-500 ml-1">Descanso</span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">👤</div>
                                    <div>
                                        <div class="text-sm font-medium">Roberto Gómez</div>
                                        <div class="text-xs text-gray-500">Operador de Máquinaria</div>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                        <span class="text-xs text-gray-500 ml-1">Activo</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Materiales y Recursos -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-800 mb-3">Materiales y Recursos</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between items-center">
                                    <span>Materias Primas</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
                                        </div>
                                        <span class="text-green-600 font-semibold text-xs">75%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Aguas Desionizadas</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-green-500 h-2 rounded-full" style="width: 90%"></div>
                                        </div>
                                        <span class="text-green-600 font-semibold text-xs">90%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Material de Empaque</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: 50%"></div>
                                        </div>
                                        <span class="text-yellow-600 font-semibold text-xs">50%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Insumos</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-red-500 h-2 rounded-full" style="width: 25%"></div>
                                        </div>
                                        <span class="text-red-600 font-semibold text-xs">25%</span>
                                    </div>
                                </div>
                            </div>
                            <button class="w-full mt-3 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                                Solicitar Materiales
                            </button>
                        </div>

                        <!-- Órdenes Relacionadas -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 class="font-semibold text-gray-800 mb-3">Órdenes Relacionadas</h3>
                            <div class="space-y-2 text-sm">
                                ${this.mockData.orders.filter(o => o.id !== orderId).slice(0, 2).map(relatedOrder => `
                                    <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                            <div class="font-medium">${relatedOrder.id}</div>
                                            <div class="text-xs text-gray-500">${relatedOrder.product}</div>
                                        </div>
                                        <span class="text-xs px-2 py-1 rounded ${relatedOrder.status === 'Completada' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}">
                                            ${relatedOrder.status}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Production History -->
            <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Historial de Producción</h3>
                <div class="space-y-4">
                    ${order.productionHistory.map(event => `
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center ${event.status === 'Completado' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}">
                                    ${event.status === 'Completado' ? '✓' : '•'}
                                </div>
                            </div>
                            <div class="flex-grow">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-gray-800">${event.event}</p>
                                        <p class="text-sm text-gray-500">${event.responsible}</p>
                                    </div>
                                    <div class="text-right text-sm text-gray-500">
                                        <p>${event.date}</p>
                                        <p>${event.time}</p>
                                    </div>
                                </div>
                                <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full ${event.status === 'Completado' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}">
                                    ${event.status}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getStaffContent() {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Gestión de Personal</h3>
                <p class="text-gray-600 mb-6">Sistema de control de operarios y turnos de trabajo</p>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                    Próximamente Disponible
                </button>
            </div>
        `;
    }

    getInventoryContent() {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-purple-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Control de Inventario</h3>
                <p class="text-gray-600 mb-6">Gestión de materiales y suministros</p>
                <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md">
                    Próximamente Disponible
                </button>
            </div>
        `;
    }

    getQualityContent() {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center text-green-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Control de Calidad</h3>
                <p class="text-gray-600 mb-6">Sistema de verificación y aseguramiento de calidad</p>
                <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                    Próximamente Disponible
                </button>
            </div>
        `;
    }

    getReportsContent() {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-yellow-100 rounded-full mx-auto flex items-center justify-center text-yellow-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Reportes y Análisis</h3>
                <p class="text-gray-600 mb-6">Generación de reportes e insights de producción</p>
                <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md">
                    Próximamente Disponible
                </button>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-gray-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Configuración del Sistema</h3>
                <p class="text-gray-600 mb-6">Ajustes y preferencias del sistema</p>
                <button class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md">
                    Próximamente Disponible
                </button>
            </div>
        `;
    }

    initializeDashboardCharts() {
        const ctx = document.getElementById('productionChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Producción',
                        data: [1200, 1900, 3000, 2500, 2200, 1800, 2400],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#e5e7eb'
                            }
                        },
                        x: {
                            grid: {
                                color: '#e5e7eb'
                            }
                        }
                    }
                }
            });
        }
    }

    initializeProductionCharts() {
        const ctx = document.getElementById('hourlyProductionChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
                    datasets: [{
                        label: 'Unidades/Hora',
                        data: [150, 180, 165, 190, 175, 160, 185, 170, 155, 145],
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
            `;
        }
    }

    switchQRTab(tab) {
        // Update tab styles
        if (tab === 'lotes') {
            document.getElementById('tab-lotes').className = 'tab py-2 px-1 border-b-2 border-blue-600 font-medium text-sm text-blue-600';
            document.getElementById('tab-operarios').className = 'tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700';
            
            document.getElementById('lotes-scanner').classList.remove('hidden');
            document.getElementById('lotes-scanner').classList.add('fade-in');
            document.getElementById('operarios-scanner').classList.add('hidden');
        } else {
            document.getElementById('tab-operarios').className = 'tab py-2 px-1 border-b-2 border-blue-600 font-medium text-sm text-blue-600';
            document.getElementById('tab-lotes').className = 'tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700';
            
            document.getElementById('operarios-scanner').classList.remove('hidden');
            document.getElementById('operarios-scanner').classList.add('fade-in');
            document.getElementById('lotes-scanner').classList.add('hidden');
        }
    }

    startQRScanner(type) {
        // Simulate QR scanning
        setTimeout(() => {
            let resultContent = '';
            
            if (type === 'lotes') {
                resultContent = `
                    <div class="text-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                        <h4 class="font-medium text-gray-800">Lote Escaneado</h4>
                        <p class="text-sm text-gray-600">LOT-2024-A001</p>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Producto:</span>
                            <span class="font-medium">Widget Premium A</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Cantidad:</span>
                            <span class="font-medium">1,000 unidades</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Estado:</span>
                            <span class="font-medium text-green-600">Disponible</span>
                        </div>
                    </div>
                `;
            } else {
                resultContent = `
                    <div class="text-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <h4 class="font-medium text-gray-800">Operario Registrado</h4>
                        <p class="text-sm text-gray-600">María González</p>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">ID:</span>
                            <span class="font-medium">OP-001</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Turno:</span>
                            <span class="font-medium">Matutino</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Estado:</span>
                            <span class="font-medium text-green-600">Activo</span>
                        </div>
                    </div>
                `;
            }
            
            document.getElementById('qr-result-content').innerHTML = resultContent;
            document.getElementById('qr-success-modal').classList.remove('hidden');
        }, 1500);
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('hidden');
    }

    toggleMobileMenu() {
        // Mobile menu functionality would go here
        console.log('Toggle mobile menu');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    closeAllModals() {
        document.querySelectorAll('[id$="-modal"]').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('es-ES', options);
        }
        
        if (timeElement) {
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: true 
            };
            timeElement.textContent = now.toLocaleTimeString('es-ES', timeOptions);
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        alert(message);
    }

    logout() {
        localStorage.removeItem('atlUser');
        this.currentUser = null;
        this.isLoggedIn = false;
        
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('login-container').classList.remove('hidden');
        
        // Clear form
        document.getElementById('employee-id').value = '';
        document.getElementById('password').value = '';
    }
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    window.atlApp = new ATLProductionApp();
    window.app = window.atlApp; // Make it accessible as 'app' too
});

// Global logout function for onclick handlers
function logout() {
    if (window.atlApp) {
        window.atlApp.logout();
    }
}
