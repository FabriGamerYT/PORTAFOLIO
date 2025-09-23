# ATL Technology - Sistema de Producción

## Descripción

Sistema de gestión de producción empresarial desarrollado para ATL Technology. Una aplicación web completa que permite monitorear y controlar procesos productivos en tiempo real.

## Características

### 🔐 Sistema de Autenticación
- Login seguro con ID de empleado y contraseña
- Gestión de roles (Supervisor, Operario)
- Interfaz de usuario personalizada según el rol

### 📊 Dashboard Interactivo
- Métricas en tiempo real de producción
- Gráficos de rendimiento con Chart.js
- Alertas y notificaciones importantes
- Estado de líneas de producción

### 🏭 Gestión de Producción
- Vista general de todas las líneas productivas
- Control de estado de máquinas (Activa/Inactiva/Mantenimiento)
- Monitoreo de eficiencia por línea
- Planificación de producción

### 📋 Órdenes de Producción
- Creación y gestión de órdenes
- Seguimiento de progreso en tiempo real
- Control de fechas de entrega
- Estados detallados de cada orden

### 📱 Escáner QR
- Gestión de lotes mediante códigos QR
- Control de operarios con identificación QR
- Interfaz intuitiva para escaneo
- Registro automático de actividades

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Frameworks**: Tailwind CSS
- **Gráficos**: Chart.js
- **Iconos**: Heroicons (SVG)
- **Tipografía**: Inter (Google Fonts)

## Instalación y Uso

### Requisitos
- Navegador web moderno
- Servidor web local (opcional para desarrollo)

### Instalación

1. Clona o descarga el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd atl-production-system
```

2. Abre `index.html` en tu navegador web
   - Puedes usar un servidor local como Live Server (VS Code)
   - O simplemente abrir el archivo directamente

### Credenciales de Demo

Para probar la aplicación, puedes usar las siguientes credenciales:

- **Supervisor**: 
  - ID: `admin`
  - Contraseña: `admin123`
  
- **Operario**: 
  - ID: `op001` 
  - Contraseña: `op123`

## Estructura del Proyecto

```
atl-production-system/
├── index.html          # Página principal
├── app.js             # Lógica de la aplicación
├── styles.css         # Estilos personalizados
└── README.md          # Este archivo
```

## Funcionalidades Principales

### 1. Autenticación
- Sistema de login con validación
- Manejo de sesiones con LocalStorage
- Roles diferenciados de usuario

### 2. Dashboard
- Estadísticas en tiempo real
- Gráficos interactivos
- Timeline de actividad reciente
- Panel de alertas

### 3. Gestión de Producción
- Control de líneas productivas
- Métricas de rendimiento
- Estados de máquinas
- Planificación de turnos

### 4. Órdenes
- CRUD completo de órdenes
- Seguimiento de progreso
- Gestión de prioridades
- Reportes de cumplimiento

### 5. Escáner QR
- Simulación de escáner QR
- Gestión de lotes
- Control de personal
- Registro de actividades

## Personalización

### Colores
Los colores principales se pueden modificar en `styles.css`:
- Azul primario: `#3b82f6`
- Verde éxito: `#10b981`
- Amarillo advertencia: `#f59e0b`
- Rojo error: `#ef4444`

### Datos
Los datos de demostración se encuentran en `app.js` en el método `initializeMockData()`. Puedes modificar:
- Usuarios y credenciales
- Líneas de producción
- Órdenes de ejemplo
- Estadísticas iniciales

## Compatibilidad

- ✅ Chrome (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)
- 📱 Responsive para dispositivos móviles

## Desarrollado por

**FabriGamerYT**
- GitHub: [FabriGamerYT](https://github.com/FabriGamerYT)
- Proyecto parte del portafolio personal

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de demostración.

---

*Proyecto desarrollado como demostración de capacidades en desarrollo web frontend*
