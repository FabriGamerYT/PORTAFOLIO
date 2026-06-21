# Atajo Android PWA

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
