// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const employeeIdInput = document.getElementById('employee-id');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                `;
            } else {
                passwordInput.type = 'password';
                this.innerHTML = `
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                `;
            }
        });
    }

    // Tab switching functionality
    const tabLotes = document.getElementById('tab-lotes');
    const tabOperarios = document.getElementById('tab-operarios');
    const lotesScanner = document.getElementById('lotes-scanner');
    const operariosScanner = document.getElementById('operarios-scanner');

    if (tabLotes && tabOperarios && lotesScanner && operariosScanner) {
        tabLotes.addEventListener('click', function() {
            // Update tab styles
            tabLotes.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            tabLotes.classList.remove('text-gray-500', 'hover:text-gray-700');
            
            tabOperarios.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            tabOperarios.classList.add('text-gray-500', 'hover:text-gray-700');
            
            // Show/hide content
            lotesScanner.classList.remove('hidden');
            lotesScanner.classList.add('fade-in');
            operariosScanner.classList.add('hidden');
        });
        
        tabOperarios.addEventListener('click', function() {
            // Update tab styles
            tabOperarios.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            tabOperarios.classList.remove('text-gray-500', 'hover:text-gray-700');
            
            tabLotes.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            tabLotes.classList.add('text-gray-500', 'hover:text-gray-700');
            
            // Show/hide content
            operariosScanner.classList.remove('hidden');
            operariosScanner.classList.add('fade-in');
            lotesScanner.classList.add('hidden');
        });
    }

    // Scanner buttons functionality
    const startScannerLotes = document.getElementById('start-scanner-lotes');
    const startScannerOperarios = document.getElementById('start-scanner-operarios');
    const qrSuccessModal = document.getElementById('qr-success-modal');
    const qrResultContent = document.getElementById('qr-result-content');
    const qrContinueBtn = document.getElementById('qr-continue-btn');

    if (startScannerLotes) {
        startScannerLotes.addEventListener('click', function() {
            // Simulate scanning a QR code for lotes
            setTimeout(function() {
                const resultContent = `
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs font-medium text-gray-500">ID Lote:</p>
                                <p class="text-sm font-medium text-gray-900">LOT-2023-0543</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Producto:</p>
                                <p class="text-sm font-medium text-gray-900">Catéter Venoso Central</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Cantidad:</p>
                                <p class="text-sm font-medium text-gray-900">500 unidades</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Línea:</p>
                                <p class="text-sm font-medium text-gray-900">Línea A - Ensamblaje</p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <p class="text-xs font-medium text-gray-500">Estado:</p>
                            <div class="flex items-center mt-1">
                                <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">En Proceso</span>
                            </div>
                        </div>
                    </div>
                `;
                
                if (qrResultContent) qrResultContent.innerHTML = resultContent;
                if (qrSuccessModal) qrSuccessModal.classList.remove('hidden');
            }, 1500);
        });
    }
    
    if (startScannerOperarios) {
        startScannerOperarios.addEventListener('click', function() {
            // Simulate scanning a QR code for operarios
            setTimeout(function() {
                const resultContent = `
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs font-medium text-gray-500">ID Empleado:</p>
                                <p class="text-sm font-medium text-gray-900">EMP-2023-0127</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Nombre:</p>
                                <p class="text-sm font-medium text-gray-900">Juan Pérez</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Departamento:</p>
                                <p class="text-sm font-medium text-gray-900">Producción</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500">Turno:</p>
                                <p class="text-sm font-medium text-gray-900">Matutino</p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <p class="text-xs font-medium text-gray-500">Registro:</p>
                            <div class="flex items-center mt-1">
                                <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Entrada Registrada</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">Hora: 10:00 AM</p>
                        </div>
                    </div>
                `;
                
                if (qrResultContent) qrResultContent.innerHTML = resultContent;
                if (qrSuccessModal) qrSuccessModal.classList.remove('hidden');
            }, 1500);
        });
    }

    // QR Success Modal close functionality
    if (qrContinueBtn && qrSuccessModal) {
        qrContinueBtn.addEventListener('click', function() {
            qrSuccessModal.classList.add('hidden');
        });
    }

    // Login button functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const employeeId = employeeIdInput ? employeeIdInput.value : '';
            const password = passwordInput ? passwordInput.value : '';
            
            if (employeeId && password) {
                // Simple validation - in production, this would be server-side
                if (employeeId.length >= 3 && password.length >= 4) {
                    // Store login status in sessionStorage
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('employeeId', employeeId);
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert('ID de empleado debe tener al menos 3 caracteres y la contraseña al menos 4 caracteres.');
                }
            } else {
                alert('Por favor ingresa tu ID de empleado y contraseña.');
            }
        });
    }

    // Handle Enter key in form
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (loginBtn) loginBtn.click();
            }
        });
    }

    // Filter for operator records
    const tipoRegistro = document.getElementById('tipo-registro');
    if (tipoRegistro) {
        tipoRegistro.addEventListener('change', function() {
            console.log('Filtrar por: ' + this.value);
        });
    }
});
