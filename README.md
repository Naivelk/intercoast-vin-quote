# Intercoast – Cotizador por VIN (NHTSA) + Leads (Sheets / Apps Script)

**Demo:** https://intercoastformulario.netlify.app/

Formulario web para cotización de seguros de autos en California: decodifica el VIN con la API pública de la **NHTSA**, calcula un **estimado** (enfocado en cobertura económica / liability), soporta **hasta 5 vehículos** y muestra al cliente **solo el total combinado**. Registra leads en **Google Sheets** y envía correos automáticos mediante **Google Apps Script**. Incluye integración de chatbot en la landing para soporte y captura.

---

## ¿Qué hace este proyecto?
- Decodifica VIN usando la API pública de la NHTSA.
- Muestra información esencial del vehículo (año, marca, modelo, carrocería, etc.).
- Calcula un estimado (liability) y devuelve un total combinado (multi-vehículo hasta 5).
- Guarda lead + datos de vehículos en Google Sheets.
- Envía correos (cliente + interno) mediante Apps Script.
- Integra un chatbot en la landing para soporte y captura.

---

## Stack / Tecnologías
- **Frontend:** React + TypeScript (Vite)
- **VIN Decode:** NHTSA VIN Decode API
- **Automatización/Backend ligero:** Google Apps Script
- **Persistencia:** Google Sheets
- **Hosting:** Netlify
- **Herramientas:** Git/GitHub, Postman

---

## Estructura (alto nivel)
- **Frontend:** formulario + validaciones + UX móvil + multi-vehículo + total combinado
- **VIN Lookup:** consulta por VIN → normaliza datos → calcula estimado
- **Automatización:** Apps Script recibe payload → registra en Sheets → envía correos

---

## Nota sobre credenciales / reproducibilidad
Este repositorio **NO** incluye llaves, credenciales ni hojas internas.  
Las variables sensibles deben ir en archivos locales (por ejemplo `.env`) y en la configuración del despliegue. La demo pública **no expone credenciales**.

---

## Autor
Kevin Santiago Quimbaya Andrade  
GitHub: https://github.com/Naivelk
