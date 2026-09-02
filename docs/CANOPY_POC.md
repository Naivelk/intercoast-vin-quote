# Canopy Connect — POC aislado

## Objetivo

Comprobar en **sandbox** si Canopy aporta pólizas, vehículos, coberturas y
documentos con calidad suficiente para complementar Policy 360. Este POC no
reemplaza Sentry, no toca Apps Script y no escribe datos en producción.

## Frontera de seguridad

- Canopy llama `POST /api/integrations/canopy/webhook`.
- Netlify verifica `canopy-signature` sobre el cuerpo JSON crudo con HMAC-SHA256.
- Se aceptan solo `AUTH_STATUS`, `POLICIES_AVAILABLE`, `COMPLETE` y `ERROR`.
- Para `POLICIES_AVAILABLE` y `COMPLETE`, el servidor consulta el Pull completo
  con HTTP Basic y lo traduce a `intercoast.canopy-pull` v1 solo en memoria.
- La respuesta contiene únicamente conteos. No contiene nombres, teléfonos,
  pólizas, VIN, documentos ni el `pull_id`.
- No hay persistencia, descarga de PDF, logs de cuerpos ni escritura hacia
  Sheets, Sentry, Calendar o Drive.
- Un cuerpo mayor de 1 MB se rechaza antes de interpretarlo.
- `CANOPY_POC_ENABLED=false` hace que la ruta falle cerrada con 404.

## Variables del servidor

Configurar en Netlify, nunca con prefijo `VITE_` y nunca en el repositorio:

```text
CANOPY_POC_ENABLED=false
CANOPY_TEAM_ID=
CANOPY_CLIENT_ID=
CANOPY_CLIENT_SECRET=
CANOPY_WEBHOOK_SECRET=
```

Las credenciales de sandbox y producción están separadas. Para probar, crear
exclusivamente una llave de sandbox y registrar el webhook con los eventos
`POLICIES_AVAILABLE`, `COMPLETE` y `ERROR`. El secreto de firma es distinto del
Client Secret.

## Contrato interno v1

El adaptador conserva solo lo necesario para medir utilidad:

- Pull: estado, proveedor y fecha.
- Póliza: número, tipo, carrier, estado, vigencia y prima.
- Vehículo: VIN, año, marca, modelo, serie y coberturas.
- Conductores: solo conteo en esta fase; no nombres ni licencias.
- Documentos: ID, tipo, título y relación con póliza; no descarga el archivo.

El endpoint del webhook no devuelve ese contrato. Solo devuelve los
conteos de pólizas, vehículos, conductores, coberturas y documentos procesados.

## Prueba local

```bash
npm run test:canopy
npm run build
```

Las pruebas usan datos completamente ficticios y cubren firma válida, cuerpo
alterado, reloj fuera de tolerancia, varias firmas, UUID, Basic Auth, mapeo y
ausencia de datos personales en el contrato.

## Criterio para avanzar

No activar producción por el simple hecho de que el webhook responda. Hacer
primero 10–20 Pulls consentidos de sandbox y medir:

1. carriers que realmente usa Intercoast y que Canopy cubre;
2. porcentaje con número, estado y fechas correctas;
3. vehículos y coberturas útiles frente a Sentry;
4. documentos disponibles;
5. tiempo, errores y pasos de MFA;
6. costo estimado por Pull productivo.

Solo después se decide si el siguiente paso es mostrar una vista temporal en
Policy 360. Persistir o fusionar datos requiere un contrato nuevo, procedencia
visible, deduplicación por `pull_id` y revisión específica de privacidad.
