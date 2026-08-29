# Panel operativo y seguimiento de leads

El sitio ya entrega estos campos extra a Apps Script: `estado`, `fuente`,
`utmSource`, `utmCampaign` y `proximoSeguimiento`.

## Columnas de la hoja

En la pestaña que recibe los leads, añade estas columnas al final, en este
orden: `Estado`, `Asesor`, `Fuente`, `UTM source`, `UTM campaign`, `Próximo
seguimiento`, `Último contacto`, `Notas`.

Estados recomendados: **Nuevo**, **Contactado**, **Cotizado**, **Vendido** y
**Perdido**. Aplica una validación de datos de tipo lista a la columna Estado.

## Panel operativo

La pestaña **Panel de Leads** resume el total de leads, los estados comerciales
y los seguimientos vencidos. Sus fórmulas leen la pestaña `Hoja 1`, por lo que
se actualiza automáticamente cuando entra una nueva cotización.

## Apps Script

En el `doPost(e)` actual, recoge los nuevos parámetros y escríbelos junto al
lead. El patrón es:

```js
const estado = e.parameter.estado || 'Nuevo';
const fuente = e.parameter.fuente || 'Sitio web';
const utmSource = e.parameter.utmSource || '';
const utmCampaign = e.parameter.utmCampaign || '';
const proximoSeguimiento = e.parameter.proximoSeguimiento || '';

// Al construir la fila, añade:
// estado, '', fuente, utmSource, utmCampaign, proximoSeguimiento, '', ''
```

## Seguimiento automático

Instala un disparador horario cada hora y usa una función parecida a esta.
Adapta los índices a las columnas reales de tu pestaña:

```js
function avisarLeadsSinContacto() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Leads');
  const values = sheet.getDataRange().getValues();
  const now = new Date();

  values.slice(1).forEach((row, index) => {
    const estado = row[/* índice Estado */];
    const proximo = row[/* índice Próximo seguimiento */];
    const asesor = row[/* índice Asesor */];
    if (estado === 'Nuevo' && proximo && new Date(proximo) <= now) {
      MailApp.sendEmail({
        to: 'TU_CORREO_INTERNO',
        subject: 'Seguimiento pendiente: ' + row[/* índice Nombre */],
        htmlBody: 'Lead nuevo pendiente. Asesor: ' + (asesor || 'sin asignar')
      });
      sheet.getRange(index + 2, /* columna Próximo seguimiento */).setValue(
        new Date(now.getTime() + 24 * 60 * 60 * 1000)
      );
    }
  });
}
```

No se automatiza el envío de WhatsApp sin un proveedor/API autorizado; el
asesor puede usar el enlace de WhatsApp preparado en el resultado de cotización.

El proyecto actual también incluye `avisarLeadsPendientes()`: notifica al correo
interno cuando un lead que sigue en estado **Nuevo** alcanza su próximo
seguimiento y reprograma el aviso para 24 horas después. El disparador horario
se crea automáticamente al recibir el próximo lead.
