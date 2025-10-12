document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        form: document.getElementById('login-form'),
        employeeId: document.getElementById('employee-id'),
        password: document.getElementById('password'),
        remember: document.getElementById('remember-me'),
        togglePassword: document.getElementById('toggle-password'),
        feedback: document.getElementById('form-feedback'),
        waitTime: document.getElementById('login-wait-time'),
        summaryUpdated: document.getElementById('summary-updated'),
        summaryMetrics: document.getElementById('summary-metrics'),
        lastLogin: document.getElementById('last-login'),
        refreshSummary: document.getElementById('refresh-summary'),
        activityTimeline: document.getElementById('activity-timeline'),
        activityFilters: document.getElementById('activity-filters'),
        tabLotes: document.getElementById('tab-lotes'),
        tabOperarios: document.getElementById('tab-operarios'),
        panelLotes: document.getElementById('lotes-scanner'),
        panelOperarios: document.getElementById('operarios-scanner'),
        startScannerLotes: document.getElementById('start-scanner-lotes'),
        startScannerOperarios: document.getElementById('start-scanner-operarios'),
        simulateLote: document.getElementById('simulate-lote'),
        loteSummary: document.getElementById('lote-summary'),
        operarioSummary: document.getElementById('operario-summary'),
        tipoRegistro: document.getElementById('tipo-registro'),
        scansToday: document.getElementById('scans-today'),
        scanAvgTime: document.getElementById('scan-avg-time'),
        verificationQueue: document.getElementById('verification-queue'),
        plantStatus: document.getElementById('plant-status'),
        shiftStatus: document.getElementById('shift-status'),
        metricShift: document.getElementById('metric-shift'),
        metricOnline: document.getElementById('metric-online'),
        metricLines: document.getElementById('metric-lines'),
        footerYear: document.getElementById('footer-year'),
        qrModal: document.getElementById('qr-success-modal'),
        qrContent: document.getElementById('qr-result-content'),
        qrContinue: document.getElementById('qr-continue-btn'),
        successModal: document.getElementById('login-success-modal'),
        continueBtn: document.getElementById('continue-btn'),
        skipToDashboard: document.getElementById('skip-to-dashboard'),
        tourTrigger: document.getElementById('tour-trigger'),
        clearQueue: document.getElementById('clear-queue'),
        viewHistory: document.getElementById('view-history'),
        cambioChangelog: document.getElementById('view-changelog')
    };

    const state = {
        activityFilter: 'all',
        activityLogs: generateInitialActivity(),
        summaryData: generateSummaryMetrics(),
        queue: [],
        rememberedUser: localStorage.getItem('atl_demo_user') || '',
        lastLogin: localStorage.getItem('atl_demo_lastLogin'),
        waitSeconds: 24,
        waitTimer: null,
        metricsTimer: null
    };

    init();

    function init() {
        hydrateForm();
        bindEvents();
        updateFooter();
        renderSummary();
        renderActivity();
        renderQueue();
        renderStatusLists();
        updateWaitTime();
        updateHeaderMetrics();
        updateScannerStats();
        state.metricsTimer = setInterval(() => {
            updateWaitTime();
            updateHeaderMetrics();
            updateScannerStats();
        }, 10000);
    }

    function hydrateForm() {
        if (state.rememberedUser && elements.employeeId) {
            elements.employeeId.value = state.rememberedUser;
            if (elements.remember) elements.remember.checked = true;
        }

        if (state.lastLogin && elements.lastLogin) {
            elements.lastLogin.textContent = formatRelativeTime(new Date(state.lastLogin));
        } else if (elements.lastLogin) {
            elements.lastLogin.textContent = 'Sin registros previos';
        }

        if (elements.footerYear) {
            elements.footerYear.textContent = new Date().getFullYear();
        }
    }

    function bindEvents() {
        if (elements.togglePassword && elements.password) {
            elements.togglePassword.addEventListener('click', togglePasswordVisibility);
        }

        if (elements.form) {
            elements.form.addEventListener('submit', handleLoginSubmit);
        }

        if (elements.refreshSummary) {
            elements.refreshSummary.addEventListener('click', () => {
                state.summaryData = generateSummaryMetrics();
                renderSummary();
                showFeedback('success', 'Resumen actualizado con datos de la última hora.');
            });
        }

        if (elements.activityFilters) {
            elements.activityFilters.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.activityFilter = btn.dataset.filter;
                    elements.activityFilters.querySelectorAll('button').forEach(b => b.classList.remove('chip--active'));
                    btn.classList.add('chip--active');
                    renderActivity();
                });
            });
        }

        if (elements.tabLotes && elements.tabOperarios) {
            elements.tabLotes.addEventListener('click', () => switchScannerTab('lotes'));
            elements.tabOperarios.addEventListener('click', () => switchScannerTab('operarios'));
        }

        if (elements.startScannerLotes) {
            elements.startScannerLotes.addEventListener('click', () => simulateScan('lote'));
        }

        if (elements.simulateLote) {
            elements.simulateLote.addEventListener('click', () => simulateScan('lote', true));
        }

        if (elements.startScannerOperarios) {
            elements.startScannerOperarios.addEventListener('click', () => simulateScan('operario'));
        }

        if (elements.qrContinue && elements.qrModal) {
            elements.qrContinue.addEventListener('click', () => elements.qrModal.classList.add('hidden'));
        }

        if (elements.continueBtn && elements.successModal) {
            elements.continueBtn.addEventListener('click', goToDashboard);
        }

        if (elements.skipToDashboard) {
            elements.skipToDashboard.addEventListener('click', () => {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('employeeId', 'SUP-1045');
                goToDashboard();
            });
        }

        if (elements.tourTrigger) {
            elements.tourTrigger.addEventListener('click', () => {
                showFeedback('info', 'Esta es una demo donde puedes interactuar con el login y el dashboard. Inicia sesión para continuar.');
            });
        }

        if (elements.clearQueue) {
            elements.clearQueue.addEventListener('click', () => {
                state.queue = [];
                renderQueue();
            });
        }

        if (elements.viewHistory) {
            elements.viewHistory.addEventListener('click', () => showFeedback('info', 'Puedes revisar el historial completo desde el dashboard en la sección de auditoría.'));
        }

        if (elements.cambioChangelog) {
            elements.cambioChangelog.addEventListener('click', () => showFeedback('info', 'Principales cambios: nueva interfaz, datos simulados y navegación mejorada.'));
        }
    }

    function handleLoginSubmit(event) {
        event.preventDefault();
        const employeeId = elements.employeeId?.value.trim();
        const password = elements.password?.value.trim();

        if (!employeeId || !password) {
            showFeedback('error', 'Completa tu ID y contraseña para continuar.');
            return;
        }

        if (employeeId.length < 3 || password.length < 4) {
            showFeedback('error', 'El ID debe tener al menos 3 caracteres y la contraseña 4.');
            return;
        }

        const role = employeeId.startsWith('SUP') ? 'Supervisor' : employeeId.startsWith('OP') ? 'Operario' : 'Colaborador';

        showFeedback('success', `Credenciales validadas. Perfil detectado: ${role}.`);
        disableForm(true);

        setTimeout(() => {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('employeeId', employeeId);
            sessionStorage.setItem('atl_role', role);

            if (elements.remember?.checked) {
                localStorage.setItem('atl_demo_user', employeeId);
            } else {
                localStorage.removeItem('atl_demo_user');
            }

            const timestamp = new Date().toISOString();
            localStorage.setItem('atl_demo_lastLogin', timestamp);
            if (elements.lastLogin) elements.lastLogin.textContent = formatRelativeTime(new Date(timestamp));

            if (elements.successModal) {
                elements.successModal.classList.remove('hidden');
            } else {
                goToDashboard();
            }
        }, 1200);
    }

    function disableForm(disabled) {
        if (!elements.form) return;
        Array.from(elements.form.querySelectorAll('input, button')).forEach(el => {
            el.disabled = disabled;
        });
    }

    function togglePasswordVisibility() {
        if (!elements.password) return;
        const isHidden = elements.password.type === 'password';
        elements.password.type = isHidden ? 'text' : 'password';
        elements.togglePassword.classList.toggle('toggle-password--visible', isHidden);
    }

    function showFeedback(type, message) {
        if (!elements.feedback) return;
        elements.feedback.textContent = message;
        elements.feedback.classList.remove('hidden', 'form-feedback--error', 'form-feedback--success');

        if (type === 'error') {
            elements.feedback.classList.add('form-feedback--error');
        } else if (type === 'success') {
            elements.feedback.classList.add('form-feedback--success');
        } else {
            elements.feedback.classList.remove('form-feedback--error', 'form-feedback--success');
        }
    }

    function renderSummary() {
        if (!elements.summaryMetrics) return;
        elements.summaryMetrics.innerHTML = state.summaryData.map(metric => `
            <div class="summary-card">
                <span class="summary-card__label">${metric.label}</span>
                <span class="summary-card__value">${metric.value}</span>
                <span class="summary-card__trend summary-card__trend--${metric.trend.type}">
                    ${metric.trend.prefix}${metric.trend.value}
                </span>
            </div>
        `).join('');

        if (elements.summaryUpdated) {
            elements.summaryUpdated.textContent = '2 minutos';
        }
    }

    function renderActivity() {
        if (!elements.activityTimeline) return;
        const logs = state.activityLogs.filter(log => state.activityFilter === 'all' || log.type === state.activityFilter);
        elements.activityTimeline.innerHTML = logs.map(log => `
            <article class="timeline-item">
                <span class="timeline-dot"></span>
                <div class="timeline-content">
                    <h4 class="timeline-content__title">${log.title}</h4>
                    <p class="timeline-content__meta">
                        ${log.time}
                        <span>${log.description}</span>
                    </p>
                </div>
            </article>
        `).join('');
    }

    function switchScannerTab(tab) {
        if (!elements.tabLotes || !elements.tabOperarios || !elements.panelLotes || !elements.panelOperarios) return;
        const isLotes = tab === 'lotes';
        elements.tabLotes.classList.toggle('scanner-tab--active', isLotes);
        elements.tabOperarios.classList.toggle('scanner-tab--active', !isLotes);
        elements.panelLotes.classList.toggle('hidden', !isLotes);
        elements.panelOperarios.classList.toggle('hidden', isLotes);
    }

    function simulateScan(type, silent = false) {
        const isLote = type === 'lote';
        const delay = silent ? 400 : 1200;

        disableScannerButtons(true);
        setTimeout(() => {
            const data = isLote ? generateLoteData() : generateOperarioData();
            if (isLote && elements.loteSummary) {
                elements.loteSummary.innerHTML = createDefinitionList(data.summary);
            }
            if (!isLote && elements.operarioSummary) {
                elements.operarioSummary.innerHTML = createDefinitionList(data.summary);
            }

            appendQueueItem(data.queueItem);
            updateActivityWithScan(data.activityLog);

            if (!silent && elements.qrModal && elements.qrContent) {
                elements.qrContent.innerHTML = data.modalContent;
                elements.qrModal.classList.remove('hidden');
            }

            disableScannerButtons(false);
        }, delay);
    }

    function disableScannerButtons(disabled) {
        [elements.startScannerLotes, elements.startScannerOperarios, elements.simulateLote].forEach(btn => {
            if (btn) btn.disabled = disabled;
        });
    }

    function appendQueueItem(item) {
        state.queue.unshift(item);
        if (state.queue.length > 5) state.queue.pop();
        renderQueue();
    }

    function renderQueue() {
        if (!elements.verificationQueue) return;
        if (state.queue.length === 0) {
            elements.verificationQueue.innerHTML = '<li class="queue-item"><div class="queue-item__info"><span class="queue-item__title">Sin verificaciones pendientes</span><span class="queue-item__meta">Los registros aparecerán aquí después de escanear.</span></div></li>';
            return;
        }

        elements.verificationQueue.innerHTML = state.queue.map(item => `
            <li class="queue-item">
                <div class="queue-item__info">
                    <span class="queue-item__title">${item.title}</span>
                    <span class="queue-item__meta">${item.meta}</span>
                </div>
                <span class="queue-item__status">${item.status}</span>
            </li>
        `).join('');
    }

    function updateActivityWithScan(log) {
        state.activityLogs.unshift(log);
        if (state.activityLogs.length > 8) state.activityLogs.pop();
        renderActivity();
    }

    function renderStatusLists() {
        if (elements.plantStatus) {
            const statuses = [
                { label: 'Linea A - Ensamblaje', meta: 'Operativa • 92% eficiencia', level: 'success' },
                { label: 'Linea C - Esterilizado', meta: 'Alerta • Cambio de moldes', level: 'warning' },
                { label: 'Linea D - Empaque', meta: 'En mantenimiento programado', level: 'danger' }
            ];
            elements.plantStatus.innerHTML = statuses.map(s => `
                <li class="status-item">
                    <span class="status-indicator status-indicator--${s.level}"></span>
                    <div class="status-details">
                        <span class="status-details__title">${s.label}</span>
                        <span class="status-details__meta">${s.meta}</span>
                    </div>
                </li>
            `).join('');
        }

        if (elements.shiftStatus) {
            const shifts = [
                { label: 'Turno matutino', meta: 'Inicio 06:00 • 87 operarios', level: 'success' },
                { label: 'Turno vespertino', meta: 'Inicio 14:00 • Preparación', level: 'warning' }
            ];
            elements.shiftStatus.innerHTML = shifts.map(s => `
                <li class="status-item">
                    <span class="status-indicator status-indicator--${s.level}"></span>
                    <div class="status-details">
                        <span class="status-details__title">${s.label}</span>
                        <span class="status-details__meta">${s.meta}</span>
                    </div>
                </li>
            `).join('');
        }
    }

    function updateWaitTime() {
        state.waitSeconds = Math.max(4, Math.floor(Math.random() * 24));
        if (elements.waitTime) {
            elements.waitTime.textContent = `Tiempo de espera: ${state.waitSeconds}s`;
        }
    }

    function updateHeaderMetrics() {
        const shifts = ['Turno matutino', 'Turno vespertino', 'Turno nocturno'];
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        const activeOperators = 80 + Math.floor(Math.random() * 18);
        const linesActive = 6 + Math.floor(Math.random() * 2);

        if (elements.metricShift) {
            elements.metricShift.querySelector('.header-metric__value').textContent = shift;
        }
        if (elements.metricOnline) {
            elements.metricOnline.querySelector('.header-metric__value').textContent = `${activeOperators} operarios`;
        }
        if (elements.metricLines) {
            elements.metricLines.querySelector('.header-metric__value').textContent = `${linesActive}/8 líneas`;
        }
    }

    function updateScannerStats() {
        if (elements.scansToday) {
            elements.scansToday.textContent = 320 + Math.floor(Math.random() * 44);
        }
        if (elements.scanAvgTime) {
            elements.scanAvgTime.textContent = `${(4 + Math.random() * 2).toFixed(1)}s`;
        }
    }

    function goToDashboard() {
        window.location.href = 'dashboard.html';
    }

    function updateFooter() {
        if (elements.footerYear) {
            elements.footerYear.textContent = new Date().getFullYear();
        }
    }

    function createDefinitionList(entries) {
        return entries.map(entry => `
            <div>
                <dt>${entry.label}</dt>
                <dd>${entry.value}</dd>
            </div>
        `).join('');
    }

    function generateSummaryMetrics() {
        return [
            {
                label: 'Órdenes activas',
                value: `${28 + Math.floor(Math.random() * 6)}`,
                trend: { type: 'up', prefix: '+', value: `${(2 + Math.random()).toFixed(1)}%` }
            },
            {
                label: 'Eficiencia global',
                value: `${(93 + Math.random() * 4).toFixed(1)}%`,
                trend: { type: 'down', prefix: '↘', value: `${(Math.random() * 0.8).toFixed(1)}%` }
            },
            {
                label: 'Piezas producidas',
                value: `${(2400 + Math.floor(Math.random() * 160)).toLocaleString('es-MX')}`,
                trend: { type: 'up', prefix: '+', value: `${(5 + Math.random() * 1.5).toFixed(1)}%` }
            }
        ];
    }

    function generateInitialActivity() {
        return [
            { type: 'lotes', title: 'Lote LOT-2098 validado', time: '08:42 • Línea A', description: '500 catéteres aprobados para empaque' },
            { type: 'operarios', title: 'Registro operario OP-2091', time: '08:38 • Control acceso', description: 'Inicio de turno matutino' },
            { type: 'lotes', title: 'Lote LOT-2105 asignado', time: '08:21 • Línea C', description: 'Cambio de molde completado' },
            { type: 'operarios', title: 'Operario OP-1988 en descanso', time: '08:05 • Comedor 1', description: 'Duración estimada 15 min' }
        ];
    }

    function generateLoteData() {
        const loteId = `LOT-${2100 + Math.floor(Math.random() * 40)}`;
        const lines = ['Línea A - Ensamblaje', 'Línea B - Montaje', 'Línea D - Empaque'];
        const products = ['Catéter venoso central', 'Kit de intubación', 'Equipo de suero'];
        const status = ['En producción', 'Listo para control', 'Requiere inspección'];

        const summary = [
            { label: 'ID Lote', value: loteId },
            { label: 'Producto', value: products[Math.floor(Math.random() * products.length)] },
            { label: 'Cantidad', value: `${400 + Math.floor(Math.random() * 200)} unidades` },
            { label: 'Línea', value: lines[Math.floor(Math.random() * lines.length)] },
            { label: 'Prioridad', value: Math.random() > 0.6 ? 'Alta' : 'Estándar' }
        ];

        return {
            summary,
            modalContent: `
                <dl class="scanner-info">
                    ${createDefinitionList(summary)}
                </dl>
                <p>Estado actual: <strong>${status[Math.floor(Math.random() * status.length)]}</strong></p>
            `,
            queueItem: {
                title: `${loteId} en revisión`,
                meta: `${summary[1].value} • ${summary[3].value}`,
                status: 'Pendiente QC'
            },
            activityLog: {
                type: 'lotes',
                title: `Lote ${loteId} escaneado`,
                time: `${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} • Línea`,
                description: `${summary[2].value} registradas`
            }
        };
    }

    function generateOperarioData() {
        const operators = [
            { id: 'OP-2091', name: 'María López', department: 'Producción', shift: 'Matutino' },
            { id: 'OP-2044', name: 'Luis García', department: 'Control calidad', shift: 'Nocturno' },
            { id: 'OP-1988', name: 'Ana Torres', department: 'Empaque', shift: 'Vespertino' }
        ];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const tipo = elements.tipoRegistro?.value || 'entrada';

        const actions = {
            entrada: 'Entrada registrada',
            salida: 'Salida registrada',
            descanso: 'Inicio de descanso',
            'fin-descanso': 'Fin de descanso'
        };

        const summary = [
            { label: 'ID Empleado', value: operator.id },
            { label: 'Nombre', value: operator.name },
            { label: 'Departamento', value: operator.department },
            { label: 'Turno', value: operator.shift },
            { label: 'Acción', value: actions[tipo] }
        ];

        return {
            summary,
            modalContent: `
                <dl class="scanner-info">
                    ${createDefinitionList(summary)}
                </dl>
                <p>Hora registrada: <strong>${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</strong></p>
            `,
            queueItem: {
                title: `${operator.name} (${operator.id})`,
                meta: `${actions[tipo]} • ${operator.department}`,
                status: 'Sin incidencias'
            },
            activityLog: {
                type: 'operarios',
                title: `${actions[tipo]}: ${operator.name}`,
                time: `${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} • Control acceso`,
                description: `${operator.department} • ${operator.shift}`
            }
        };
    }

    function formatRelativeTime(date) {
        const diff = Date.now() - date.getTime();
        const minutes = Math.round(diff / 60000);
        if (minutes < 1) return 'Hace unos segundos';
        if (minutes < 60) return `Hace ${minutes} min`;
        const hours = Math.round(minutes / 60);
        if (hours < 24) return `Hace ${hours} h`;
        const days = Math.round(hours / 24);
        return `Hace ${days} días`;
    }
});
