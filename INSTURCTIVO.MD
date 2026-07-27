<div align="center">

# 🚀 Bookmarklets Collection

*Una colección de scripts ligeros, útiles e inyectables para optimizar tu navegación.*

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/MasterXD123/bookmarklets-collection)
[![CDN Status](https://img.shields.io/badge/jsDelivr-Accelerated-ff5627?style=for-the-badge&logo=jsdelivr)](https://www.jsdelivr.net/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](#-licencia)

</div>

---

## 📌 ¿Qué es esto?

Esta colección contiene varios **Bookmarklets** (marcadores inteligentes) diseñados para ejecutarse en cualquier sitio web sin necesidad de instalar extensiones pesadas en tu navegador.

Usan el CDN de **jsDelivr** para cargar la última versión del código almacenado en este repositorio de forma ultra rápida, segura y **evitando bloqueos de CORS / CORB**.

---

## 🛠️ Cómo agregar un Bookmarklet a tu navegador

1. Muestra la **Barra de Marcadores** de tu navegador (`Ctrl + Shift + B` o `Cmd + Shift + B`).
2. Haz **clic derecho** en un espacio vacío de la barra y selecciona **Añadir página / Agregar marcador**.
3. Asigna el **Nombre** que prefieras.
4. En el campo **URL / Dirección**, pega la línea de código del bookmarklet correspondiente (las encuentras abajo).
5. ¡Listo! Solo haz clic sobre el marcador cuando estés en la página donde quieras usarlo.

---

## 📂 Marcadores Disponibles

### 🖼️ SnapMedia Gallery
Extrae y visualiza de forma elegante todas las imágenes, GIF y videos detectados en la página web actual en un visor tipo galería con controles de zoom, rotación y descarga.

```javascript
javascript:(function(){var s=document.createElement('script');s.src='[https://cdn.jsdelivr.net/gh/MasterXD123/bookmarklets-collection@main/Bm-snapmedia-2.js?v='+Date.now();document.head.appendChild(s](https://cdn.jsdelivr.net/gh/MasterXD123/bookmarklets-collection@main/Bm-snapmedia-2.js?v='+Date.now();document.head.appendChild(s));})();
