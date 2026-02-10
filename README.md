# Intercoast – Cotizador por VIN (Formulario + Estimados + Leads)

Demo: https://intercoastformulario.netlify.app/

Formulario web para cotización de seguros de autos en California:
consulta el VIN con la API de decodificación de la NHTSA, calcula un estimado, registra el lead en Google Sheets y dispara correos automáticos. Incluye integración de chatbot en la landing para atención/captura de información.

---

## ¿Qué hace este proyecto?

- Decodifica VIN usando la API pública de la NHTSA.
- Muestra la información esencial del vehículo al usuario (año, marca, modelo, carrocería, etc.).
- Calcula un estimado (enfocado en cobertura económica / liability).
- Soporta múltiples vehículos (hasta 5) y entrega un total combinado.
- Guarda los datos del lead y los vehículos en Google Sheets.
- Envía correos (cliente + interno) mediante Apps Script.
- Integra un chatbot en la landing para soporte y captura.

---

## Stack / Tecnologías

- Frontend: React + TypeScript
- Integración VIN: NHTSA VIN Decode API
- Backend ligero / Automatización: Google Apps Script
- Persistencia: Google Sheets
- Hosting: Netlify

---

## Estructura (alto nivel)

- UI: formulario + validaciones + experiencia móvil
- Integración VIN: consulta por cada VIN, normaliza datos y calcula estimado
- Automatización: Apps Script recibe payload, registra en Sheets y envía correos

---

## Nota sobre credenciales / reproducibilidad

Este repositorio NO incluye llaves, credenciales ni hojas internas.
Las variables sensibles deben ir en archivos locales (por ejemplo `.env`) y en la configuración del despliegue.

---

## Autor

Kevin Santiago Quimbaya Andrade  
GitHub: https://github.com/Naivelk
