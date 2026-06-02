# Geo Redirect for Echelon Fit

Este repositorio contiene el aporte para redirigir visitantes desde el sitio principal de Echelon Fit hacia su tienda localizada según país.

## Qué hace

- Detecta país vía `https://ipapi.co/json/`.
- Redirige a:
  - `www.echelonfit.de` (DE)
  - `www.echelonfit.fr` (FR)
  - `www.echelonfit.uk` (IE, GB)
  - `www.echelonfit.ca` (CA)
  - `www.echelonfit.com` (US)
- Evita redirecciones repetidas durante la misma sesión y host con `sessionStorage`.
- No corre en rutas de admin (`/admin`).

## Archivo principal

- `/geo-redirect.js`: script listo para insertar en el sitio/tema.

## Integración rápida (Shopify o sitio estático)

Inserta este script en el `<head>` o justo antes de cerrar `</body>`:

```html
<script src="https://TU-DOMINIO/geo-redirect.js"></script>
```

O copia el contenido del archivo directamente en un bloque `<script>`.

## Notas

- La redirección conserva `pathname` y `query string`.
- Si el visitante ya está en el host correcto, no redirige.
