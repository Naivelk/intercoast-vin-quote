# Protección del receptor de Google Apps Script

El frontend no conoce la URL de Apps Script: Netlify reenvía los leads con un
campo secreto llamado `relayToken`. El receptor compara ese valor con la
propiedad de script `LEADS_RELAY_TOKEN` antes de abrir la hoja o procesar
cualquier acción. No existe un valor de respaldo en el repositorio ni una ruta
pública para inicializar o reemplazar la propiedad.

En Netlify, `GOOGLE_APPS_SCRIPT_URL` y `LEADS_RELAY_TOKEN` son variables
secretas de servidor y nunca llevan el prefijo `VITE_`. El `doGet` solo devuelve
`OK`: no escribe filas, aunque reciba parámetros. Eva funciona con un flujo
local y no requiere credenciales de OpenAI.

Para rotar el relay hay que actualizar coordinadamente la propiedad de Apps
Script y la variable de Netlify. No publiques una versión que exija el token
nuevo hasta haber comprobado que ambos lados aceptan el mismo valor.

## Puente del centro de control

El administrador usa otro puente para consultar y encolar automatizaciones. La
función `netlify/functions/admin-tool.mjs` exige una sesión válida de Netlify
Identity y limita el acceso a los correos autorizados. Solo después reenvía la
petición al despliegue de la consola protegido por `PANEL_CLAVE`.

No agregues la URL ni la clave del puente al frontend. Deben permanecer como
variables de Netlify. Tampoco amplíes la lista de acciones sin agregar el mismo
comando a las listas blancas de Netlify y Apps Script y revisar si puede
modificar datos contables.
