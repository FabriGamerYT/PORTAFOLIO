# Portafolio Personal - FabriGamerYT

¡Bienvenido a mi portafolio personal! Este sitio web está creado con HTML, CSS y JavaScript puro, y está alojado en GitHub Pages.

## 🌟 Características

- **Diseño responsive** - Se adapta perfectamente a dispositivos móviles y escritorio
- **Tema oscuro/claro** - Alternar entre modos con persistencia local
- **Carga automática de proyectos** - Integración con GitHub API para mostrar repositorios automáticamente
- **Filtrado de proyectos** - Organiza proyectos por categorías (Web, Aplicaciones, Juegos)
- **Animaciones suaves** - Transiciones y efectos visuales atractivos
- **Optimizado para SEO** - Estructura semántica y metadatos apropiados

## 🚀 Ver en vivo

Visita el portafolio en: [https://fabrigameryt.github.io](https://fabrigameryt.github.io)

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+
- GitHub API
- GitHub Pages

## 📁 Estructura del proyecto

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
└── README.md           # Documentación
```

## ⚙️ Personalización

### 1. Información personal
Edita las siguientes secciones en `index.html`:
- Título y descripción en la sección hero
- Información "Sobre mí"
- Skills y tecnologías
- Información de contacto

### 2. Configurar GitHub API
En `script.js`, modifica la variable `GITHUB_USERNAME`:
```javascript
const GITHUB_USERNAME = 'TuUsuarioDeGitHub';
```

### 3. Personalizar colores
En `styles.css`, modifica las variables CSS en `:root`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    /* ... más colores */
}
```

## 🎨 Categorización automática de proyectos

El sistema categoriza automáticamente tus repositorios basándose en:
- **Nombre del repositorio**
- **Descripción**
- **Topics/etiquetas de GitHub**
- **GitHub Pages habilitado**

### Categorías disponibles:
- **Web** - Sitios web, páginas, aplicaciones web
- **App** - Aplicaciones de escritorio, mobile, herramientas
- **Game** - Juegos y proyectos relacionados con gaming

## 📝 Agregar proyectos destacados

Para destacar proyectos específicos, modifica el array `featuredProjects` en `script.js`:
```javascript
const featuredProjects = [
    {
        name: 'nombre-del-repo',
        category: 'web'
    }
];
```

## 🔧 Desarrollo local

1. Clona este repositorio
2. Abre `index.html` en tu navegador
3. Para desarrollo con live reload, usa un servidor local como Live Server de VS Code

## 📱 Responsive Design

El portafolio está optimizado para:
- 📱 Móviles (320px+)
- 📟 Tablets (768px+)
- 💻 Escritorio (1024px+)
- 🖥️ Pantallas grandes (1200px+)

## 🎯 SEO y Performance

- Semantic HTML5
- Meta tags optimizados
- Lazy loading de imágenes
- CSS y JS minificados en producción
- Fontes web optimizadas

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el portafolio:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 🎉 Reconocimientos

- Iconos por [Font Awesome](https://fontawesome.com)
- Fuentes por [Google Fonts](https://fonts.google.com)
- API por [GitHub](https://docs.github.com/en/rest)

---

⭐ ¡No olvides darle una estrella al proyecto si te gustó!

**Hecho con ❤️ y GitHub Pages**
