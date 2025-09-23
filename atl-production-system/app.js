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

        // Simular actualizaciones en tiempo real cada 30 segundos
        setInterval(() => this.simulateRealTimeUpdates(), 30000);
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

    // ...existing code...
        // Initialize header interactive buttons
        this.initializeHeaderButtons();
    }
    // Soluciona error: método faltante para la vista de planificación
    getPlanningContent() {
        // Aquí puedes agregar el contenido de la vista de planificación si lo necesitas
        return '<div class="p-6">Planificación de Producción: contenido en desarrollo.</div>';
    }

    // Inicializa el sidebar colapsable y navegación
    initializeCollapsibleSidebar() {
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                const chevronIcon = this.querySelector('i');
                if (targetContent) {
                    const isHidden = targetContent.classList.contains('hidden');
                    targetContent.classList.toggle('hidden');
                    this.classList.toggle('text-blue-600', isHidden);
                    if (chevronIcon) chevronIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });

        // Collapse all sections except Operaciones
        document.querySelectorAll('.collapsible-content').forEach((section, idx) => {
            if (section.id !== 'operaciones-section') {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        });

        // Set Operaciones header as active
        const operacionesHeader = document.querySelector('.collapsible-header[data-target="operaciones-section"]');
        if (operacionesHeader) {
            operacionesHeader.classList.add('text-blue-600');
            const chevronIcon = operacionesHeader.querySelector('i');
            if (chevronIcon) chevronIcon.style.transform = 'rotate(180deg)';
        }

        // Sidebar navigation: resalta el enlace activo
        document.querySelectorAll('.sidebar-item.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelectorAll('.sidebar-item.nav-link').forEach(l => l.classList.remove('bg-blue-100', 'text-blue-700'));
                link.classList.add('bg-blue-100', 'text-blue-700');
            });
        });
    }

    // Nueva función para alternar menú de usuario
    toggleUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.classList.toggle('hidden');
        }
    }

    // Nueva función para alternar menú móvil
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('hidden');
        }
    }

    // Nueva función para iniciar escáner QR
    startQRScanner() {
        // Simular escáner QR
        setTimeout(() => {
            const qrModal = document.getElementById('qr-success-modal');
            if (qrModal) {
                qrModal.classList.remove('hidden');
            }
        }, 2000);
    }

    // Nueva función para cerrar modales
    closeAllModals() {
        const modals = document.querySelectorAll('[id$="-modal"]');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Nueva función para cerrar modales
    closeAllModals() {
        const modals = document.querySelectorAll('[id$="-modal"]');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Header interactive functionality
    initializeHeaderButtons() {
        // Quick Report Button
        document.getElementById('quick-report-btn')?.addEventListener('click', () => {
            this.showQuickReportModal();
        });

        // Emergency Stop Button
        document.getElementById('emergency-stop-btn')?.addEventListener('click', () => {
            this.initiateEmergencyStop();
        });

        // Maintenance Alert Button
        document.getElementById('maintenance-alert-btn')?.addEventListener('click', () => {
            this.showMaintenanceAlerts();
        });

        // Search Button
        document.getElementById('search-btn')?.addEventListener('click', () => {
            document.getElementById('search-modal')?.classList.remove('hidden');
            document.getElementById('global-search-input')?.focus();
        });

        document.getElementById('close-search-modal')?.addEventListener('click', () => {
            document.getElementById('search-modal')?.classList.add('hidden');
        });

        // Messages Button
        document.getElementById('messages-btn')?.addEventListener('click', () => {
            this.showMessages();
        });

        // Notifications Button
        document.getElementById('notifications-btn')?.addEventListener('click', () => {
            this.showNotifications();
        });

        // Help Button
        document.getElementById('help-btn')?.addEventListener('click', () => {
            document.getElementById('help-modal')?.classList.remove('hidden');
        });

        document.getElementById('close-help-modal')?.addEventListener('click', () => {
            document.getElementById('help-modal')?.classList.add('hidden');
        });

        // Profile Button
        document.getElementById('profile-btn')?.addEventListener('click', () => {
            this.showProfile();
        });

        // My Account Button
        document.getElementById('my-account-btn')?.addEventListener('click', () => {
            this.showAccountModal();
        });

        document.getElementById('close-account-modal')?.addEventListener('click', () => {
            document.getElementById('account-modal')?.classList.add('hidden');
        });

        document.getElementById('save-account-changes')?.addEventListener('click', () => {
            this.saveAccountChanges();
        });

        document.getElementById('cancel-account-changes')?.addEventListener('click', () => {
            document.getElementById('account-modal')?.classList.add('hidden');
        });

        // Preferences Button
        document.getElementById('preferences-btn')?.addEventListener('click', () => {
            this.showPreferences();
        });

        // Logout Button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.performLogout();
        });

        // QR Scanner functionality
        document.getElementById('qr-scanner-btn')?.addEventListener('click', () => {
            this.showQRScanner();
        });

        document.getElementById('close-qr')?.addEventListener('click', () => {
            document.getElementById('qr-modal')?.classList.add('hidden');
        });

        document.getElementById('scan-qr-btn')?.addEventListener('click', () => {
            this.simulateQRScan();
        });

        document.getElementById('qr-continue-btn')?.addEventListener('click', () => {
            document.getElementById('qr-success-modal')?.classList.add('hidden');
        });
    }

    // Interactive Functions
    showQuickReportModal() {
        this.showNotification('Generando reporte rápido...', 'info');
        setTimeout(() => {
            this.showNotification('Reporte generado exitosamente', 'success');
        }, 2000);
    }

    initiateEmergencyStop() {
        if (confirm('¿Está seguro de que desea iniciar el protocolo de parada de emergencia?')) {
            this.showNotification('🚨 PARADA DE EMERGENCIA ACTIVADA', 'error');
            document.body.style.background = 'linear-gradient(135deg, #fee2e2, #fecaca)';
            setTimeout(() => {
                document.body.style.background = '';
                this.showNotification('Sistema estabilizado. Parada de emergencia completada.', 'warning');
            }, 5000);
        }
    }

    showMaintenanceAlerts() {
        const alerts = [
            'Mantenimiento preventivo programado para Línea C - 15:00',
            'Calibración de sensores IoT pendiente - Línea A',
            'Revisión de seguridad industrial - Sector 2'
        ];
        
        let alertsHtml = '<div class="space-y-2">';
        alerts.forEach(alert => {
            alertsHtml += `<div class="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">${alert}</div>`;
        });
        alertsHtml += '</div>';
        
        this.showCustomModal('Alertas de Mantenimiento', alertsHtml);
    }

    showMessages() {
        const messages = [
            { from: 'María González', subject: 'Reporte de producción diario', time: '10:30' },
            { from: 'Carlos Ruiz', subject: 'Actualización de inventario', time: '09:15' },
            { from: 'Ana Martínez', subject: 'Reunión de calidad', time: '08:45' }
        ];
        
        let messagesHtml = '<div class="space-y-3">';
        messages.forEach(msg => {
            messagesHtml += `
                <div class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-medium text-gray-900">${msg.from}</div>
                            <div class="text-sm text-gray-600">${msg.subject}</div>
                        </div>
                        <div class="text-xs text-gray-400">${msg.time}</div>
                    </div>
                </div>
            `;
        });
        messagesHtml += '</div>';
        
        this.showCustomModal('Mensajes Recientes', messagesHtml);
    }

    showNotifications() {
        const notifications = [
            { type: 'success', message: 'Línea A superó objetivo de producción (+5%)', time: '2 min' },
            { type: 'warning', message: 'Nivel de inventario bajo en componente X-205', time: '15 min' },
            { type: 'info', message: 'Nueva orden de producción asignada', time: '1 hora' }
        ];
        
        let notificationsHtml = '<div class="space-y-3">';
        notifications.forEach(notif => {
            const iconClass = notif.type === 'success' ? 'fa-check-circle text-green-500' : 
                            notif.type === 'warning' ? 'fa-exclamation-triangle text-yellow-500' : 
                            'fa-info-circle text-blue-500';
            
            notificationsHtml += `
                <div class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <i class="fas ${iconClass} mt-1"></i>
                    <div class="flex-1">
                        <div class="text-sm text-gray-900">${notif.message}</div>
                        <div class="text-xs text-gray-500">hace ${notif.time}</div>
                    </div>
                </div>
            `;
        });
        notificationsHtml += '</div>';
        
        this.showCustomModal('Notificaciones', notificationsHtml);
    }

    showProfile() {
        const profileHtml = `
            <div class="text-center">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user text-white text-3xl"></i>
                </div>
                <h4 class="text-xl font-bold text-gray-900 mb-2">${this.currentUser.name}</h4>
                <p class="text-blue-600 font-medium mb-1">${this.currentUser.position}</p>
                <p class="text-gray-600 mb-4">${this.currentUser.department}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="font-medium text-gray-900">Turno</div>
                        <div class="text-gray-600">${this.currentUser.shift}</div>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="font-medium text-gray-900">Acceso</div>
                        <div class="text-gray-600">Nivel ${this.currentUser.accessLevel}</div>
                    </div>
                </div>
            </div>
        `;
        this.showCustomModal('Mi Perfil', profileHtml);
    }

    showAccountModal() {
        document.getElementById('account-modal')?.classList.remove('hidden');
        
        // Populate account data
        const accountUserName = document.getElementById('account-user-name');
        const accountUserRole = document.getElementById('account-user-role');
        const accountUserDepartment = document.getElementById('account-user-department');
        const accountFullName = document.getElementById('account-full-name');
        const accountEmail = document.getElementById('account-email');
        const accountPhone = document.getElementById('account-phone');
        const accountShift = document.getElementById('account-shift');

        if (accountUserName) accountUserName.textContent = this.currentUser.name;
        if (accountUserRole) accountUserRole.textContent = this.currentUser.position;
        if (accountUserDepartment) accountUserDepartment.textContent = this.currentUser.department;
        if (accountFullName) accountFullName.value = this.currentUser.name;
        if (accountEmail) accountEmail.value = this.currentUser.email;
        if (accountPhone) accountPhone.value = this.currentUser.phone || '+34 600 000 000';
        if (accountShift) accountShift.value = this.currentUser.shift;
    }

    saveAccountChanges() {
        this.showNotification('Configuración guardada exitosamente', 'success');
        document.getElementById('account-modal')?.classList.add('hidden');
    }

    showPreferences() {
        const preferencesHtml = `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <div class="font-medium text-gray-900">Notificaciones por email</div>
                        <div class="text-sm text-gray-500">Recibir alertas del sistema</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <div class="font-medium text-gray-900">Modo oscuro</div>
                        <div class="text-sm text-gray-500">Cambiar tema de la interfaz</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        `;
        this.showCustomModal('Preferencias', preferencesHtml);
    }

    performLogout() {
        if (confirm('¿Está seguro de que desea cerrar sesión?')) {
            this.showNotification('Cerrando sesión...', 'info');
            document.getElementById('loading-overlay')?.classList.remove('hidden');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    showCustomModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900">${title}</h3>
                    <button class="close-modal text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showQRScanner() {
        document.getElementById('qr-modal')?.classList.remove('hidden');
    }

    simulateQRScan() {
        document.getElementById('qr-modal')?.classList.add('hidden');
        setTimeout(() => {
            document.getElementById('qr-success-modal')?.classList.remove('hidden');
        }, 500);
    }

    initializeMockData() {
        return {
            users: [
                // Administración
                { id: 'admin', password: 'admin123', name: 'Carlos Rodríguez', role: 'Director General', department: 'Administración', shift: 'Diurno', email: 'carlos.rodriguez@atl-tech.com', phone: '+34-91-555-0123', startDate: '2018-01-15', permissions: ['all'], avatar: 'CR', status: 'Activo', lastLogin: '2025-01-03 14:30' },
                { id: 'hr001', password: 'hr123', name: 'Isabel Fernández', role: 'Directora RRHH', department: 'Recursos Humanos', shift: 'Diurno', email: 'isabel.fernandez@atl-tech.com', phone: '+34-91-555-0129', startDate: '2019-03-20', permissions: ['staff', 'reports', 'security'], avatar: 'IF', status: 'Activo', lastLogin: '2025-01-03 13:45' },
                { id: 'fin001', password: 'fin123', name: 'Eduardo Jiménez', role: 'Director Financiero', department: 'Finanzas', shift: 'Diurno', email: 'eduardo.jimenez@atl-tech.com', phone: '+34-91-555-0130', startDate: '2019-07-10', permissions: ['reports', 'analytics', 'kpi'], avatar: 'EJ', status: 'Activo', lastLogin: '2025-01-03 12:20' },
                
                // Producción
                { id: 'prod001', password: 'prod123', name: 'María González', role: 'Jefe de Producción', department: 'Producción', shift: 'Diurno', email: 'maria.gonzalez@atl-tech.com', phone: '+34-91-555-0124', startDate: '2020-03-10', permissions: ['production', 'quality', 'planning'], avatar: 'MG', status: 'Activo', lastLogin: '2025-01-03 15:10' },
                { id: 'op001', password: 'op123', name: 'Juan Pérez', role: 'Operario Senior', department: 'Producción', shift: 'Mañana', email: 'juan.perez@atl-tech.com', phone: '+34-91-555-0125', startDate: '2021-08-22', permissions: ['production'], avatar: 'JP', status: 'Activo', lastLogin: '2025-01-03 07:30' },
                { id: 'op002', password: 'op123', name: 'Carmen Ruiz', role: 'Operaria', department: 'Producción', shift: 'Tarde', email: 'carmen.ruiz@atl-tech.com', phone: '+34-91-555-0131', startDate: '2022-02-15', permissions: ['production'], avatar: 'CR', status: 'Activo', lastLogin: '2025-01-03 15:45' },
                { id: 'op003', password: 'op123', name: 'Diego Morales', role: 'Operario', department: 'Producción', shift: 'Noche', email: 'diego.morales@atl-tech.com', phone: '+34-91-555-0132', startDate: '2023-01-08', permissions: ['production'], avatar: 'DM', status: 'Activo', lastLogin: '2025-01-02 23:15' },
                
                // Calidad
                { id: 'qc001', password: 'qc123', name: 'Roberto Gómez', role: 'Director de Calidad', department: 'Calidad', shift: 'Diurno', email: 'roberto.gomez@atl-tech.com', phone: '+34-91-555-0127', startDate: '2019-06-15', permissions: ['quality', 'certifications', 'reports'], avatar: 'RG', status: 'Activo', lastLogin: '2025-01-03 14:00' },
                { id: 'qc002', password: 'qc123', name: 'Patricia López', role: 'Inspector de Calidad', department: 'Calidad', shift: 'Mañana', email: 'patricia.lopez@atl-tech.com', phone: '+34-91-555-0133', startDate: '2021-09-30', permissions: ['quality'], avatar: 'PL', status: 'Activo', lastLogin: '2025-01-03 08:45' },
                
                // Mantenimiento
                { id: 'maint001', password: 'maint123', name: 'Ana Martínez', role: 'Jefe de Mantenimiento', department: 'Mantenimiento', shift: 'Diurno', email: 'ana.martinez@atl-tech.com', phone: '+34-91-555-0126', startDate: '2020-01-05', permissions: ['maintenance', 'assets'], avatar: 'AM', status: 'Activo', lastLogin: '2025-01-03 13:30' },
                { id: 'tech001', password: 'tech123', name: 'Miguel Torres', role: 'Técnico Electrónico', department: 'Mantenimiento', shift: 'Mañana', email: 'miguel.torres@atl-tech.com', phone: '+34-91-555-0134', startDate: '2021-11-12', permissions: ['maintenance'], avatar: 'MT', status: 'Activo', lastLogin: '2025-01-03 09:20' },
                { id: 'tech002', password: 'tech123', name: 'Sergio Vega', role: 'Técnico Mecánico', department: 'Mantenimiento', shift: 'Tarde', email: 'sergio.vega@atl-tech.com', phone: '+34-91-555-0135', startDate: '2022-04-18', permissions: ['maintenance'], avatar: 'SV', status: 'Activo', lastLogin: '2025-01-03 16:15' },
                
                // Almacén e Inventario
                { id: 'inv001', password: 'inv123', name: 'Laura Silva', role: 'Jefe de Almacén', department: 'Almacén', shift: 'Diurno', email: 'laura.silva@atl-tech.com', phone: '+34-91-555-0128', startDate: '2020-11-30', permissions: ['inventory', 'suppliers'], avatar: 'LS', status: 'Activo', lastLogin: '2025-01-03 12:50' },
                { id: 'alm001', password: 'alm123', name: 'Francisco Navarro', role: 'Almacenero', department: 'Almacén', shift: 'Mañana', email: 'francisco.navarro@atl-tech.com', phone: '+34-91-555-0136', startDate: '2022-06-25', permissions: ['inventory'], avatar: 'FN', status: 'Activo', lastLogin: '2025-01-03 08:00' },
                
                // Logística
                { id: 'log001', password: 'log123', name: 'Raquel Herrera', role: 'Coordinadora Logística', department: 'Logística', shift: 'Diurno', email: 'raquel.herrera@atl-tech.com', phone: '+34-91-555-0137', startDate: '2021-01-20', permissions: ['suppliers', 'planning'], avatar: 'RH', status: 'Activo', lastLogin: '2025-01-03 11:30' },
                
                // I+D
                { id: 'rd001', password: 'rd123', name: 'Alejandro Castillo', role: 'Director I+D', department: 'Investigación y Desarrollo', shift: 'Diurno', email: 'alejandro.castillo@atl-tech.com', phone: '+34-91-555-0138', startDate: '2019-05-15', permissions: ['analytics', 'reports'], avatar: 'AC', status: 'Activo', lastLogin: '2025-01-03 16:45' },
                { id: 'ing001', password: 'ing123', name: 'Beatriz Ramos', role: 'Ingeniera Senior', department: 'Investigación y Desarrollo', shift: 'Diurno', email: 'beatriz.ramos@atl-tech.com', phone: '+34-91-555-0139', startDate: '2020-09-08', permissions: ['analytics'], avatar: 'BR', status: 'Activo', lastLogin: '2025-01-03 15:20' },
                
                // Seguridad
                { id: 'sec001', password: 'sec123', name: 'Andrés Medina', role: 'Jefe de Seguridad', department: 'Seguridad', shift: 'Diurno', email: 'andres.medina@atl-tech.com', phone: '+34-91-555-0140', startDate: '2020-12-01', permissions: ['security'], avatar: 'AM', status: 'Activo', lastLogin: '2025-01-03 14:20' },
                
                // Ventas
                { id: 'sales001', password: 'sales123', name: 'Cristina Sánchez', role: 'Directora Comercial', department: 'Ventas', shift: 'Diurno', email: 'cristina.sanchez@atl-tech.com', phone: '+34-91-555-0141', startDate: '2019-10-12', permissions: ['reports', 'analytics'], avatar: 'CS', status: 'Activo', lastLogin: '2025-01-03 13:00' }
            ],
            departments: [
                { id: 'admin', name: 'Administración', manager: 'Carlos Rodríguez', employees: 1, budget: 250000, status: 'Activo', location: 'Edificio A - Piso 3' },
                { id: 'rrhh', name: 'Recursos Humanos', manager: 'Isabel Fernández', employees: 1, budget: 180000, status: 'Activo', location: 'Edificio A - Piso 2' },
                { id: 'finanzas', name: 'Finanzas', manager: 'Eduardo Jiménez', employees: 1, budget: 200000, status: 'Activo', location: 'Edificio A - Piso 3' },
                { id: 'produccion', name: 'Producción', manager: 'María González', employees: 4, budget: 800000, status: 'Activo', location: 'Planta Principal' },
                { id: 'calidad', name: 'Calidad', manager: 'Roberto Gómez', employees: 2, budget: 150000, status: 'Activo', location: 'Laboratorio' },
                { id: 'mantenimiento', name: 'Mantenimiento', manager: 'Ana Martínez', employees: 3, budget: 300000, status: 'Activo', location: 'Taller Técnico' },
                { id: 'almacen', name: 'Almacén', manager: 'Laura Silva', employees: 2, budget: 120000, status: 'Activo', location: 'Área de Almacenaje' },
                { id: 'logistica', name: 'Logística', manager: 'Raquel Herrera', employees: 1, budget: 100000, status: 'Activo', location: 'Edificio B - Piso 1' },
                { id: 'rd', name: 'Investigación y Desarrollo', manager: 'Alejandro Castillo', employees: 2, budget: 400000, status: 'Activo', location: 'Laboratorio I+D' },
                { id: 'seguridad', name: 'Seguridad', manager: 'Andrés Medina', employees: 1, budget: 80000, status: 'Activo', location: 'Central de Seguridad' },
                { id: 'ventas', name: 'Ventas', manager: 'Cristina Sánchez', employees: 1, budget: 220000, status: 'Activo', location: 'Edificio A - Piso 1' }
            ],
            productionLines: [
                { 
                    id: 1, 
                    name: 'Línea A - Ensamblaje Principal', 
                    status: 'Activa', 
                    efficiency: 95, 
                    currentOrder: 'ORD-2024-001', 
                    capacity: 120, 
                    currentProduction: 114, 
                    temperature: 22.5, 
                    humidity: 45,
                    operatorCount: 4, 
                    lastMaintenance: '2024-01-01',
                    nextMaintenance: '2024-01-15',
                    totalProduced: 125400,
                    defectRate: 0.8,
                    energyConsumption: 85.2,
                    vibrationLevel: 'Normal',
                    noiseLevel: 68,
                    supervisor: 'María González',
                    shift: 'Diurno',
                    location: 'Planta A-Sector 1'
                },
                { 
                    id: 2, 
                    name: 'Línea B - Soldadura Robotizada', 
                    status: 'Activa', 
                    efficiency: 92, 
                    currentOrder: 'ORD-2024-002', 
                    capacity: 80, 
                    currentProduction: 74, 
                    temperature: 28.3, 
                    humidity: 38,
                    operatorCount: 2, 
                    lastMaintenance: '2023-12-28',
                    nextMaintenance: '2024-01-12',
                    totalProduced: 89650,
                    defectRate: 1.2,
                    energyConsumption: 142.8,
                    vibrationLevel: 'Elevado',
                    noiseLevel: 82,
                    supervisor: 'Juan Pérez',
                    shift: 'Mañana',
                    location: 'Planta B-Sector 2'
                },
                { 
                    id: 3, 
                    name: 'Línea C - Pintura Automatizada', 
                    status: 'Mantenimiento', 
                    efficiency: 0, 
                    currentOrder: null, 
                    capacity: 60, 
                    currentProduction: 0, 
                    temperature: 18.7, 
                    humidity: 42,
                    operatorCount: 0, 
                    lastMaintenance: '2024-01-03',
                    nextMaintenance: '2024-01-10',
                    totalProduced: 67200,
                    defectRate: 2.1,
                    energyConsumption: 0,
                    vibrationLevel: 'Apagado',
                    noiseLevel: 0,
                    supervisor: 'Carmen Ruiz',
                    shift: 'Mantenimiento',
                    location: 'Planta C-Sector 3'
                },
                { 
                    id: 4, 
                    name: 'Línea D - Empaque Inteligente', 
                    status: 'En Espera', 
                    efficiency: 0, 
                    currentOrder: null, 
                    capacity: 150, 
                    currentProduction: 0, 
                    temperature: 20.1, 
                    humidity: 50,
                    operatorCount: 0, 
                    lastMaintenance: '2024-01-02',
                    nextMaintenance: '2024-01-20',
                    totalProduced: 156780,
                    defectRate: 0.3,
                    energyConsumption: 12.5,
                    vibrationLevel: 'Mínimo',
                    noiseLevel: 35,
                    supervisor: 'Diego Morales',
                    shift: 'En Espera',
                    location: 'Planta D-Sector 4'
                },
                { 
                    id: 5, 
                    name: 'Línea E - Control Calidad Avanzado', 
                    status: 'Activa', 
                    efficiency: 96, 
                    currentOrder: 'ORD-2024-003', 
                    capacity: 50, 
                    currentProduction: 48, 
                    temperature: 21.2, 
                    humidity: 44,
                    operatorCount: 3, 
                    lastMaintenance: '2023-12-30',
                    nextMaintenance: '2024-01-18',
                    totalProduced: 52100,
                    defectRate: 0.2,
                    energyConsumption: 67.9,
                    vibrationLevel: 'Bajo',
                    noiseLevel: 52,
                    supervisor: 'Roberto Gómez',
                    shift: 'Diurno',
                    location: 'Laboratorio QC'
                },
                { 
                    id: 6, 
                    name: 'Línea F - Mecanizado CNC', 
                    status: 'Activa', 
                    efficiency: 88, 
                    currentOrder: 'ORD-2024-004', 
                    capacity: 35, 
                    currentProduction: 31, 
                    temperature: 24.8, 
                    humidity: 40,
                    operatorCount: 2, 
                    lastMaintenance: '2024-01-01',
                    nextMaintenance: '2024-01-25',
                    totalProduced: 28950,
                    defectRate: 1.8,
                    energyConsumption: 198.4,
                    vibrationLevel: 'Alto',
                    noiseLevel: 95,
                    supervisor: 'Miguel Torres',
                    shift: 'Tarde',
                    location: 'Taller Mecánico'
                }
            ],
            suppliers: [
                { id: 'SUP-001', name: 'MetalCorp Industrial S.A.', category: 'Materiales Metálicos', contact: 'Juan Carlos Vega', email: 'jvega@metalcorp.es', phone: '+34-93-445-6789', rating: 4.8, status: 'Activo', contract: 'Anual', lastDelivery: '2024-01-02', nextDelivery: '2024-01-08', deliveryReliability: 98.5, qualityScore: 96.2, location: 'Barcelona, España' },
                { id: 'SUP-002', name: 'AlumTech Solutions Ltd.', category: 'Aleaciones de Aluminio', contact: 'Sarah Mitchell', email: 'smitchell@alumtech.co.uk', phone: '+44-20-7946-0958', rating: 4.6, status: 'Activo', contract: 'Bianual', lastDelivery: '2024-01-01', nextDelivery: '2024-01-10', deliveryReliability: 94.8, qualityScore: 97.1, location: 'Londres, Reino Unido' },
                { id: 'SUP-003', name: 'PlastiMex Innovations Inc.', category: 'Polímeros y Plásticos', contact: 'Carlos Hernández', email: 'chernandez@plastimex.mx', phone: '+52-55-5123-4567', rating: 4.4, status: 'Activo', contract: 'Trimestral', lastDelivery: '2023-12-28', nextDelivery: '2024-01-15', deliveryReliability: 91.2, qualityScore: 93.8, location: 'Ciudad de México, México' },
                { id: 'SUP-004', name: 'FastCorp Components', category: 'Elementos de Fijación', contact: 'Michael O\'Connor', email: 'moconnor@fastcorp.com', phone: '+1-312-555-7890', rating: 4.9, status: 'Activo', contract: 'Anual', lastDelivery: '2024-01-03', nextDelivery: '2024-01-06', deliveryReliability: 99.1, qualityScore: 98.7, location: 'Chicago, Estados Unidos' },
                { id: 'SUP-005', name: 'ElectriMax Systems GmbH', category: 'Componentes Eléctricos', contact: 'Klaus Weber', email: 'kweber@electrimax.de', phone: '+49-89-1234-5678', rating: 4.7, status: 'Activo', contract: 'Anual', lastDelivery: '2024-01-02', nextDelivery: '2024-01-12', deliveryReliability: 96.4, qualityScore: 95.9, location: 'Múnich, Alemania' },
                { id: 'SUP-006', name: 'WeldPro Equipment S.r.l.', category: 'Equipos de Soldadura', contact: 'Giuseppe Rossi', email: 'grossi@weldpro.it', phone: '+39-011-234-5678', rating: 4.5, status: 'Activo', contract: 'Bianual', lastDelivery: '2023-12-15', nextDelivery: '2024-02-01', deliveryReliability: 88.9, qualityScore: 94.3, location: 'Turín, Italia' }
            ],
            assets: [
                { id: 'AST-001', name: 'Robot Soldador KUKA KR 210 R3100', type: 'Robot Industrial', department: 'Producción', location: 'Línea B', status: 'Operativo', purchaseDate: '2022-03-15', warranty: '2027-03-15', value: 95000, maintenanceSchedule: 'Mensual', lastMaintenance: '2024-01-01', nextMaintenance: '2024-02-01', utilizationRate: 87.3, efficiency: 94.2 },
                { id: 'AST-002', name: 'Centro Mecanizado Haas VF-4SS', type: 'Máquina CNC', department: 'Producción', location: 'Línea F', status: 'Operativo', purchaseDate: '2021-08-20', warranty: '2026-08-20', value: 125000, maintenanceSchedule: 'Quincenal', lastMaintenance: '2024-01-02', nextMaintenance: '2024-01-16', utilizationRate: 91.8, efficiency: 89.7 },
                { id: 'AST-003', name: 'Sistema de Pintura Wagner ProSpray', type: 'Equipo de Pintura', department: 'Producción', location: 'Línea C', status: 'Mantenimiento', purchaseDate: '2020-11-10', warranty: '2025-11-10', value: 45000, maintenanceSchedule: 'Semanal', lastMaintenance: '2024-01-03', nextMaintenance: '2024-01-10', utilizationRate: 0, efficiency: 0 },
                { id: 'AST-004', name: 'Transportador Automatizado FlexLink', type: 'Sistema Transporte', department: 'Producción', location: 'Línea D', status: 'En Espera', purchaseDate: '2023-01-05', warranty: '2028-01-05', value: 35000, maintenanceSchedule: 'Mensual', lastMaintenance: '2023-12-15', nextMaintenance: '2024-01-15', utilizationRate: 15.2, efficiency: 98.1 },
                { id: 'AST-005', name: 'Espectrómetro Bruker EOS 500', type: 'Equipo Análisis', department: 'Calidad', location: 'Laboratorio', status: 'Operativo', purchaseDate: '2022-06-30', warranty: '2027-06-30', value: 75000, maintenanceSchedule: 'Trimestral', lastMaintenance: '2023-12-20', nextMaintenance: '2024-03-20', utilizationRate: 68.5, efficiency: 96.8 },
                { id: 'AST-006', name: 'Carretilla Elevadora Toyota 8FBN25', type: 'Equipo Manejo', department: 'Almacén', location: 'Almacén Central', status: 'Operativo', purchaseDate: '2021-04-12', warranty: '2026-04-12', value: 28000, maintenanceSchedule: 'Mensual', lastMaintenance: '2023-12-28', nextMaintenance: '2024-01-28', utilizationRate: 73.9, efficiency: 92.4 }
            ],
            certifications: [
                { id: 'CERT-001', name: 'ISO 9001:2015', type: 'Gestión de Calidad', issuer: 'AENOR', issueDate: '2023-06-15', expiryDate: '2026-06-15', status: 'Vigente', auditor: 'María José Campos', nextAudit: '2024-06-15', compliance: 98.7, documents: ['Certificado ISO 9001', 'Informe Auditoría'] },
                { id: 'CERT-002', name: 'ISO 14001:2015', type: 'Gestión Ambiental', issuer: 'Bureau Veritas', issueDate: '2023-09-20', expiryDate: '2026-09-20', status: 'Vigente', auditor: 'Carlos Mendoza', nextAudit: '2024-09-20', compliance: 96.2, documents: ['Certificado ISO 14001', 'Plan Ambiental'] },
                { id: 'CERT-003', name: 'ISO 45001:2018', type: 'Seguridad y Salud', issuer: 'SGS', issueDate: '2023-11-10', expiryDate: '2026-11-10', status: 'Vigente', auditor: 'Ana Beltrán', nextAudit: '2024-11-10', compliance: 97.8, documents: ['Certificado ISO 45001', 'Manual SST'] },
                { id: 'CERT-004', name: 'CE Marking', type: 'Conformidad Europea', issuer: 'Organismo Notificado 0370', issueDate: '2024-01-01', expiryDate: '2027-01-01', status: 'Vigente', auditor: 'Roberto Iglesias', nextAudit: '2025-01-01', compliance: 99.1, documents: ['Declaración CE', 'Expediente Técnico'] }
            ],
            kpis: [
                { id: 'kpi-001', name: 'Eficiencia Global (OEE)', value: 87.3, target: 85, unit: '%', trend: 'up', category: 'Producción', lastUpdate: '2024-01-03 15:30' },
                { id: 'kpi-002', name: 'Tasa de Defectos', value: 1.2, target: 2.0, unit: '%', trend: 'down', category: 'Calidad', lastUpdate: '2024-01-03 14:45' },
                { id: 'kpi-003', name: 'Tiempo Medio Entre Fallos', value: 245, target: 200, unit: 'horas', trend: 'up', category: 'Mantenimiento', lastUpdate: '2024-01-03 12:20' },
                { id: 'kpi-004', name: 'Rotación de Inventario', value: 8.7, target: 10, unit: 'veces/año', trend: 'stable', category: 'Inventario', lastUpdate: '2024-01-03 11:15' },
                { id: 'kpi-005', name: 'Satisfacción Cliente', value: 94.2, target: 90, unit: '%', trend: 'up', category: 'Ventas', lastUpdate: '2024-01-03 16:00' },
                { id: 'kpi-006', name: 'Consumo Energético', value: 425.8, target: 450, unit: 'kWh/día', trend: 'down', category: 'Sostenibilidad', lastUpdate: '2024-01-03 13:40' }
            ],
            analytics: {
                productionTrends: [
                    { date: '2024-01-01', production: 1250, efficiency: 89.2, defects: 15 },
                    { date: '2024-01-02', production: 1340, efficiency: 91.7, defects: 12 },
                    { date: '2024-01-03', production: 1180, efficiency: 87.3, defects: 18 }
                ],
                qualityMetrics: {
                    passRate: 98.8,
                    defectsByCategory: [
                        { category: 'Dimensional', count: 8, percentage: 44.4 },
                        { category: 'Superficial', count: 6, percentage: 33.3 },
                        { category: 'Funcional', count: 4, percentage: 22.2 }
                    ]
                },
                maintenanceMetrics: {
                    preventive: 85.7,
                    corrective: 14.3,
                    plannedDowntime: 2.3,
                    unplannedDowntime: 0.8
                }
            },
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
            inventory: [
                { id: 'MAT-001', name: 'Acero Inoxidable 304', category: 'Material Prima', stock: 450, minStock: 100, maxStock: 1000, unit: 'kg', location: 'A-01', supplier: 'MetalCorp S.A.', lastUpdated: '2024-01-03', cost: 8.50, status: 'Disponible' },
                { id: 'MAT-002', name: 'Aluminio 6061', category: 'Material Prima', stock: 320, minStock: 150, maxStock: 800, unit: 'kg', location: 'A-02', supplier: 'AlumTech Ltd.', lastUpdated: '2024-01-02', cost: 6.20, status: 'Disponible' },
                { id: 'MAT-003', name: 'Plástico ABS', category: 'Material Prima', stock: 75, minStock: 200, maxStock: 600, unit: 'kg', location: 'B-01', supplier: 'PlastiMex Inc.', lastUpdated: '2024-01-01', cost: 3.80, status: 'Stock Bajo' },
                { id: 'COMP-001', name: 'Tornillos M6x20', category: 'Componentes', stock: 5000, minStock: 1000, maxStock: 10000, unit: 'pz', location: 'C-01', supplier: 'FastCorp', lastUpdated: '2024-01-03', cost: 0.15, status: 'Disponible' },
                { id: 'COMP-002', name: 'Arandelas M6', category: 'Componentes', stock: 3200, minStock: 800, maxStock: 8000, unit: 'pz', location: 'C-02', supplier: 'FastCorp', lastUpdated: '2024-01-02', cost: 0.05, status: 'Disponible' },
                { id: 'TOOL-001', name: 'Soldadora MIG 200A', category: 'Herramientas', stock: 3, minStock: 2, maxStock: 5, unit: 'pz', location: 'H-01', supplier: 'WeldPro', lastUpdated: '2024-01-01', cost: 850.00, status: 'Disponible' },
                { id: 'CONS-001', name: 'Cable Eléctrico 12AWG', category: 'Consumibles', stock: 150, minStock: 50, maxStock: 500, unit: 'm', location: 'D-01', supplier: 'ElectriMax', lastUpdated: '2024-01-03', cost: 2.30, status: 'Disponible' }
            ],
            qualityReports: [
                { id: 'QR-001', date: '2024-01-03', product: 'Widget A', batch: '2024-001', inspector: 'Roberto Gómez', status: 'Aprobado', defects: 2, samplesChecked: 100, notes: 'Dimensiones dentro del rango aceptable' },
                { id: 'QR-002', date: '2024-01-02', product: 'Widget B', batch: '2024-002', inspector: 'Ana Martínez', status: 'Rechazado', defects: 15, samplesChecked: 50, notes: 'Problemas de soldadura en 30% de las muestras' },
                { id: 'QR-003', date: '2024-01-01', product: 'Widget C', batch: '2023-045', inspector: 'Roberto Gómez', status: 'Aprobado', defects: 0, samplesChecked: 75, notes: 'Excelente calidad, sin defectos detectados' }
            ],
            maintenanceRecords: [
                { id: 'MNT-001', equipment: 'Línea A - Ensamblaje', date: '2024-01-01', technician: 'Ana Martínez', type: 'Preventivo', status: 'Completado', duration: 4, notes: 'Cambio de filtros y lubricación general' },
                { id: 'MNT-002', equipment: 'Línea C - Pintura', date: '2024-01-03', technician: 'Ana Martínez', type: 'Correctivo', status: 'En Progreso', duration: 8, notes: 'Reparación de sistema de pulverización' },
                { id: 'MNT-003', equipment: 'Soldadora MIG 200A', date: '2023-12-30', technician: 'Carlos Rodríguez', type: 'Preventivo', status: 'Completado', duration: 2, notes: 'Calibración y limpieza de electrodos' }
            ],
            notifications: [
                { id: 1, type: 'warning', title: 'Stock Bajo', message: 'Plástico ABS por debajo del stock mínimo', date: '2024-01-03 10:30', read: false },
                { id: 2, type: 'info', title: 'Mantenimiento Programado', message: 'Línea C estará en mantenimiento hasta las 16:00', date: '2024-01-03 08:00', read: false },
                { id: 3, type: 'success', title: 'Orden Completada', message: 'ORD-2024-003 completada exitosamente', date: '2024-01-02 15:45', read: true },
                { id: 4, type: 'error', title: 'Falla de Calidad', message: 'Lote 2024-002 rechazado por control de calidad', date: '2024-01-02 14:20', read: false }
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
        
        // Initialize collapsible sidebar after app is shown
        setTimeout(() => {
            this.initializeCollapsibleSidebar();
        }, 200);
        
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
            maintenance: 'Mantenimiento',
            reports: 'Reportes y Análisis',
            notifications: 'Centro de Notificaciones',
            // Producción
            'production-lines': 'Líneas de Producción',
            'production-planning': 'Planificación de Producción',
            'production-monitoring': 'Monitoreo en Tiempo Real',
            'work-orders': 'Órdenes de Trabajo',
            'lot-tracking': 'Seguimiento de Lotes',
            'oee-analysis': 'Análisis OEE',
            // Calidad
            'quality-control': 'Control de Calidad',
            'quality-inspections': 'Inspecciones',
            'quality-tests': 'Pruebas de Laboratorio',
            'quality-certifications': 'Certificaciones',
            'quality-audits': 'Auditorías',
            'quality-metrics': 'Métricas de Calidad',
            // Supply Chain
            'supply-chain': 'Supply Chain',
            'procurement': 'Compras y Adquisiciones',
            'supplier-management': 'Gestión de Proveedores',
            'logistics': 'Logística',
            'warehouse': 'Gestión de Almacén',
            'distribution': 'Distribución',
            'transportation': 'Transporte',
            // Ventas y Marketing
            'sales': 'Ventas',
            'customer-management': 'Gestión de Clientes',
            'sales-analytics': 'Análisis de Ventas',
            'marketing': 'Marketing',
            'market-research': 'Investigación de Mercado',
            'lead-management': 'Gestión de Leads',
            // Finanzas
            'finance': 'Finanzas',
            'accounting': 'Contabilidad',
            'budgeting': 'Presupuestos',
            'financial-reporting': 'Reportes Financieros',
            'cost-analysis': 'Análisis de Costos',
            'cash-flow': 'Flujo de Caja',
            'investments': 'Inversiones',
            // Recursos Humanos
            'human-resources': 'Recursos Humanos',
            'employee-management': 'Gestión de Empleados',
            'recruitment': 'Reclutamiento',
            'training': 'Capacitación',
            'performance': 'Evaluación de Desempeño',
            'payroll': 'Nómina',
            'benefits': 'Beneficios',
            // Tecnología
            'technology': 'Tecnología',
            'it-systems': 'Sistemas IT',
            'cybersecurity': 'Ciberseguridad',
            'data-management': 'Gestión de Datos',
            'automation': 'Automatización',
            'infrastructure': 'Infraestructura',
            // Innovación
            'innovation': 'Innovación',
            'rd': 'Investigación y Desarrollo',
            'product-development': 'Desarrollo de Productos',
            'patent-management': 'Gestión de Patentes',
            'technology-transfer': 'Transferencia Tecnológica',
            // Business Intelligence
            'business-intelligence': 'Business Intelligence',
            'executive-reports': 'Reportes Ejecutivos',
            'kpi-dashboard': 'Dashboard KPIs',
            'predictive-analytics': 'Análisis Predictivo',
            'data-visualization': 'Visualización de Datos',
            'market-intelligence': 'Inteligencia de Mercado',
            settings: 'Configuración del Sistema'
        };

        document.getElementById('page-title').textContent = titles[view] || 'ATL Production System';
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
            case 'suppliers':
                mainContent.innerHTML = this.getSuppliersContent();
                break;
            case 'quality':
                mainContent.innerHTML = this.getQualityContent();
                this.initializeQualityCharts();
                break;
            case 'certifications':
                mainContent.innerHTML = this.getCertificationsContent();
                break;
            case 'maintenance':
                mainContent.innerHTML = this.getMaintenanceContent();
                break;
            case 'assets':
                mainContent.innerHTML = this.getAssetsContent();
                break;
            case 'planning':
                mainContent.innerHTML = this.getPlanningContent();
                this.initializePlanningCharts();
                break;
            case 'analytics':
                mainContent.innerHTML = this.getAnalyticsContent();
                this.initializeAnalyticsCharts();
                break;
            case 'kpi':
                mainContent.innerHTML = this.getKPIContent();
                this.initializeKPICharts();
                break;
            case 'security':
                mainContent.innerHTML = this.getSecurityContent();
                break;
            case 'reports':
                mainContent.innerHTML = this.getReportsContent();
                break;
            case 'notifications':
                mainContent.innerHTML = this.getNotificationsContent();
                break;
            case 'settings':
                mainContent.innerHTML = this.getSettingsContent();
                break;
            // Nuevas secciones departamentales
            case 'production-lines':
                mainContent.innerHTML = this.getProductionLinesContent();
                break;
            case 'production-planning':
                mainContent.innerHTML = this.getProductionPlanningContent();
                break;
            case 'production-monitoring':
                mainContent.innerHTML = this.getProductionMonitoringContent();
                break;
            case 'work-orders':
                mainContent.innerHTML = this.getWorkOrdersContent();
                break;
            case 'lot-tracking':
                mainContent.innerHTML = this.getLotTrackingContent();
                break;
            case 'oee-analysis':
                mainContent.innerHTML = this.getOEEAnalysisContent();
                break;
            case 'quality-control':
                mainContent.innerHTML = this.getQualityControlContent();
                break;
            case 'quality-inspections':
                mainContent.innerHTML = this.getQualityInspectionsContent();
                break;
            case 'quality-tests':
                mainContent.innerHTML = this.getQualityTestsContent();
                break;
            case 'quality-certifications':
                mainContent.innerHTML = this.getQualityCertificationsContent();
                break;
            case 'quality-audits':
                mainContent.innerHTML = this.getQualityAuditsContent();
                break;
            case 'quality-metrics':
                mainContent.innerHTML = this.getQualityMetricsContent();
                break;
            case 'supply-chain':
                mainContent.innerHTML = this.getSupplyChainContent();
                break;
            case 'procurement':
                mainContent.innerHTML = this.getProcurementContent();
                break;
            case 'supplier-management':
                mainContent.innerHTML = this.getSupplierManagementContent();
                break;
            case 'logistics':
                mainContent.innerHTML = this.getLogisticsContent();
                break;
            case 'warehouse':
                mainContent.innerHTML = this.getWarehouseContent();
                break;
            case 'distribution':
                mainContent.innerHTML = this.getDistributionContent();
                break;
            case 'transportation':
                mainContent.innerHTML = this.getTransportationContent();
                break;
            case 'sales':
                mainContent.innerHTML = this.getSalesContent();
                break;
            case 'customer-management':
                mainContent.innerHTML = this.getCustomerManagementContent();
                break;
            case 'sales-analytics':
                mainContent.innerHTML = this.getSalesAnalyticsContent();
                break;
            case 'marketing':
                mainContent.innerHTML = this.getMarketingContent();
                break;
            case 'market-research':
                mainContent.innerHTML = this.getMarketResearchContent();
                break;
            case 'lead-management':
                mainContent.innerHTML = this.getLeadManagementContent();
                break;
            case 'finance':
                mainContent.innerHTML = this.getFinanceContent();
                break;
            case 'accounting':
                mainContent.innerHTML = this.getAccountingContent();
                break;
            case 'budgeting':
                mainContent.innerHTML = this.getBudgetingContent();
                break;
            case 'financial-reporting':
                mainContent.innerHTML = this.getFinancialReportingContent();
                break;
            case 'cost-analysis':
                mainContent.innerHTML = this.getCostAnalysisContent();
                break;
            case 'cash-flow':
                mainContent.innerHTML = this.getCashFlowContent();
                break;
            case 'investments':
                mainContent.innerHTML = this.getInvestmentsContent();
                break;
            case 'human-resources':
                mainContent.innerHTML = this.getHumanResourcesContent();
                break;
            case 'employee-management':
                mainContent.innerHTML = this.getEmployeeManagementContent();
                break;
            case 'recruitment':
                mainContent.innerHTML = this.getRecruitmentContent();
                break;
            case 'training':
                mainContent.innerHTML = this.getTrainingContent();
                break;
            case 'performance':
                mainContent.innerHTML = this.getPerformanceContent();
                break;
            case 'payroll':
                mainContent.innerHTML = this.getPayrollContent();
                break;
            case 'benefits':
                mainContent.innerHTML = this.getBenefitsContent();
                break;
            case 'technology':
                mainContent.innerHTML = this.getTechnologyContent();
                break;
            case 'it-systems':
                mainContent.innerHTML = this.getITSystemsContent();
                break;
            case 'cybersecurity':
                mainContent.innerHTML = this.getCybersecurityContent();
                break;
            case 'data-management':
                mainContent.innerHTML = this.getDataManagementContent();
                break;
            case 'automation':
                mainContent.innerHTML = this.getAutomationContent();
                break;
            case 'infrastructure':
                mainContent.innerHTML = this.getInfrastructureContent();
                break;
            case 'innovation':
                mainContent.innerHTML = this.getInnovationContent();
                break;
            case 'rd':
                mainContent.innerHTML = this.getRDContent();
                break;
            case 'product-development':
                mainContent.innerHTML = this.getProductDevelopmentContent();
                break;
            case 'patent-management':
                mainContent.innerHTML = this.getPatentManagementContent();
                break;
            case 'technology-transfer':
                mainContent.innerHTML = this.getTechnologyTransferContent();
                break;
            case 'business-intelligence':
                mainContent.innerHTML = this.getBusinessIntelligenceContent();
                break;
            case 'executive-reports':
                mainContent.innerHTML = this.getExecutiveReportsContent();
                break;
            case 'kpi-dashboard':
                mainContent.innerHTML = this.getKPIDashboardContent();
                break;
            case 'predictive-analytics':
                mainContent.innerHTML = this.getPredictiveAnalyticsContent();
                break;
            case 'data-visualization':
                mainContent.innerHTML = this.getDataVisualizationContent();
                break;
            case 'market-intelligence':
                mainContent.innerHTML = this.getMarketIntelligenceContent();
                break;
            default:
                mainContent.innerHTML = this.getGenericDepartmentContent(view);
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
        const staff = this.mockData.users;
        
        return `
            <div class="space-y-6">
                <!-- Header with Actions -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Gestión de Personal</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.openAddEmployeeModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Agregar Empleado
                        </button>
                        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            </svg>
                            Exportar Lista
                        </button>
                    </div>
                </div>

                <!-- Staff Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${staff.length}</h3>
                                <p class="text-sm text-gray-600">Total Empleados</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${staff.filter(s => s.shift === 'Mañana').length}</h3>
                                <p class="text-sm text-gray-600">Turno Mañana</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-yellow-100 rounded-lg">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${staff.filter(s => s.shift === 'Tarde').length}</h3>
                                <p class="text-sm text-gray-600">Turno Tarde</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${staff.filter(s => s.shift === 'Noche').length}</h3>
                                <p class="text-sm text-gray-600">Turno Noche</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Staff Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Lista de Personal</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${staff.map(employee => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span class="text-sm font-medium text-gray-700">${employee.name.split(' ').map(n => n[0]).join('')}</span>
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">${employee.name}</div>
                                                    <div class="text-sm text-gray-500">ID: ${employee.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                ${employee.role}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.department}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.shift === 'Mañana' ? 'bg-green-100 text-green-800' : employee.shift === 'Tarde' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}">
                                                ${employee.shift}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>${employee.email}</div>
                                            <div class="text-gray-500">${employee.phone}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Activo
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.viewEmployeeDetails('${employee.id}')" class="text-blue-600 hover:text-blue-900 mr-2">Ver</button>
                                            <button onclick="app.editEmployee('${employee.id}')" class="text-green-600 hover:text-green-900 mr-2">Editar</button>
                                            <button onclick="app.deleteEmployee('${employee.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getInventoryContent() {
        const inventory = this.mockData.inventory;
        const lowStockItems = inventory.filter(item => item.stock <= item.minStock);
        
        return `
            <div class="space-y-6">
                <!-- Header with Actions -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Control de Inventario</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.openAddItemModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Agregar Item
                        </button>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Generar Reporte
                        </button>
                    </div>
                </div>

                <!-- Inventory Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${inventory.length}</h3>
                                <p class="text-sm text-gray-600">Total Items</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-red-100 rounded-lg">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${lowStockItems.length}</h3>
                                <p class="text-sm text-gray-600">Stock Bajo</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${inventory.filter(i => i.status === 'Disponible').length}</h3>
                                <p class="text-sm text-gray-600">Disponibles</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-yellow-100 rounded-lg">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">$${inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0).toLocaleString()}</h3>
                                <p class="text-sm text-gray-600">Valor Total</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Low Stock Alert -->
                ${lowStockItems.length > 0 ? `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Atención: Items con Stock Bajo</h3>
                            <div class="mt-2 text-sm text-red-700">
                                <ul class="list-disc pl-5 space-y-1">
                                    ${lowStockItems.map(item => `<li>${item.name} - Stock actual: ${item.stock} ${item.unit}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Inventory Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Inventario General</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Unit.</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${inventory.map(item => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">${item.name}</div>
                                            <div class="text-sm text-gray-500">${item.id}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.category === 'Material Prima' ? 'bg-blue-100 text-blue-800' : item.category === 'Componentes' ? 'bg-green-100 text-green-800' : item.category === 'Herramientas' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                                                ${item.category}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">${item.stock} ${item.unit}</div>
                                            <div class="text-xs text-gray-500">Min: ${item.minStock} | Max: ${item.maxStock}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.location}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.supplier}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${item.cost}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                ${item.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.editInventoryItem('${item.id}')" class="text-blue-600 hover:text-blue-900 mr-2">Editar</button>
                                            <button onclick="app.adjustStock('${item.id}')" class="text-green-600 hover:text-green-900 mr-2">Ajustar</button>
                                            <button onclick="app.viewItemHistory('${item.id}')" class="text-purple-600 hover:text-purple-900">Historial</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getQualityContent() {
        const qualityReports = this.mockData.qualityReports;
        const approvedReports = qualityReports.filter(r => r.status === 'Aprobado');
        const rejectedReports = qualityReports.filter(r => r.status === 'Rechazado');
        
        return `
            <div class="space-y-6">
                <!-- Header with Actions -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Control de Calidad</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.openNewQualityCheck()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Nueva Inspección
                        </button>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            Reporte Calidad
                        </button>
                    </div>
                </div>

                <!-- Quality Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${approvedReports.length}</h3>
                                <p class="text-sm text-gray-600">Aprobados</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-red-100 rounded-lg">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${rejectedReports.length}</h3>
                                <p class="text-sm text-gray-600">Rechazados</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${Math.round((approvedReports.length / qualityReports.length) * 100)}%</h3>
                                <p class="text-sm text-gray-600">Tasa Aprobación</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${qualityReports.reduce((sum, r) => sum + r.samplesChecked, 0)}</h3>
                                <p class="text-sm text-gray-600">Muestras Totales</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quality Alerts -->
                ${rejectedReports.length > 0 ? `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Atención: Lotes Rechazados Recientes</h3>
                            <div class="mt-2 text-sm text-red-700">
                                <ul class="list-disc pl-5 space-y-1">
                                    ${rejectedReports.map(report => `<li>${report.product} (Lote: ${report.batch}) - ${report.notes}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Quality Reports Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Reportes de Calidad Recientes</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporte</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muestras</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defectos</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${qualityReports.map(report => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">${report.id}</div>
                                            <div class="text-sm text-gray-500">${report.date}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${report.product}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${report.batch}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${report.inspector}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${report.samplesChecked}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.defects === 0 ? 'bg-green-100 text-green-800' : report.defects < 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                                                ${report.defects}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                ${report.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.viewQualityReport('${report.id}')" class="text-blue-600 hover:text-blue-900 mr-2">Ver</button>
                                            <button onclick="app.exportQualityReport('${report.id}')" class="text-green-600 hover:text-green-900 mr-2">Exportar</button>
                                            <button onclick="app.editQualityReport('${report.id}')" class="text-purple-600 hover:text-purple-900">Editar</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Quality Check Form -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Nueva Inspección de Calidad</h3>
                    <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                            <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Widget A</option>
                                <option>Widget B</option>
                                <option>Widget C</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Número de Lote</label>
                            <input type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2024-004">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Muestras a Revisar</label>
                            <input type="number" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="50">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Inspector</label>
                            <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Roberto Gómez</option>
                                <option>Ana Martínez</option>
                                <option>Carlos Rodríguez</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                            <textarea class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Notas adicionales sobre la inspección..."></textarea>
                        </div>
                        <div class="md:col-span-2">
                            <button type="button" onclick="app.startQualityInspection()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                Iniciar Inspección
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    getReportsContent() {
        const orders = this.mockData.orders;
        const productionLines = this.mockData.productionLines;
        const qualityReports = this.mockData.qualityReports;
        
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Reportes y Análisis</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.generateCustomReport()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            Generar Reporte
                        </button>
                        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Exportar Datos
                        </button>
                    </div>
                </div>

                <!-- Report Categories -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="app.showProductionReport()">
                        <div class="flex items-center">
                            <div class="p-3 bg-blue-100 rounded-lg">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">Reporte de Producción</h3>
                                <p class="text-sm text-gray-600">Análisis de eficiencia y rendimiento</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="app.showQualityReport()">
                        <div class="flex items-center">
                            <div class="p-3 bg-green-100 rounded-lg">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">Reporte de Calidad</h3>
                                <p class="text-sm text-gray-600">Métricas de control de calidad</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onclick="app.showInventoryReport()">
                        <div class="flex items-center">
                            <div class="p-3 bg-purple-100 rounded-lg">
                                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">Reporte de Inventario</h3>
                                <p class="text-sm text-gray-600">Estado de materiales y stock</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen Ejecutivo</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${orders.length}</div>
                            <div class="text-sm text-gray-600">Órdenes Totales</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">${orders.filter(o => o.status === 'Completada').length}</div>
                            <div class="text-sm text-gray-600">Órdenes Completadas</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">${productionLines.filter(l => l.status === 'Activa').length}</div>
                            <div class="text-sm text-gray-600">Líneas Activas</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${Math.round(productionLines.reduce((sum, l) => sum + l.efficiency, 0) / productionLines.length)}%</div>
                            <div class="text-sm text-gray-600">Eficiencia Promedio</div>
                        </div>
                    </div>
                </div>

                <!-- Chart Placeholder -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Tendencias de Producción</h3>
                    <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <canvas id="reportsChart" width="400" height="200"></canvas>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                    <div class="space-y-3">
                        <div class="flex items-center p-3 bg-green-50 rounded">
                            <div class="p-1 bg-green-100 rounded-full">
                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-gray-800">Orden ORD-2024-003 completada exitosamente</p>
                                <p class="text-xs text-gray-500">Hace 2 horas</p>
                            </div>
                        </div>
                        <div class="flex items-center p-3 bg-blue-50 rounded">
                            <div class="p-1 bg-blue-100 rounded-full">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-gray-800">Mantenimiento programado para Línea C</p>
                                <p class="text-xs text-gray-500">Hace 4 horas</p>
                            </div>
                        </div>
                        <div class="flex items-center p-3 bg-yellow-50 rounded">
                            <div class="p-1 bg-yellow-100 rounded-full">
                                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-gray-800">Stock bajo detectado en Plástico ABS</p>
                                <p class="text-xs text-gray-500">Hace 6 horas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
                    <button onclick="app.saveSettings()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Guardar Cambios
                    </button>
                </div>

                <!-- Settings Categories -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- User Settings -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            Configuración de Usuario
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                                <input type="text" value="${this.currentUser?.name || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value="${this.currentUser?.email || ''}" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Claro</option>
                                    <option>Oscuro</option>
                                    <option>Automático</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Español</option>
                                    <option>English</option>
                                    <option>Português</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- System Settings -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                            </svg>
                            Configuración del Sistema
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Frecuencia de Actualización</label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>30 segundos</option>
                                    <option>1 minuto</option>
                                    <option>5 minutos</option>
                                    <option>Manual</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="autoSave" class="mr-2" checked>
                                <label for="autoSave" class="text-sm text-gray-700">Guardado automático</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="notifications" class="mr-2" checked>
                                <label for="notifications" class="text-sm text-gray-700">Notificaciones push</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="soundAlerts" class="mr-2">
                                <label for="soundAlerts" class="text-sm text-gray-700">Alertas sonoras</label>
                            </div>
                        </div>
                    </div>

                    <!-- Production Settings -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Configuración de Producción
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Meta de Eficiencia (%)</label>
                                <input type="number" value="90" min="70" max="100" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Límite de Stock Mínimo</label>
                                <input type="number" value="100" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Turno de Trabajo (horas)</label>
                                <input type="number" value="8" min="6" max="12" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                    </div>

                    <!-- Security Settings -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            Configuración de Seguridad
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo de Sesión (minutos)</label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>30 minutos</option>
                                    <option>1 hora</option>
                                    <option>4 horas</option>
                                    <option>8 horas</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="twoFactor" class="mr-2">
                                <label for="twoFactor" class="text-sm text-gray-700">Autenticación de dos factores</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="auditLog" class="mr-2" checked>
                                <label for="auditLog" class="text-sm text-gray-700">Registro de auditoría</label>
                            </div>
                            <button onclick="app.changePassword()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>
                </div>

                <!-- System Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Información del Sistema</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-700">Versión:</span>
                            <span class="text-gray-600 ml-2">v2.1.0</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-700">Última Actualización:</span>
                            <span class="text-gray-600 ml-2">2024-01-03</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-700">Estado del Servidor:</span>
                            <span class="text-green-600 ml-2">● Conectado</span>
                        </div>
                    </div>
                </div>
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

    getMaintenanceContent() {
        const maintenanceRecords = this.mockData.maintenanceRecords;
        const pendingMaintenance = maintenanceRecords.filter(r => r.status === 'En Progreso').length;
        const completedMaintenance = maintenanceRecords.filter(r => r.status === 'Completado').length;
        
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Gestión de Mantenimiento</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.scheduleMaintenance()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Programar Mantenimiento
                        </button>
                    </div>
                </div>

                <!-- Maintenance Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-orange-100 rounded-lg">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${pendingMaintenance}</h3>
                                <p class="text-sm text-gray-600">En Progreso</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${completedMaintenance}</h3>
                                <p class="text-sm text-gray-600">Completados</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${maintenanceRecords.length}</h3>
                                <p class="text-sm text-gray-600">Total Registros</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${Math.round(maintenanceRecords.reduce((sum, r) => sum + r.duration, 0) / maintenanceRecords.length)}h</h3>
                                <p class="text-sm text-gray-600">Duración Promedio</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Maintenance Records Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Registros de Mantenimiento</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${maintenanceRecords.map(record => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${record.id}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.equipment}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.date}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.technician}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.type === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}">
                                                ${record.type}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                                ${record.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onclick="app.viewMaintenanceDetails('${record.id}')" class="text-blue-600 hover:text-blue-900 mr-2">Ver</button>
                                            <button onclick="app.editMaintenanceRecord('${record.id}')" class="text-green-600 hover:text-green-900">Editar</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    getNotificationsContent() {
        const notifications = this.mockData.notifications;
        const unreadCount = notifications.filter(n => !n.read).length;
        
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Centro de Notificaciones</h2>
                    <div class="flex space-x-2">
                        <button onclick="app.markAllAsRead()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                            Marcar Todo como Leído
                        </button>
                        <button onclick="app.clearAllNotifications()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                            Limpiar Todo
                        </button>
                    </div>
                </div>

                <!-- Notification Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-red-100 rounded-lg">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${unreadCount}</h3>
                                <p class="text-sm text-gray-600">Sin Leer</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${notifications.filter(n => n.type === 'info').length}</h3>
                                <p class="text-sm text-gray-600">Informativas</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-yellow-100 rounded-lg">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${notifications.filter(n => n.type === 'warning').length}</h3>
                                <p class="text-sm text-gray-600">Advertencias</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="p-2 bg-red-100 rounded-lg">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M3 21l1.65-3.8a9 9 0 1118.7 0L21 21H3z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-800">${notifications.filter(n => n.type === 'error').length}</h3>
                                <p class="text-sm text-gray-600">Errores</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notifications List -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Todas las Notificaciones</h3>
                    </div>
                    <div class="divide-y divide-gray-200">
                        ${notifications.map(notification => {
                            const typeColors = {
                                'info': { bg: 'bg-blue-50', icon: 'text-blue-600' },
                                'warning': { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
                                'error': { bg: 'bg-red-50', icon: 'text-red-600' },
                                'success': { bg: 'bg-green-50', icon: 'text-green-600' }
                            };
                            const colors = typeColors[notification.type] || typeColors['info'];
                            
                            return `
                                <div class="p-4 hover:bg-gray-50 ${!notification.read ? colors.bg : ''}">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">
                                            <div class="w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center">
                                                <div class="w-2 h-2 ${colors.icon.replace('text-', 'bg-')} rounded-full"></div>
                                            </div>
                                        </div>
                                        <div class="ml-3 flex-1">
                                            <div class="flex items-center">
                                                <h4 class="text-sm font-medium text-gray-900">${notification.title}</h4>
                                                ${!notification.read ? '<div class="ml-2 w-2 h-2 bg-red-500 rounded-full"></div>' : ''}
                                            </div>
                                            <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                                            <p class="text-xs text-gray-500 mt-2">${notification.date}</p>
                                        </div>
                                        <div class="ml-4 flex-shrink-0">
                                            <button onclick="app.markAsRead(${notification.id})" class="text-gray-400 hover:text-gray-600">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ==============================================
    // NUEVAS FUNCIONES AUXILIARES AGREGADAS
    // ==============================================

    // Funciones para Mantenimiento
    scheduleMaintenance() {
        alert('Programar mantenimiento (funcionalidad demo)');
    }

    viewMaintenanceDetails(recordId) {
        const record = this.mockData.maintenanceRecords.find(r => r.id === recordId);
        if (record) {
            alert(`Detalles del Mantenimiento:\n\nID: ${record.id}\nEquipo: ${record.equipment}\nFecha: ${record.date}\nTécnico: ${record.technician}\nTipo: ${record.type}\nDuración: ${record.duration}h\nEstado: ${record.status}\n\nNotas: ${record.notes}`);
        }
    }

    editMaintenanceRecord(recordId) {
        alert(`Editar registro de mantenimiento ${recordId} (funcionalidad demo)`);
    }

    // Funciones para Notificaciones
    markAllAsRead() {
        this.mockData.notifications.forEach(notification => {
            notification.read = true;
        });
        alert('Todas las notificaciones marcadas como leídas');
        if (this.currentView === 'notifications') {
            this.loadViewContent('notifications');
        }
    }

    clearAllNotifications() {
        if (confirm('¿Está seguro de que desea eliminar todas las notificaciones?')) {
            this.mockData.notifications = [];
            alert('Todas las notificaciones eliminadas');
            if (this.currentView === 'notifications') {
                this.loadViewContent('notifications');
            }
        }
    }

    markAsRead(notificationId) {
        const notification = this.mockData.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            if (this.currentView === 'notifications') {
                this.loadViewContent('notifications');
            }
        }
    }

    // Funciones para Personal
    openAddEmployeeModal() {
        alert('Modal para agregar empleado (funcionalidad demo)');
    }

    viewEmployeeDetails(employeeId) {
        const employee = this.mockData.users.find(u => u.id === employeeId);
        if (employee) {
            alert(`Detalles del empleado:\n\nNombre: ${employee.name}\nRol: ${employee.role}\nDepartamento: ${employee.department}\nTurno: ${employee.shift}\nEmail: ${employee.email}\nTeléfono: ${employee.phone}`);
        }
    }

    editEmployee(employeeId) {
        alert(`Editar empleado ${employeeId} (funcionalidad demo)`);
    }

    deleteEmployee(employeeId) {
        if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
            alert(`Empleado ${employeeId} eliminado (funcionalidad demo)`);
        }
    }

    // Funciones para Inventario
    openAddItemModal() {
        alert('Modal para agregar item al inventario (funcionalidad demo)');
    }

    editInventoryItem(itemId) {
        const item = this.mockData.inventory.find(i => i.id === itemId);
        if (item) {
            alert(`Editar item: ${item.name} (funcionalidad demo)`);
        }
    }

    adjustStock(itemId) {
        const item = this.mockData.inventory.find(i => i.id === itemId);
        if (item) {
            const newStock = prompt(`Stock actual de ${item.name}: ${item.stock} ${item.unit}\nIngrese nuevo stock:`, item.stock);
            if (newStock !== null && !isNaN(newStock)) {
                item.stock = parseInt(newStock);
                item.lastUpdated = new Date().toISOString().split('T')[0];
                alert(`Stock actualizado a ${newStock} ${item.unit}`);
                // Recargar la vista si está en inventario
                if (this.currentView === 'inventory') {
                    this.loadViewContent('inventory');
                }
            }
        }
    }

    viewItemHistory(itemId) {
        alert(`Historial del item ${itemId} (funcionalidad demo)`);
    }

    // Funciones para Control de Calidad
    openNewQualityCheck() {
        alert('Modal para nueva inspección de calidad (funcionalidad demo)');
    }

    viewQualityReport(reportId) {
        const report = this.mockData.qualityReports.find(r => r.id === reportId);
        if (report) {
            alert(`Reporte de Calidad ${reportId}:\n\nProducto: ${report.product}\nLote: ${report.batch}\nInspector: ${report.inspector}\nMuestras: ${report.samplesChecked}\nDefectos: ${report.defects}\nEstado: ${report.status}\n\nNotas: ${report.notes}`);
        }
    }

    exportQualityReport(reportId) {
        alert(`Exportar reporte ${reportId} (funcionalidad demo)`);
    }

    editQualityReport(reportId) {
        alert(`Editar reporte ${reportId} (funcionalidad demo)`);
    }

    startQualityInspection() {
        alert('Iniciando nueva inspección de calidad (funcionalidad demo)');
    }

    // Funciones para Reportes
    generateCustomReport() {
        alert('Generar reporte personalizado (funcionalidad demo)');
    }

    showProductionReport() {
        alert('Mostrar reporte de producción detallado (funcionalidad demo)');
    }

    showQualityReport() {
        alert('Mostrar reporte de calidad detallado (funcionalidad demo)');
    }

    showInventoryReport() {
        alert('Mostrar reporte de inventario detallado (funcionalidad demo)');
    }

    // Funciones para Settings
    saveSettings() {
        alert('Configuración guardada exitosamente (funcionalidad demo)');
    }

    changePassword() {
        const currentPassword = prompt('Ingrese su contraseña actual:');
        if (currentPassword) {
            const newPassword = prompt('Ingrese su nueva contraseña:');
            if (newPassword) {
                const confirmPassword = prompt('Confirme su nueva contraseña:');
                if (newPassword === confirmPassword) {
                    alert('Contraseña cambiada exitosamente');
                } else {
                    alert('Las contraseñas no coinciden');
                }
            }
        }
    }

    // Funciones para Órdenes mejoradas
    viewOrderDetails(orderId) {
        const order = this.mockData.orders.find(o => o.id === orderId);
        if (order) {
            let details = `Detalles de la Orden ${orderId}:\n\n`;
            details += `Producto: ${order.product}\n`;
            details += `Cliente: ${order.client}\n`;
            details += `Cantidad: ${order.quantity}\n`;
            details += `Completado: ${order.completed}\n`;
            details += `Estado: ${order.status}\n`;
            details += `Fecha de Entrega: ${order.dueDate}\n`;
            details += `Supervisor: ${order.supervisor}\n`;
            details += `Ubicación: ${order.location}\n`;
            alert(details);
        }
    }

    editOrder(orderId) {
        alert(`Editar orden ${orderId} (funcionalidad demo)`);
    }

    deleteOrder(orderId) {
        if (confirm('¿Está seguro de que desea eliminar esta orden?')) {
            const orderIndex = this.mockData.orders.findIndex(o => o.id === orderId);
            if (orderIndex > -1) {
                this.mockData.orders.splice(orderIndex, 1);
                alert(`Orden ${orderId} eliminada`);
                // Recargar la vista si está en órdenes
                if (this.currentView === 'orders') {
                    this.loadViewContent('orders');
                }
            }
        }
    }

    // Función para crear nueva orden
    createNewOrder() {
        const productName = prompt('Nombre del producto:');
        if (!productName) return;
        
        const quantity = prompt('Cantidad:');
        if (!quantity || isNaN(quantity)) return;
        
        const client = prompt('Cliente:');
        if (!client) return;
        
        const dueDate = prompt('Fecha de entrega (YYYY-MM-DD):');
        if (!dueDate) return;
        
        const newOrder = {
            id: `ORD-2024-${String(this.mockData.orders.length + 1).padStart(3, '0')}`,
            product: productName,
            quantity: parseInt(quantity),
            completed: 0,
            status: 'Pendiente',
            dueDate: dueDate,
            createdDate: new Date().toISOString().split('T')[0],
            startTime: new Date().toLocaleTimeString('es-ES', { hour12: true }),
            client: client,
            productCode: `PC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            lot: `2024-${String(this.mockData.orders.length + 1).padStart(3, '0')}`,
            supervisor: this.currentUser.name,
            location: 'Almacén Central',
            deliveryMethod: 'Por definir',
            specifications: ['Por definir'],
            productionHistory: [
                {
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('es-ES', { hour12: true }),
                    event: 'Orden Creada',
                    responsible: this.currentUser.name,
                    status: 'Completado'
                }
            ]
        };
        
        this.mockData.orders.push(newOrder);
        alert(`Orden ${newOrder.id} creada exitosamente`);
        
        // Recargar la vista si está en órdenes
        if (this.currentView === 'orders') {
            this.loadViewContent('orders');
        }
    }

    // Función para mostrar notificaciones
    showNotifications() {
        const notifications = this.mockData.notifications;
        const unreadCount = notifications.filter(n => !n.read).length;
        
        let notificationHtml = `<div class="max-w-sm mx-auto bg-white rounded-lg shadow-lg">`;
        notificationHtml += `<div class="p-4 border-b"><h3 class="font-semibold">Notificaciones (${unreadCount} sin leer)</h3></div>`;
        notificationHtml += `<div class="max-h-64 overflow-y-auto">`;
        
        notifications.forEach(notification => {
            const typeColor = {
                'info': 'blue',
                'warning': 'yellow',
                'error': 'red',
                'success': 'green'
            }[notification.type] || 'gray';
            
            notificationHtml += `
                <div class="p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}">
                    <div class="flex items-start">
                        <div class="p-1 bg-${typeColor}-100 rounded-full mr-3 mt-1">
                            <div class="w-2 h-2 bg-${typeColor}-500 rounded-full"></div>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-sm font-medium text-gray-900">${notification.title}</h4>
                            <p class="text-xs text-gray-600 mt-1">${notification.message}</p>
                            <p class="text-xs text-gray-400 mt-1">${notification.date}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        notificationHtml += `</div></div>`;
        
        // En una implementación real, esto se mostraría en un modal
        alert('Panel de notificaciones (ver consola para detalles)');
        console.log('Notificaciones:', notifications);
    }

    // Función para exportar datos
    exportData() {
        const data = {
            orders: this.mockData.orders,
            productionLines: this.mockData.productionLines,
            inventory: this.mockData.inventory,
            qualityReports: this.mockData.qualityReports,
            users: this.mockData.users.map(user => ({...user, password: 'HIDDEN'})) // Ocultar contraseñas
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `atl-production-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Datos exportados exitosamente');
    }

    // Función para simular actualizaciones en tiempo real
    simulateRealTimeUpdates() {
        if (this.isLoggedIn) {
            // Actualizar eficiencia de líneas de producción aleatoriamente
            this.mockData.productionLines.forEach(line => {
                if (line.status === 'Activa') {
                    const variation = Math.floor(Math.random() * 10) - 5; // -5 a +5
                    line.efficiency = Math.max(70, Math.min(100, line.efficiency + variation));
                    line.currentProduction = Math.floor(line.capacity * (line.efficiency / 100));
                }
            });

            // Actualizar progreso de órdenes
            this.mockData.orders.forEach(order => {
                if (order.status === 'En Producción') {
                    const increment = Math.floor(Math.random() * 20) + 5; // 5 a 25
                    order.completed = Math.min(order.quantity, order.completed + increment);
                    if (order.completed >= order.quantity) {
                        order.status = 'Completada';
                    }
                }
            });

            // Recargar la vista actual si es necesario
            if (this.currentView === 'dashboard' || this.currentView === 'production' || this.currentView === 'orders') {
                this.loadViewContent(this.currentView);
            }

            console.log('Datos actualizados en tiempo real');
        }
    }

    // Función para generar reportes PDF (simulado)
    generatePDFReport(type, data) {
        // En una implementación real, esto generaría un PDF
        alert(`Generando reporte PDF de ${type}...\n\nDatos incluidos:\n${JSON.stringify(data, null, 2).substring(0, 200)}...`);
    }

    // Función para validar permisos de usuario
    hasPermission(action) {
        if (!this.currentUser) return false;
        
        const permissions = {
            'admin': ['view', 'create', 'edit', 'delete', 'manage_users', 'generate_reports'],
            'supervisor': ['view', 'create', 'edit', 'generate_reports'],
            'operator': ['view', 'create'],
            'quality': ['view', 'quality_control', 'generate_reports'],
            'maintenance': ['view', 'maintenance', 'schedule_maintenance']
        };
        
        const userPermissions = permissions[this.currentUser.role] || ['view'];
        return userPermissions.includes(action);
    }

    // Función para mostrar toast de notificación
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        } text-white`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Función para formatear números
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    // Función para formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    // Función para calcular KPIs
    calculateKPIs() {
        const totalProduction = this.mockData.productionLines.reduce((sum, line) => sum + line.currentProduction, 0);
        const averageEfficiency = this.mockData.productionLines.reduce((sum, line) => sum + line.efficiency, 0) / this.mockData.productionLines.length;
        const activeLines = this.mockData.productionLines.filter(line => line.status === 'Activa').length;
        const completedOrders = this.mockData.orders.filter(order => order.status === 'Completada').length;
        
        return {
            totalProduction,
            averageEfficiency: Math.round(averageEfficiency),
            activeLines,
            totalLines: this.mockData.productionLines.length,
            completedOrders,
            totalOrders: this.mockData.orders.length
        };
    }

    // Nueva función para proveedores
    getSuppliersContent() {
        return `
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Gestión de Proveedores</h2>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Proveedor
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-blue-100">Proveedores Activos</p>
                                <p class="text-3xl font-bold">${this.mockData.suppliers.filter(s => s.status === 'Activo').length}</p>
                            </div>
                            <i class="fas fa-truck text-3xl text-blue-200"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-green-100">Rating Promedio</p>
                                <p class="text-3xl font-bold">${(this.mockData.suppliers.reduce((sum, s) => sum + s.rating, 0) / this.mockData.suppliers.length).toFixed(1)}</p>
                            </div>
                            <i class="fas fa-star text-3xl text-green-200"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-purple-100">Confiabilidad</p>
                                <p class="text-3xl font-bold">${(this.mockData.suppliers.reduce((sum, s) => sum + s.deliveryReliability, 0) / this.mockData.suppliers.length).toFixed(1)}%</p>
                            </div>
                            <i class="fas fa-clock text-3xl text-purple-200"></i>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confiabilidad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Entrega</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${this.mockData.suppliers.map(supplier => `
                                <tr class="hover:bg-gray-50 transition-colors duration-200">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i class="fas fa-building text-blue-600"></i>
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">${supplier.name}</div>
                                                <div class="text-sm text-gray-500">${supplier.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            ${supplier.category}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">${supplier.contact}</div>
                                        <div class="text-sm text-gray-500">${supplier.email}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="text-sm font-medium text-gray-900">${supplier.rating}</div>
                                            <div class="ml-2 flex">
                                                ${Array.from({length: 5}, (_, i) => 
                                                    `<i class="fas fa-star text-${i < Math.floor(supplier.rating) ? 'yellow' : 'gray'}-400 text-xs"></i>`
                                                ).join('')}
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">${supplier.deliveryReliability}%</div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: ${supplier.deliveryReliability}%"></div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${supplier.nextDelivery}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="text-red-600 hover:text-red-900 transition-colors duration-200">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Función para simular notificaciones en tiempo real
    simulateNotifications() {
        // Simular nuevas notificaciones cada 45 segundos
        if (Math.random() < 0.3) { // 30% de probabilidad
            const notificationTypes = ['info', 'warning', 'success', 'error'];
            const messages = [
                'Nueva orden de producción recibida',
                'Mantenimiento preventivo completado en Línea C',
                'Stock de material prima bajo nivel mínimo',
                'Eficiencia de línea A superó objetivo del 95%',
                'Nuevo empleado registrado en el sistema',
                'Certificación ISO 9001 renovada exitosamente'
            ];
            
            const newNotification = {
                id: Date.now(),
                type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
                title: 'Notificación del Sistema',
                message: messages[Math.floor(Math.random() * messages.length)],
                date: new Date().toLocaleString(),
                read: false
            };
            
            this.mockData.notifications.unshift(newNotification);
            
            // Actualizar contador de notificaciones
            const notificationCount = document.getElementById('notification-count');
            if (notificationCount) {
                const unreadCount = this.mockData.notifications.filter(n => !n.read).length;
                notificationCount.textContent = unreadCount;
            }
            
            // Mostrar toast de nueva notificación
            this.showToast(newNotification.message, newNotification.type);
        }
    }

    // Inicializadores de gráficos para las nuevas secciones
    initializePlanningCharts() {
        // Implementar gráficos de planificación
    }

    initializeAnalyticsCharts() {
        // Implementar gráficos de análisis predictivo
    }

    initializeKPICharts() {
        // Implementar gráficos de KPIs ejecutivos
    }

    initializeQualityCharts() {
        // Implementar gráficos de calidad avanzados
    }

    initializeReportCharts() {
        // Implementar gráficos de reportes avanzados
    }

    // Función para hacer el sistema más vivo
    simulateRealTimeActivity() {
        // Actualizar datos de producción de forma más realista
        this.mockData.productionLines.forEach(line => {
            if (line.status === 'Activa') {
                // Simular variaciones en temperatura
                const tempVariation = (Math.random() - 0.5) * 2; // -1 a +1 grado
                line.temperature = Math.max(18, Math.min(35, line.temperature + tempVariation));
                
                // Simular variaciones en eficiencia
                const efficiencyVariation = (Math.random() - 0.5) * 4; // -2 a +2%
                line.efficiency = Math.max(70, Math.min(100, line.efficiency + efficiencyVariation));
                
                // Simular cambios en producción actual
                line.currentProduction = Math.floor(line.capacity * (line.efficiency / 100));
                
                // Simular variaciones en ruido y vibración
                if (Math.random() < 0.1) { // 10% probabilidad
                    line.noiseLevel += Math.floor((Math.random() - 0.5) * 10);
                    line.noiseLevel = Math.max(30, Math.min(100, line.noiseLevel));
                }
            }
        });

        // Simular progreso de órdenes
        this.mockData.orders.forEach(order => {
            if (order.status === 'En Producción' && Math.random() < 0.7) {
                const increment = Math.floor(Math.random() * 25) + 5; // 5 a 30 unidades
                order.completed = Math.min(order.quantity, order.completed + increment);
                
                if (order.completed >= order.quantity) {
                    order.status = 'Completada';
                    // Generar notificación de orden completada
                    this.mockData.notifications.unshift({
                        id: Date.now(),
                        type: 'success',
                        title: 'Orden Completada',
                        message: `Orden ${order.id} completada exitosamente`,
                        date: new Date().toLocaleString(),
                        read: false
                    });
                }
            }
        });

        // Simular cambios en inventario
        this.mockData.inventory.forEach(item => {
            if (Math.random() < 0.15) { // 15% probabilidad
                const change = Math.floor(Math.random() * 20) - 10; // -10 a +10
                item.stock = Math.max(0, item.stock + change);
                
                // Actualizar estado basado en stock
                if (item.stock <= item.minStock) {
                    item.status = 'Stock Bajo';
                    // Generar alerta de stock bajo
                    if (Math.random() < 0.3) {
                        this.mockData.notifications.unshift({
                            id: Date.now(),
                            type: 'warning',
                            title: 'Stock Bajo',
                            message: `${item.name} por debajo del stock mínimo`,
                            date: new Date().toLocaleString(),
                            read: false
                        });
                    }
                } else {
                    item.status = 'Disponible';
                }
            }
        });

        // Actualizar KPIs dinámicamente
        this.mockData.kpis.forEach(kpi => {
            const variation = (Math.random() - 0.5) * (kpi.value * 0.05); // ±2.5% variation
            kpi.value = Math.max(0, kpi.value + variation);
            kpi.lastUpdate = new Date().toLocaleString();
            
            // Actualizar tendencia
            if (variation > 0) {
                kpi.trend = 'up';
            } else if (variation < 0) {
                kpi.trend = 'down';
            } else {
                kpi.trend = 'stable';
            }
        });
    }

    // Mejorar la función de simulación de tiempo real existente
    simulateRealTimeUpdates() {
        if (this.isLoggedIn) {
            // Ejecutar simulación de actividad avanzada
            this.simulateRealTimeActivity();
            
            // Recargar la vista actual si es necesario
            if (['dashboard', 'production', 'orders', 'inventory', 'kpi'].includes(this.currentView)) {
                this.loadViewContent(this.currentView);
            }

            console.log('Sistema actualizado en tiempo real - Estado: VIVO');
        }
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

    // Función genérica para departamentos empresariales
    getGenericDepartmentContent(view) {
        const departmentNames = {
            'production-lines': 'Líneas de Producción',
            'production-planning': 'Planificación de Producción',
            'production-monitoring': 'Monitoreo en Tiempo Real',
            'work-orders': 'Órdenes de Trabajo',
            'lot-tracking': 'Seguimiento de Lotes',
            'oee-analysis': 'Análisis OEE',
            'quality-control': 'Control de Calidad',
            'quality-inspections': 'Inspecciones de Calidad',
            'quality-tests': 'Pruebas de Laboratorio',
            'quality-certifications': 'Certificaciones',
            'quality-audits': 'Auditorías de Calidad',
            'quality-metrics': 'Métricas de Calidad',
            'supply-chain': 'Supply Chain',
            'procurement': 'Compras y Adquisiciones',
            'supplier-management': 'Gestión de Proveedores',
            'logistics': 'Logística',
            'warehouse': 'Gestión de Almacén',
            'distribution': 'Distribución',
            'transportation': 'Transporte',
            'sales': 'Ventas',
            'customer-management': 'Gestión de Clientes',
            'sales-analytics': 'Análisis de Ventas',
            'marketing': 'Marketing',
            'market-research': 'Investigación de Mercado',
            'lead-management': 'Gestión de Leads',
            'finance': 'Finanzas',
            'accounting': 'Contabilidad',
            'budgeting': 'Presupuestos',
            'financial-reporting': 'Reportes Financieros',
            'cost-analysis': 'Análisis de Costos',
            'cash-flow': 'Flujo de Caja',
            'investments': 'Inversiones',
            'human-resources': 'Recursos Humanos',
            'employee-management': 'Gestión de Empleados',
            'recruitment': 'Reclutamiento',
            'training': 'Capacitación',
            'performance': 'Evaluación de Desempeño',
            'payroll': 'Nómina',
            'benefits': 'Beneficios',
            'technology': 'Tecnología',
            'it-systems': 'Sistemas IT',
            'cybersecurity': 'Ciberseguridad',
            'data-management': 'Gestión de Datos',
            'automation': 'Automatización',
            'infrastructure': 'Infraestructura',
            'innovation': 'Innovación',
            'rd': 'Investigación y Desarrollo',
            'product-development': 'Desarrollo de Productos',
            'patent-management': 'Gestión de Patentes',
            'technology-transfer': 'Transferencia Tecnológica',
            'business-intelligence': 'Business Intelligence',
            'executive-reports': 'Reportes Ejecutivos',
            'kpi-dashboard': 'Dashboard KPIs',
            'predictive-analytics': 'Análisis Predictivo',
            'data-visualization': 'Visualización de Datos',
            'market-intelligence': 'Inteligencia de Mercado'
        };

        const departmentName = departmentNames[view] || 'Departamento';
        const currentTime = new Date().toLocaleString('es-ES');

        return `
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">${departmentName}</h2>
                        <p class="text-gray-600">Sistema empresarial integrado</p>
                    </div>
                    <div class="text-right">
                        <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Sistema Activo
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${currentTime}</div>
                    </div>
                </div>

                <!-- Métricas principales -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-blue-600 text-sm font-medium">Procesos Activos</p>
                                <p class="text-2xl font-bold text-blue-900">${Math.floor(Math.random() * 50) + 10}</p>
                            </div>
                            <div class="bg-blue-200 p-3 rounded-lg">
                                <i class="fas fa-cogs text-blue-600"></i>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                            <span class="text-green-600 text-sm">+${(Math.random() * 10 + 2).toFixed(1)}%</span>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-green-600 text-sm font-medium">Eficiencia</p>
                                <p class="text-2xl font-bold text-green-900">${(Math.random() * 15 + 85).toFixed(1)}%</p>
                            </div>
                            <div class="bg-green-200 p-3 rounded-lg">
                                <i class="fas fa-chart-line text-green-600"></i>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                            <span class="text-green-600 text-sm">+${(Math.random() * 5 + 1).toFixed(1)}%</span>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-purple-600 text-sm font-medium">Tareas Completadas</p>
                                <p class="text-2xl font-bold text-purple-900">${Math.floor(Math.random() * 200) + 50}</p>
                            </div>
                            <div class="bg-purple-200 p-3 rounded-lg">
                                <i class="fas fa-tasks text-purple-600"></i>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                            <span class="text-green-600 text-sm">+${(Math.random() * 20 + 5).toFixed(0)}</span>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-orange-600 text-sm font-medium">Recursos Asignados</p>
                                <p class="text-2xl font-bold text-orange-900">${Math.floor(Math.random() * 30) + 5}</p>
                            </div>
                            <div class="bg-orange-200 p-3 rounded-lg">
                                <i class="fas fa-users text-orange-600"></i>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-minus text-gray-500 text-sm mr-1"></i>
                            <span class="text-gray-600 text-sm">Estable</span>
                        </div>
                    </div>
                </div>

                <!-- Actividad reciente -->
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-sm text-gray-700">Proceso automatizado completado exitosamente</span>
                            <span class="text-xs text-gray-500 ml-auto">hace 2 min</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span class="text-sm text-gray-700">Nueva tarea asignada al equipo de trabajo</span>
                            <span class="text-xs text-gray-500 ml-auto">hace 5 min</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span class="text-sm text-gray-700">Actualización del sistema empresarial aplicada</span>
                            <span class="text-xs text-gray-500 ml-auto">hace 15 min</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span class="text-sm text-gray-700">Revisión de métricas de rendimiento iniciada</span>
                            <span class="text-xs text-gray-500 ml-auto">hace 30 min</span>
                        </div>
                    </div>
                </div>

                <!-- Acciones rápidas -->
                <div class="flex flex-wrap gap-3">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                        <i class="fas fa-plus mr-2"></i>Nueva Tarea
                    </button>
                    <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                        <i class="fas fa-file-export mr-2"></i>Exportar Datos
                    </button>
                    <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                        <i class="fas fa-chart-bar mr-2"></i>Ver Analíticas
                    </button>
                    <button class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                        <i class="fas fa-cog mr-2"></i>Configurar
                    </button>
                </div>
            </div>
        `;
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
