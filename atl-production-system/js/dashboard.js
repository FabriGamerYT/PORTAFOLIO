document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        sidebar: document.querySelector('.app-sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        logoutBtn: document.getElementById('logout-btn'),
        userName: document.getElementById('user-name'),
        sidebarUser: document.getElementById('sidebar-user'),
        sidebarRole: document.getElementById('sidebar-role'),
        sidebarShift: document.getElementById('sidebar-shift'),
        currentShift: document.getElementById('current-shift'),
        demoButtons: document.querySelectorAll('.demo-btn'),
        secondaryButtons: document.querySelectorAll('.secondary-btn'),
        rangeChips: document.querySelectorAll('[data-range]'),
        activityFilters: document.querySelectorAll('#activity-filters .chip'),
        acknowledgeAlerts: document.getElementById('acknowledge-alerts'),
        refreshOrders: document.getElementById('refresh-orders'),
        openMaintenance: document.getElementById('open-maintenance'),
        openAttendance: document.getElementById('open-attendance'),
        openBreaks: document.getElementById('open-breaks'),
        downloadReport: document.getElementById('download-report'),
        openCommands: document.getElementById('open-commands'),
        startStandup: document.getElementById('start-standup'),
        openKpis: document.getElementById('open-kpis'),
        viewReleaseNotes: document.getElementById('view-release-notes'),
        footerYear: document.getElementById('footer-year'),
        productionCanvas: document.getElementById('production-trend'),
        kpi: {
            efficiency: document.getElementById('kpi-efficiency'),
            efficiencyTrend: document.getElementById('kpi-efficiency-trend'),
            output: document.getElementById('kpi-output'),
            outputTrend: document.getElementById('kpi-output-trend'),
            orders: document.getElementById('kpi-orders'),
            ordersTrend: document.getElementById('kpi-orders-trend'),
            quality: document.getElementById('kpi-quality'),
            qualityTrend: document.getElementById('kpi-quality-trend')
        },
        shift: {
            meta: document.getElementById('shift-meta'),
            duration: document.getElementById('shift-duration'),
            progressBar: document.getElementById('shift-progress-bar'),
            oee: document.getElementById('quick-stat-oee'),
            scrap: document.getElementById('quick-stat-scrap'),
            downtime: document.getElementById('quick-stat-downtime')
        },
        activityFeed: document.getElementById('activity-feed'),
        alertsList: document.getElementById('alerts-list'),
        teamGrid: document.getElementById('team-grid'),
        ordersList: document.getElementById('orders-list'),
        ordersEmpty: document.getElementById('orders-empty'),
        maintenanceList: document.getElementById('maintenance-list'),
        toast: document.getElementById('toast')
    };

    const state = {
        range: 'shift',
        activityFilter: 'all',
        chart: null,
        alertsAcknowledged: false,
        seed: Math.random(),
        activityLogs: getInitialActivity(),
        alerts: getInitialAlerts(),
        orders: getInitialOrders(),
        maintenance: getInitialMaintenance(),
        team: getInitialTeam()
    };

    init();

    function init() {
        hydrateUser();
        hydrateFooter();
        bootstrapSidebar();
        renderKPIs();
        renderShiftSummary();
        renderActivity();
        renderAlerts();
        renderTeam();
        renderOrders();
        renderMaintenance();
        initChart();
        bindEvents();
        startAutoUpdates();
    }

    function hydrateUser() {
        const employeeId = sessionStorage.getItem('employeeId');
        const role = sessionStorage.getItem('atl_role') || 'Supervisor';
        const name = employeeId ? formatNameFromId(employeeId) : 'Supervisor';

        if (elements.userName) elements.userName.textContent = name;
        if (elements.sidebarUser) elements.sidebarUser.textContent = name;
        if (elements.sidebarRole) elements.sidebarRole.textContent = role;
        if (elements.sidebarShift) elements.sidebarShift.textContent = deriveShiftFromTime();
        if (elements.currentShift) elements.currentShift.textContent = deriveShiftFromTime();
    }

    function hydrateFooter() {
        if (elements.footerYear) {
            elements.footerYear.textContent = new Date().getFullYear();
        }
    }

    function bootstrapSidebar() {
        const sidebar = elements.sidebar;
        if (!sidebar || !elements.sidebarToggle) return;

        elements.sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', event => {
            if (!sidebar.classList.contains('open')) return;
            const isClickInside = sidebar.contains(event.target) || elements.sidebarToggle.contains(event.target);
            if (!isClickInside) sidebar.classList.remove('open');
        });
    }

    function bindEvents() {
        elements.rangeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                elements.rangeChips.forEach(c => c.classList.remove('chip--active'));
                chip.classList.add('chip--active');
                state.range = chip.dataset.range;
                renderKPIs();
                updateChart();
            });
        });

        elements.activityFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                elements.activityFilters.forEach(f => f.classList.remove('chip--active'));
                filter.classList.add('chip--active');
                state.activityFilter = filter.dataset.filter;
                renderActivity();
            });
        });

        [
            elements.openCommands,
            elements.startStandup,
            elements.openBreaks,
            elements.openMaintenance,
            elements.openAttendance,
            elements.openKpis
        ].forEach(btn => btn?.addEventListener('click', () => {
            const message = btn.dataset.toast || btn.textContent?.trim() || 'Acción ejecutada';
            showToast(`${message} (demo)`);
        }));

        elements.downloadReport?.addEventListener('click', () => {
            showToast('Generando reporte consolidado (demo)');
        });

        elements.refreshOrders?.addEventListener('click', () => {
            shuffleOrders();
            renderOrders();
            showToast('Pipeline actualizado en base a prioridades (demo)');
        });

        elements.acknowledgeAlerts?.addEventListener('click', () => {
            state.alertsAcknowledged = true;
            state.alerts = state.alerts.map(alert => ({ ...alert, acknowledged: true }));
            renderAlerts();
            showToast('Alertas marcadas como atendidas (demo)');
        });

        elements.viewReleaseNotes?.addEventListener('click', () => {
            showToast('Novedades: nueva interfaz, datos simulados y barra lateral responsiva.');
        });

        elements.logoutBtn?.addEventListener('click', handleLogout);
    }

    function handleLogout() {
        showToast('Cerrando sesión...');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('employeeId');
        sessionStorage.removeItem('atl_role');
        setTimeout(() => {
            window.location.href = './login.html';
        }, 1200);
    }

    function renderKPIs() {
        const data = getKpiData(state.range);
        if (!data) return;

        elements.kpi.efficiency.textContent = `${data.efficiency.value.toFixed(1)}%`;
        elements.kpi.efficiencyTrend.textContent = trendString(data.efficiency.trend);
        elements.kpi.output.textContent = data.output.value.toLocaleString('es-MX');
        elements.kpi.outputTrend.textContent = trendString(data.output.trend);
        elements.kpi.orders.textContent = data.orders.value.toString();
        elements.kpi.ordersTrend.textContent = trendString(data.orders.trend, true);
        elements.kpi.quality.textContent = `${data.quality.value.toFixed(1)}%`;
        elements.kpi.qualityTrend.textContent = trendString(data.quality.trend);

        colorizeTrend(elements.kpi.efficiencyTrend, data.efficiency.trend.value);
        colorizeTrend(elements.kpi.outputTrend, data.output.trend.value);
        colorizeTrend(elements.kpi.ordersTrend, -data.orders.trend.value); // fewer órdenes es positivo
        colorizeTrend(elements.kpi.qualityTrend, data.quality.trend.value);
    }

    function renderShiftSummary() {
        const summary = getShiftSummary();
        if (!summary) return;

        elements.shift.meta.textContent = summary.meta;
        elements.shift.duration.textContent = summary.duration;
        elements.shift.progressBar.style.width = `${summary.progress}%`;
        elements.shift.oee.textContent = `${summary.oee.toFixed(1)}%`;
        elements.shift.scrap.textContent = `${summary.scrap.toFixed(1)}%`;
        elements.shift.downtime.textContent = `${Math.round(summary.downtime)} min`;
    }

    function renderActivity() {
        if (!elements.activityFeed) return;
        const logs = state.activityLogs.filter(log => state.activityFilter === 'all' || log.type === state.activityFilter);

        elements.activityFeed.innerHTML = logs.map(createActivityItem).join('');
    }

    function renderAlerts() {
        if (!elements.alertsList) return;
        if (state.alerts.length === 0) {
            elements.alertsList.innerHTML = '<li class="empty-state">Sin alertas activas.</li>';
            return;
        }

        elements.alertsList.innerHTML = state.alerts.map(createAlertItem).join('');
    }

    function renderTeam() {
        if (!elements.teamGrid) return;
        elements.teamGrid.innerHTML = state.team.map(createTeamCard).join('');
    }

    function renderOrders() {
        if (!elements.ordersList || !elements.ordersEmpty) return;

        if (state.orders.length === 0) {
            elements.ordersList.innerHTML = '';
            elements.ordersEmpty.classList.remove('hidden');
            return;
        }

        elements.ordersEmpty.classList.add('hidden');
        elements.ordersList.innerHTML = state.orders.map(createOrderItem).join('');
    }

    function renderMaintenance() {
        if (!elements.maintenanceList) return;
        elements.maintenanceList.innerHTML = state.maintenance.map(createMaintenanceItem).join('');
    }

    function initChart() {
        if (!elements.productionCanvas) return;
        const dataset = getProductionDataset(state.range);
        if (!dataset) return;

        state.chart = new Chart(elements.productionCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: dataset.labels,
                datasets: [
                    {
                        label: 'Producción real',
                        data: dataset.actual,
                        borderColor: 'rgba(37, 99, 235, 1)',
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                        borderWidth: 2.5,
                        tension: 0.38,
                        pointRadius: 4,
                        pointBackgroundColor: '#1d4ed8'
                    },
                    {
                        label: 'Plan',
                        data: dataset.plan,
                        borderColor: 'rgba(148, 163, 184, 0.7)',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        tension: 0.25,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: value => `${value.toLocaleString('es-MX')} u.`
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toLocaleString('es-MX')} u.`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateChart() {
        if (!state.chart) {
            initChart();
            return;
        }

        const dataset = getProductionDataset(state.range);
        if (!dataset) return;

        state.chart.data.labels = dataset.labels;
        state.chart.data.datasets[0].data = dataset.actual;
        state.chart.data.datasets[1].data = dataset.plan;
        state.chart.update();
    }

    function startAutoUpdates() {
        setInterval(() => {
            mutateKPIs();
            mutateShiftSummary();
            mutateActivity();
            mutateAlerts();
            renderKPIs();
            renderShiftSummary();
            renderActivity();
            renderAlerts();
            updateChart();
        }, 15000);
    }

    function mutateKPIs() {
        const noise = () => (Math.random() - 0.5) * 3;
        const ordersNoise = () => Math.round((Math.random() - 0.45) * 2);

        ['shift', 'day', 'week'].forEach(range => {
            const data = getKpiData(range);
            if (!data) return;
            data.efficiency.value = +clamp(data.efficiency.value + noise(), 80, 96).toFixed(1);
            data.efficiency.trend.value = +(noise() * 1.5).toFixed(1);
            data.output.value = Math.max(120, data.output.value + Math.round(noise() * 25));
            data.output.trend.value = +(noise() * 3).toFixed(1);
            data.orders.value = Math.max(0, data.orders.value + ordersNoise());
            data.orders.trend.value = ordersNoise();
            data.quality.value = +clamp(data.quality.value + noise(), 94, 99).toFixed(1);
            data.quality.trend.value = +(noise()).toFixed(1);
        });
    }

    function mutateShiftSummary() {
        const summary = getShiftSummary();
        summary.progress = Math.min(98, summary.progress + Math.random() * 4);
        summary.oee = clamp(summary.oee + (Math.random() - 0.5) * 2, 84, 95);
        summary.scrap = clamp(summary.scrap + (Math.random() - 0.5) * 0.6, 1.8, 3.9);
        summary.downtime = clamp(summary.downtime + (Math.random() - 0.5) * 4, 8, 28);
        summary.oee = +summary.oee.toFixed(1);
        summary.scrap = +summary.scrap.toFixed(1);
        summary.downtime = Math.round(summary.downtime);
    }

    function mutateActivity() {
        if (Math.random() > 0.4) return;
        const newLog = generateRandomActivity();
        state.activityLogs = [newLog, ...state.activityLogs.slice(0, 7)];
    }

    function mutateAlerts() {
        if (state.alertsAcknowledged || Math.random() > 0.35) return;
        const newAlert = generateRandomAlert();
        state.alerts = [newAlert, ...state.alerts.slice(0, 4)];
    }

    function showToast(message) {
        if (!elements.toast) return;
        elements.toast.textContent = message;
        elements.toast.classList.remove('hidden');
        requestAnimationFrame(() => elements.toast.classList.add('show'));
        setTimeout(() => {
            elements.toast.classList.remove('show');
            setTimeout(() => elements.toast.classList.add('hidden'), 300);
        }, 3200);
    }

    function shuffleOrders() {
        state.orders = state.orders.sort(() => Math.random() - 0.5);
    }

    function getKpiData(range) {
        if (!state.kpis) {
            state.kpis = {
                shift: {
                    efficiency: { value: 89.2, trend: { value: 1.4, positive: true } },
                    output: { value: 1286, trend: { value: 4.3, positive: true } },
                    orders: { value: 6, trend: { value: -1, positive: true } },
                    quality: { value: 97.6, trend: { value: 0.6, positive: true } }
                },
                day: {
                    efficiency: { value: 90.1, trend: { value: 0.7, positive: true } },
                    output: { value: 3824, trend: { value: 2.1, positive: true } },
                    orders: { value: 14, trend: { value: -2, positive: true } },
                    quality: { value: 97.1, trend: { value: 0.3, positive: true } }
                },
                week: {
                    efficiency: { value: 88.8, trend: { value: 1.2, positive: true } },
                    output: { value: 18210, trend: { value: 5.6, positive: true } },
                    orders: { value: 42, trend: { value: 3, positive: false } },
                    quality: { value: 96.4, trend: { value: 0.9, positive: true } }
                }
            };
        }
        return state.kpis[range];
    }

    function getProductionDataset(range) {
        if (!state.production) {
            state.production = {
                shift: {
                    labels: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
                    actual: [120, 240, 410, 590, 760, 980, 1180],
                    plan: [110, 230, 360, 530, 690, 890, 1100]
                },
                day: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                    actual: [1820, 1940, 2050, 1990, 2110, 1870],
                    plan: [1800, 1900, 2000, 2000, 2050, 1800]
                },
                week: {
                    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                    actual: [8800, 9150, 9280, 9410],
                    plan: [8700, 9000, 9300, 9500]
                }
            };
        }
        return state.production[range];
    }

    function getShiftSummary() {
        if (!state.shiftSummary) {
            state.shiftSummary = {
                meta: 'Supervisión en línea A y C',
                duration: '4h 22m transcurridos',
                progress: 62,
                oee: 91.4,
                scrap: 2.7,
                downtime: 16
            };
        }
        return state.shiftSummary;
    }

    function getInitialActivity() {
        const now = new Date();
        const relative = minutesAgo => {
            const date = new Date(now.getTime() - minutesAgo * 60000);
            return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        };

        return [
            { type: 'orders', title: 'Orden 4821 liberada', description: 'Línea A alcanzó 100% del lote priorizado.', time: relative(12) },
            { type: 'quality', title: 'Verificación SPC completada', description: 'Línea C sin desviaciones en las últimas 3 lecturas.', time: relative(18) },
            { type: 'people', title: 'Cambio de cuadrilla', description: 'Operadores senior cubren turno por capacitación.', time: relative(26) },
            { type: 'orders', title: 'Nuevo lote asignado', description: 'Orden 4830 pasa a prioridad media.', time: relative(32) },
            { type: 'quality', title: 'QA detecta microfalla', description: 'Se escaló ticket preventivo a mantenimiento.', time: relative(41) },
            { type: 'people', title: 'Asistencia confirmada', description: 'Equipo de soporte de moldeo listo para relevo.', time: relative(58) }
        ];
    }

    function getInitialAlerts() {
        return [
            { type: 'critical', title: 'Mantenimiento preventivo urgente', detail: 'Robot ABB línea C requiere validación de torque.', assignee: 'Ing. López', time: 'Hace 14 min' },
            { type: 'warning', title: 'Stock bajo en resina PA6', detail: 'Almacén reporta 2.4h restantes al ritmo actual.', assignee: 'Logística', time: 'Hace 22 min' },
            { type: 'info', title: 'Auditoría 5S programada', detail: 'Recorrido rápido con excelencia operacional 13:00.', assignee: 'Coordinación Lean', time: 'Hoy 09:20' }
        ];
    }

    function getInitialOrders() {
        return [
            { id: '4821', product: 'Módulo ensamblado ventilación', status: 'Liberada', due: '12:30', priority: 'high', progress: 100 },
            { id: '4827', product: 'Carcasa ABS serie B', status: 'En empaque', due: '14:10', priority: 'medium', progress: 78 },
            { id: '4830', product: 'Kit sensores LIDAR', status: 'En proceso', due: '15:40', priority: 'high', progress: 52 },
            { id: '4834', product: 'Subconjunto cableado', status: 'Preparación', due: '18:00', priority: 'low', progress: 18 }
        ];
    }

    function getInitialMaintenance() {
        return [
            { title: 'Verificación de calibración en célula 4', assignee: 'Mecánico turno PM', date: 'Hoy 16:30', status: 'Programado' },
            { title: 'Lubricación transportadores línea B', assignee: 'Equipo Predictivo', date: 'Hoy 18:00', status: 'En curso' },
            { title: 'Inspección preventiva en prensa hidráulica', assignee: 'Especialista hidráulica', date: 'Mañana 07:15', status: 'Pendiente' }
        ];
    }

    function getInitialTeam() {
        return [
            { name: 'Ana Morales', role: 'Coordinadora de producción', status: 'En planta' },
            { name: 'Luis Pérez', role: 'Líder de línea A', status: 'Apoyo a línea C', variant: 'warning' },
            { name: 'María Gómez', role: 'Especialista calidad', status: 'En auditoría', variant: 'warning' },
            { name: 'Juan Herrera', role: 'Soporte mantenimiento', status: 'En ruta', variant: 'offline' },
            { name: 'Carla Ruiz', role: 'Planeadora', status: 'Sala de control' }
        ];
    }

    function createActivityItem(item) {
        return `
            <li class="timeline-item timeline-item--${item.type}">
                <h4>${item.title}</h4>
                <p>${item.time} · ${item.description}</p>
            </li>
        `;
    }

    function createAlertItem(alert) {
        const modifier = alert.type ? `alert-item--${alert.type}` : '';
        const acknowledged = alert.acknowledged ? '<span class="badge badge--blue">Atendida</span>' : '';
        return `
            <li class="alert-item ${modifier}">
                <div class="alert-item__header">
                    <h4 class="alert-item__title">${alert.title}</h4>
                    <span class="alert-item__meta">${alert.time}</span>
                </div>
                <p>${alert.detail}</p>
                <div class="alert-item__footer">
                    <span class="badge badge--amber">${alert.assignee}</span>
                    ${acknowledged}
                </div>
            </li>
        `;
    }

    function createTeamCard(member) {
        const statusClass = member.variant ? `team-card__status--${member.variant}` : '';
        return `
            <article class="team-card">
                <h4 class="team-card__name">${member.name}</h4>
                <p class="team-card__role">${member.role}</p>
                <span class="team-card__status ${statusClass}">${member.status}</span>
            </article>
        `;
    }

    function createOrderItem(order) {
        const priorityBadge = order.priority === 'high' ? 'badge--red' : order.priority === 'medium' ? 'badge--amber' : 'badge--blue';
        return `
            <li class="order-item">
                <div class="order-item__header">
                    <h4 class="order-item__title">Orden #${order.id}</h4>
                    <span class="badge ${priorityBadge}">${formatPriority(order.priority)}</span>
                </div>
                <p>${order.product}</p>
                <div class="order-item__meta">
                    <span>Entrega ${order.due}</span>
                    <span>${order.status}</span>
                    <span>Avance ${order.progress}%</span>
                </div>
            </li>
        `;
    }

    function createMaintenanceItem(item) {
        const statusClass = item.status === 'En curso' ? 'badge--amber' : item.status === 'Programado' ? 'badge--blue' : 'badge--green';
        return `
            <li class="maintenance-item">
                <div class="maintenance-item__header">
                    <h4 class="maintenance-item__title">${item.title}</h4>
                    <span class="badge ${statusClass}">${item.status}</span>
                </div>
                <div class="maintenance-item__meta">
                    <span>${item.assignee}</span>
                    <span>${item.date}</span>
                </div>
            </li>
        `;
    }

    function generateRandomActivity() {
        const templates = [
            { type: 'orders', title: 'Orden 4832 acelerada', description: 'Cambio de prioridad solicitado por logística.' },
            { type: 'quality', title: 'Inspección dimensional', description: 'Tolerancias dentro de parámetros en célula 2.' },
            { type: 'people', title: 'Capacitación rápida', description: 'Operadores nuevos reciben onboarding express.' },
            { type: 'orders', title: 'Reprogramación de lote', description: 'Orden 4819 se retrasa 45 minutos por ajuste.' },
            { type: 'quality', title: 'Muestreo extraordinario', description: 'QA selecciona piezas para laboratorio.' }
        ];
        const pick = templates[Math.floor(Math.random() * templates.length)];
        return {
            ...pick,
            time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        };
    }

    function generateRandomAlert() {
        const templates = [
            { type: 'warning', title: 'Vibración fuera de rango', detail: 'Se detectó pico de vibración en línea B.', assignee: 'Mantenimiento' },
            { type: 'critical', title: 'Paro por sensor', detail: 'Sensor de presencia marcó error intermitente.', assignee: 'Automatización' },
            { type: 'info', title: 'Nueva versión de instrucción', detail: 'Documento WI-482 actualizado disponible.', assignee: 'Documentación' }
        ];
        const pick = templates[Math.floor(Math.random() * templates.length)];
        return {
            ...pick,
            time: 'Hace 1 min',
            acknowledged: false
        };
    }

    function trendString(trend, invert = false) {
        const reference = state.range === 'shift' ? 'turno' : state.range === 'day' ? 'ayer' : 'semana anterior';
        const value = invert ? -trend.value : trend.value;
        const sign = value > 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}% vs ${reference}`;
    }

    function colorizeTrend(element, value) {
        if (!element) return;
        element.style.color = value >= 0 ? '#10b981' : '#ef4444';
    }

    function formatPriority(priority) {
        return priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja';
    }

    function formatNameFromId(id) {
        if (!id) return 'Supervisor';
        const suffix = id.split('-')[1] || '000';
        return `Supervisor ${suffix}`;
    }

    function deriveShiftFromTime() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 14) return 'Matutino';
        if (hour >= 14 && hour < 22) return 'Vespertino';
        return 'Nocturno';
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
});