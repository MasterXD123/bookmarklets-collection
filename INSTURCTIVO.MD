# 🚀 Bookmarklet Loader via GitHub + jsDelivr

Guía rápida para convertir cualquier script `.js` alojado en GitHub en un **Bookmarklet (marcador inteligente)** funcional, sin límites de tamaño y sin errores de **CORS / CORB**.

---

## 🛠️ ¿Cómo funciona?

1. Subes tu script `.js` a GitHub.
2. Pasas la ruta por **jsDelivr** (para que el navegador lo interprete como JavaScript y no como texto plano).
3. Creas un marcador corto con un *loader* dinámico.

---

## 📐 La Estructura de la URL (jsDelivr)

Para que GitHub no bloquee la ejecución del código, reemplaza la URL normal por esta estructura:

`https://cdn.jsdelivr.net/gh/TU_USUARIO/TU_REPOSITORIO@RAMA/RUTA/AL/ARCHIVO.js`

> **Ejemplo:**
> `https://cdn.jsdelivr.net/gh/MasterXD123/bookmarklets-collection@main/Bm-snapmedia-2.js`

---

## 📦 Plantilla del Cargador (Loader)

Copia este código, cambia la URL por la tuya y pégalo directamente en la **URL / Dirección** de tu marcador:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='[https://cdn.jsdelivr.net/gh/TU_USUARIO/TU_REPOSITORIO@main/TU_ARCHIVO.js?v='+Date.now();document.head.appendChild(s](https://cdn.jsdelivr.net/gh/TU_USUARIO/TU_REPOSITORIO@main/TU_ARCHIVO.js?v='+Date.now();document.head.appendChild(s));})();
