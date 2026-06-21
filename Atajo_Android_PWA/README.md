# Atajo Android PWA v3

PWA instalable que sirve como panel de accesos rápidos para:

1. Intentar abrir **Opciones de desarrollador**.
2. Abrir la lista de **aplicaciones instaladas**.
3. Intentar abrir la ficha de una aplicación mediante su nombre de paquete.
4. Mostrar rutas manuales por fabricante cuando el navegador bloquee el acceso.
5. Guardar accesos personalizados localmente.
6. Funcionar sin conexión después de la primera carga.

## Importante

Una PWA no tiene permisos para activar Depuración USB, borrar datos, deshabilitar ni desinstalar aplicaciones por sí sola. Esas acciones siempre se realizan y confirman en Ajustes de Android.

Los enlaces `intent:` dependen del navegador, la versión de Android y el fabricante. Chrome solo abre actividades Android que acepten invocación desde el navegador. Por eso la aplicación incluye una ruta manual de respaldo.

## Cómo probar localmente

La instalación PWA requiere HTTPS o localhost.

Con Python:

```bash
cd Atajo_Android_PWA
python -m http.server 8080
```

En la misma computadora abre:

```text
http://localhost:8080
```

Para probar desde un teléfono, publica la carpeta en un servicio HTTPS como GitHub Pages, Netlify, Vercel o un servidor web propio.

## Cómo instalar en Android

1. Abre la dirección HTTPS en Chrome, Edge o Samsung Internet.
2. Pulsa el botón **Instalar** cuando aparezca.
3. Si no aparece, abre el menú del navegador.
4. Elige **Instalar aplicación** o **Añadir a pantalla de inicio**.

## Nombre de paquete

Para abrir la ficha de una aplicación específica necesitas el identificador Android, por ejemplo:

```text
com.whatsapp
com.android.chrome
com.empresa.aplicacion
```

El nombre de un archivo como `apk.apk` no permite conocer automáticamente ese identificador desde una PWA.

## Archivos

- `index.html`: interfaz.
- `styles.css`: diseño adaptable.
- `app.js`: accesos, guardado local, instalación y rutas de respaldo.
- `manifest.json`: configuración instalable.
- `service-worker.js`: funcionamiento sin conexión.
- `icons/`: iconos de la PWA.


## Cambios de la versión 2

- Ya no aparece una ventana bloqueante al abrir o recargar la aplicación.
- Los parámetros antiguos `?fallback=` se eliminan automáticamente.
- Un fallo solo se muestra cuando existe un intento reciente iniciado por el usuario.
- El aviso de fallo ahora aparece dentro de la página y se puede ignorar o cerrar.
- En Windows y otros sistemas no Android se abre la guía manual sin lanzar un modal.
- Caché PWA actualizado a `v2.0.0` para reemplazar la versión anterior.

## Actualizar una instalación anterior

Después de publicar esta versión:

1. Abre la PWA con conexión a Internet.
2. Recarga la página una vez.
3. Cierra completamente la aplicación.
4. Vuelve a abrirla.

Si Android continúa mostrando una copia antigua, elimina los datos del sitio desde el navegador o desinstala y vuelve a instalar la PWA.


## Apertura del enlace oficial

Esta versión está asociada expresamente con:

```text
https://fabrigameryt.github.io/PORTAFOLIO/Atajo_Android_PWA/
```

El manifiesto incluye:

```json
{
  "id": "https://fabrigameryt.github.io/PORTAFOLIO/Atajo_Android_PWA/",
  "start_url": "https://fabrigameryt.github.io/PORTAFOLIO/Atajo_Android_PWA/?source=installed",
  "scope": "https://fabrigameryt.github.io/PORTAFOLIO/Atajo_Android_PWA/",
  "handle_links": "preferred",
  "launch_handler": {
    "client_mode": ["navigate-existing", "auto"]
  }
}
```

Al instalarse o abrirse por primera vez en modo aplicación, la PWA muestra una
solicitud no bloqueante para aceptar la apertura de enlaces. La preferencia queda
guardada localmente.

### Limitación de Android

Una PWA puede solicitar al navegador que prefiera abrir los enlaces dentro de su
alcance, pero JavaScript no puede forzar el cuadro nativo de “Abrir enlaces
compatibles”. Android y el navegador conservan la decisión final.

### Actualización

La caché se actualizó a `atajo-android-v3.0.0`. Después de publicar los archivos:

1. Abre la URL oficial con conexión.
2. Recarga la página.
3. Cierra la PWA.
4. Vuelve a abrirla o reinstálala si continúa cargando una versión anterior.
